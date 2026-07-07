<script setup lang="ts">
import type { Gem } from '~/stores/types/gems';

const props = defineProps<{
  gem: Gem;
  currentIndex: number;
}>()

const assets = computed(() => props.gem.assets)

const selected = ref(0)

const mediaViewport = useTemplateRef('mediaViewport')
const carousel = useTemplateRef('carousel')

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

const firstTime = ref(true);

function onMainSelect(index: number) {
  if (firstTime.value) {
    firstTime.value = false;
    selected.value = props.currentIndex
    carousel.value?.emblaApi?.scrollTo(props.currentIndex, true)
  } else {
    selected.value = index
  }
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
</script>

<template>
  <div ref="mediaViewport"
    class="relative flex gap-4 aspect-video max-w-[calc(100vw-8rem)] max-h-[calc(100vh-4rem)] mx-auto">
    <div class="aspect-video">
      <UCarousel ref="carousel" :items="assets" :drag-free="false" class="rounded-md overflow-hidden"
        :ui="{ item: 'basis-full', viewport: 'cursor-grab active:cursor-grabbing' }" @select="onMainSelect">
        <template #default="{ item, index }">

          <NuxtImg v-if="item.type === 'image'" provider="cloudinary" :src="item.image?.public_id" width="1024"
            height="576" fit="cover" quality="auto" format="auto" class="w-full aspect-video object-cover rounded-md" />

          <video v-else :ref="(el) => setVideoRef(el, index)" @pointerdown="pauseVideo(index)"
            @pointerup="playVideo(index)" @pointercancel="playVideo(index)" @contextmenu.prevent loop muted playsinline
            webkit-playsinline disablePictureInPicture disableRemotePlayback preload="none"
            class="w-full aspect-video object-cover rounded-md" :src="item.video?.url" />
        </template>
      </UCarousel>

      <UBadge variant="subtle" color="neutral" class="absolute left-4 top-4">
        {{ selected + 1 }} / {{ assets.length }}
      </UBadge>
    </div>
  </div>
</template>
