<script setup lang="ts">
import type { Gem } from '~/stores/types/gems';

const props = defineProps<{
  gem: Gem
}>()

const assets = computed(() => props.gem.assets)

const selected = ref(0)

const mediaViewport = useTemplateRef('mediaViewport')
const carousel = useTemplateRef('carousel')
const thumbs = useTemplateRef('thumbs')

const videoRefs: (HTMLVideoElement | null)[] = []

function setVideoRef(el: Element | ComponentPublicInstance | null, index: number) {
  videoRefs[index] = (el as HTMLVideoElement) ?? null
}

const inViewport = ref(true)
let observer: IntersectionObserver | undefined

function playVideo(index: number) {
  const item = assets.value[index]
  if (item?.type !== 'video') return
  if (document.hidden || !inViewport.value) return

  videoRefs[index]?.play().catch(() => {
    // Autoplay can be rejected if no user gesture has happened yet (e.g. first
    // slide on page load) — harmless, playback just starts on the next gesture.
  })
}

function pauseVideo(index: number) {
  videoRefs[index]?.pause()
}

function stopVideo(index: number) {
  const el = videoRefs[index]
  if (!el) return
  el.pause()
  el.currentTime = 0
}

function onMainSelect(index: number) {
  selected.value = index
  thumbs.value?.emblaApi?.scrollTo(index)
}

function onThumbSelect(index: number) {
  selected.value = index
  carousel.value?.emblaApi?.scrollTo(index)
}

function onVisibilityChange() {
  if (document.hidden) {
    pauseVideo(selected.value)
  } else {
    playVideo(selected.value)
  }
}


// Single source of truth for playback: whenever the active slide changes
// (however it changed — drag, thumbnail click, programmatic scrollTo), stop
// whatever was playing and start the new slide if it's a video.
watch(selected, (newIndex, oldIndex) => {
  if (oldIndex !== newIndex) stopVideo(oldIndex)
  setTimeout(() => playVideo(newIndex), 500);
})

onMounted(() => {
  // Play the initial slide if it happens to be a video.
  playVideo(selected.value)

  if (mediaViewport.value) {
    observer = new IntersectionObserver(
      ([entry]) => {
        inViewport.value = entry?.isIntersecting ?? false
        if (entry?.isIntersecting) {
          playVideo(selected.value)
        } else {
          pauseVideo(selected.value)
        }
      },
      { threshold: 0.8 }
    )
    observer.observe(mediaViewport.value)
  }

  document.addEventListener('visibilitychange', onVisibilityChange)
})

onBeforeUnmount(() => {
  observer?.disconnect()
  document.removeEventListener('visibilitychange', onVisibilityChange)
  stopVideo(selected.value)
})

const open = ref(false);

watch(open, (nextOpen) => {
  if (nextOpen) {
    pauseVideo(selected.value)
  } else {
    playVideo(selected.value)
  }
})
</script>

<template>
  <div class="flex-1 sticky lg:top-[calc(var(--ui-header-height)+2rem)] h-fit">
    <AppCard class="flex-1 md:p-4 md:pb-0">
      <div ref="mediaViewport" class="relative">

        <!-- main caro -->
        <UCarousel ref="carousel" :items="assets" :drag-free="false" class="rounded-md overflow-hidden"
          :ui="{ item: 'basis-full', viewport: 'cursor-grab active:cursor-grabbing' }" @select="onMainSelect">
          <template #default="{ item, index }">

            <NuxtImg v-if="item.type === 'image'" provider="cloudinary" :src="item.image?.public_id" width="1024"
              height="576" fit="cover" quality="auto" format="auto"
              class="w-full aspect-video object-cover rounded-md" />

            <video v-else :ref="(el) => setVideoRef(el, index)" @pointerdown="pauseVideo(index)"
              @pointerup="playVideo(index)" @pointercancel="playVideo(index)" @contextmenu.prevent loop muted
              playsinline webkit-playsinline disablePictureInPicture disableRemotePlayback preload="none"
              class="w-full aspect-video object-cover rounded-md" :src="item.video?.url" />
          </template>
        </UCarousel>

        <UBadge variant="subtle" color="neutral" class="absolute left-4 top-4">
          {{ selected + 1 }} / {{ assets.length }}
        </UBadge>

        <UModal :ui="{
          content: 'max-w-[calc(100vw-8rem)] max-h-[calc(100vh-4rem)] bg-transparent ring-transparent'
        }" v-model:open="open">
          <div>
            <UButton color="neutral" icon="i-lucide-maximize" variant="subtle"
              class="absolute right-4 top-4 hidden md:flex rounded-full" square />
          </div>

          <template #content>
            <GemIdFullScreenGallery :gem :currentIndex="selected" />
          </template>
        </UModal>
      </div>

      <UCarousel ref="thumbs" :items="assets" class="py-4" :ui="{
        item: 'basis-[23%] lg:basis-[16%] items-center justify-center flex ps-0',
        prev: '-start-0 lg:start-0',
        next: '-end-0 lg:end-0',
        container: 'ms-0 py-4 mr-4 gap-4 px-4',
        viewport: 'cursor-grab active:cursor-grabbing'
      }" contain-scroll="keepSnaps" align="center" dragfree :slidesToScroll="1" skipSnaps :drag-threshold="5">
        <template #default="{ item, index }">
          <button @click="() => onThumbSelect(index)"
            class="relative rounded-md overflow-hidden duration-300 cursor-grab active:cursor-grabbing" :class="{
              'ring-2 ring-primary ring-offset-2 ring-offset-default scale-110': selected === index
            }">
            <NuxtImg v-if="item.type === 'image'" provider="cloudinary" :src="item.image?.public_id" width="120"
              height="120" fit="cover" quality="auto" format="auto" class="object-cover aspect-square" />

            <NuxtImg v-else src="https://placehold.co/120x120?text=video" width="120" height="120" fit="cover"
              quality="auto" format="auto" class="rounded-lg" />
          </button>
        </template>
      </UCarousel>
    </AppCard>
  </div>
</template>
