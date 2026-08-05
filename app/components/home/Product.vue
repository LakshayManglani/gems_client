<script setup lang="ts">
import lowerCase from '~/utils/lowerCase';

const { gemId } = defineProps<{
  gemId: string;
}>();

const gemsStore = useGemsStore();

const gem = computed(() => gemsStore.getById(gemId));

const imageLoading = ref(true);
const videoLoading = ref(true);

const primaryImage = computed(() => gem.value?.assets.find((asset) => asset.type === 'image'));

const price = computed(() => formatPrice(gem.value?.price ?? 0));

const formatPrice = (value: number) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
  }).format(value)


const video = computed(() => gem.value?.assets.find(a => a.type === 'video'))

const showVideo = ref(false)

let hoverTimer: ReturnType<typeof setTimeout> | null = null

const mediaViewportRef = useTemplateRef("mediaViewportRef")

let videoRef: (HTMLVideoElement | null) = null;

let observer: IntersectionObserver | null = null


function toggleVideo() {
  if (showVideo.value) {
    stopVideo();
  } else {
    startVideo();
  }
}

function startVideo() {
  showVideo.value = true

  nextTick(() => {
    if (videoRef) {
      videoRef.play().catch(() => { })
    }
  })
}


function stopVideo() {
  showVideo.value = false

  if (videoRef) {
    videoRef.pause()
    videoRef.currentTime = 0
  }
}

let canHover = false;

if (import.meta.client) {
  canHover = window.matchMedia('(hover: hover)').matches
}

function onMouseEnter() {
  if (!canHover || !video.value) return

  hoverTimer = setTimeout(() => {
    startVideo()
  }, 0)
}

function onMouseLeave() {
  if (!canHover || !video.value) return

  if (hoverTimer) {
    clearTimeout(hoverTimer)
    hoverTimer = null
  }

  stopVideo()
}

onMounted(() => {
  observer = new IntersectionObserver(
    ([entry]) => {
      if (!entry?.isIntersecting) {
        if (showVideo.value) {
          stopVideo()
        }
      }
    },
    {
      threshold: 0.70
    }
  )

  if (mediaViewportRef.value) {
    observer.observe(mediaViewportRef.value)
  }
})

onBeforeUnmount(() => {
  observer?.disconnect()

  if (hoverTimer) {
    clearTimeout(hoverTimer)
  }
})

function setVideoRef(el: Element | ComponentPublicInstance | null) {
  videoRef = (el as HTMLVideoElement) ?? null
}

const posterUrl = computed(() => {
  const url = video.value?.video?.url;
  if (!url) return '';

  return url.replace(/\.[^/.]+$/, '.jpg');
});
</script>

<template>
  <AppCard class="hover:-translate-y-1 group hover:scale-105" v-if="gem">
    <article class="flex flex-col" @mouseenter="onMouseEnter" @mouseleave="onMouseLeave">

      <!-- Image -->
      <NuxtLink :to="`/gems/${gem.id}`"
        class="relative aspect-square overflow-hidden rounded-md overflow-hidden hover:rounded-sm">
        <div ref="mediaViewportRef" class="aspect-square overflow-hidden">
          <!-- Image -->
          <div class="absolute inset-0 transition-all duration-300" :class="{
            'opacity-0': !(imageLoading || videoLoading)
          }">
            <USkeleton class="absolute inset-0 transition-opacity duration-300" />
          </div>

          <!-- <NuxtImg provider="cloudinary" :src="primaryImage?.image?.public_id" :modifiers="{ -->
          <!--   transformation: 'product-card' -->
          <!-- }" class="absolute aspect-square object-cover w-full transition-all duration-300" :class="{ -->
          <!--   '': showVideo, -->
          <!--   'opacity-0': imageLoading -->
          <!-- }" @load="imageLoading = false" /> -->

          <video :ref="(el) => setVideoRef(el)" :poster="posterUrl" :src="`${video?.video?.url}#t=0.001`"
            class="absolute inset-0 h-full w-full object-cover duration-300 transition-all" muted loop playsinline
            preload="none" :class="{
            }" @loadeddata="videoLoading = false" />
        </div>


        <UBadge color="neutral" variant="solid"
          class="absolute bottom-2 left-2 bg-inverted/50 backdrop-blur font-heading font-bold text-sm group-hover:bg-inverted/50 duration-300">
          <UIcon name="i-lucide-gem" />
          <span>{{ lowerCase(gem.variety) }}</span>
        </UBadge>

        <UButton v-if="video" class="absolute bottom-2 right-2 bg-inverted/50 backdrop-blur"
          :icon="showVideo ? 'i-lucide-image' : 'i-lucide-play'" color="neutral" variant="solid"
          @click.prevent="toggleVideo" size="sm">
          {{ showVideo ? 'Image' : 'Video' }}
        </UButton>
      </NuxtLink>

      <!-- Content -->
      <div class="p-4">
        <NuxtLink :to="`/gems/${gem.id}`" class="block">
          <p class="text-2xl group-hover:text-highlighted font-semibold leading-tight font-mono duration-300">
            {{ price }}
          </p>
          <p class="text-sm text-dimmed">per carat</p>
        </NuxtLink>

        <USeparator class="my-3" />

        <div
          class="flex gap-1 text-sm text-muted flex-wrap justify-between items-center group-hover:text-default duration-300">
          <div class="flex items-center justify-center gap-2">
            <UIcon name="i-lucide-weight" />
            <span class="font-mono">{{ gem.weight }}</span>
            <span>ct</span>
          </div>

          <div class="flex items-center justify-center gap-2">
            <UIcon name="i-lucide-shapes" />
            <span>{{ lowerCase(gem.shape) }} </span>
          </div>
        </div>
      </div>
    </article>

  </AppCard>
</template>
