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
</script>

<template>
  <article
    class="group flex flex-col rounded-lg transition hover:shadow-md border border-transparent hover:border-accented duration-300">
    <!-- Image -->
    <NuxtLink :to="`/gems/${gem.id}`"
      class="relative aspect-square overflow-hidden rounded-lg group-hover:rounded-b-none duration-300">
      <img :src="primaryImage.image?.url"
        class="aspect-square object-cover w-full transition-transform duration-300 scale-120 group-hover:scale-200" />
    </NuxtLink>

    <!-- Content -->
    <div class="p-4 pt-2">
      <NuxtLink :to="`/gems/${gem.id}`" class="block">
        <p class="line-clamp-2 text-primary font-medium group-hover:underline">
          {{ gem.weight }} ct
        </p>
      </NuxtLink>

      <p class="flex gap-1 text-sm text-muted">
        {{ lowerCase(gem.variety) }}
        {{ lowerCase(gem.clarity) }}
        <span>•</span>
        {{ lowerCase(gem.shape) }}
      </p>
    </div>
  </article>
</template>
