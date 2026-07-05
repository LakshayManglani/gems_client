<script setup lang="ts">

const { gemId } = defineProps<{
  gemId: string;
}>();

const gemsStore = useGemsStore();

const gem = gemsStore.getById(gemId);

if (!gem) {
  throw new Error('Gem not found')
}

const primaryImage = gem.assets.find((asset) => asset.type === 'image');

if (!primaryImage) {
  throw new Error('Image not found')
}

const price = computed(() => formatPrice(gem.price));

const formatPrice = (value: number) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
  }).format(value)


const video = gem.assets.find(a => a.type === 'video')

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
      console.log("play")
    }
  })
}


function stopVideo() {
  showVideo.value = false

  if (videoRef) {
    videoRef.pause()
    videoRef.currentTime = 0
    console.log("stop")
  }
}

const canHover = window.matchMedia('(hover: hover)').matches

function onMouseEnter() {
  if (!canHover || !video) return

  hoverTimer = setTimeout(() => {
    console.log("hello")
    startVideo()
  }, 750)
}

function onMouseLeave() {
  if (!canHover || !video) return

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
</script>

<template>
  <article
    class="flex flex-col overflow-hidden rounded-xl border border-transparent hover:border-muted bg-muted/40 hover:bg-muted transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
    @mouseenter="onMouseEnter" @mouseleave="onMouseLeave">

    <!-- Image -->
    <NuxtLink :to="`/gems/${gem.id}`" class="relative aspect-square overflow-hidden">
      <div ref="mediaViewportRef" class="aspect-square">
        <NuxtImg v-show="!showVideo" provider="cloudinary" :src="primaryImage.image?.public_id" :modifiers="{
          transformation: 'product-card'
        }" class="aspect-square object-cover w-full rounded-md" />
        <!-- Video -->
        <video :ref="(el) => setVideoRef(el)" :src="video?.video?.url" v-show="showVideo"
          class="h-full w-full object-cover" muted loop playsinline preload="none" />
      </div>

      <UButton v-if="video" class="absolute bottom-2 right-2" :icon="showVideo ? 'i-lucide-image' : 'i-lucide-play'"
        color="neutral" variant="solid" @click.prevent="toggleVideo" size="sm">
        {{ showVideo ? 'Image' : 'Video' }}
      </UButton>


      <UBadge color="neutral" variant="solid" class="absolute bottom-2 left-2 bg-inverted/50 backdrop-blur">
        <UIcon name="i-lucide-gem" />
        <span>{{ lowerCase(gem.variety) }}</span>
      </UBadge>
    </NuxtLink>

    <!-- Content -->
    <div class="p-4">
      <NuxtLink :to="`/gems/${gem.id}`" class="block">
        <p class="text-2xl text-highlighted font-semibold leading-tight">
          {{ price }}
        </p>
        <p class="text-sm text-muted">per carat</p>
      </NuxtLink>

      <USeparator class="my-3" />

      <div class="flex gap-1 text-sm text-muted flex-wrap justify-between items-center ">
        <div class="flex items-center justify-center gap-2">
          <UIcon name="i-lucide-weight" />
          <span class="text-highlighted">{{ gem.weight }} ct</span>
        </div>

        <div class="flex items-center justify-center gap-2">
          <UIcon name="i-lucide-shapes" />
          <span class="text-highlighted">{{ lowerCase(gem.shape) }} </span>
        </div>
      </div>
    </div>
  </article>
</template>
