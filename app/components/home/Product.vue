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
</script>

<template>
  <article
    class="flex flex-col overflow-hidden rounded-xl border border-transparent hover:border-muted bg-muted/40 hover:bg-muted transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">

    <!-- Image -->
    <NuxtLink :to="`/gems/${gem.id}`" class="relative aspect-square overflow-hidden">
      <img :src="primaryImage.image?.url" class="aspect-square object-cover object-center w-full scale-150" />

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
