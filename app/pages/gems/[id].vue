<script setup lang="ts">
import { useGemById } from '~/composables/useGemById';

const { gem } = await useGemById();

if (!gem.value) {
  throw new Error('Gem not found')
}

const primaryImage = gem.value.images.find((image) => image.id === gem.value?.thumbnail_image_id);

if (!primaryImage) {
  throw new Error('Image not found')
}

const selectedImage = ref(primaryImage.url);
</script>

<template>
  <UContainer class="py-8">
    <!-- Content -->
    <template v-if="gem">
      <!-- Back -->
      <UButton to="/gems" variant="ghost" color="neutral" icon="i-lucide-arrow-left" class="mb-6">
        Back to Gems
      </UButton>

      <div class="grid gap-8 lg:grid-cols-2">
        <!-- Images -->
        <div class="space-y-4">
          <!-- Main Image -->
          <UCard :ui="{ body: 'p-0' }" class="overflow-hidden">
            <div class="aspect-square bg-gray-100 dark:bg-gray-800">
              <img v-if="selectedImage" :src="selectedImage" :alt="gem.inventory_code"
                class="h-full w-full object-cover" />

              <div v-else class="flex h-full items-center justify-center text-sm text-gray-400">
                No image available
              </div>
            </div>
          </UCard>

          <!-- Thumbnails -->
          <div v-if="gem.images.length > 1" class="grid grid-cols-4 gap-3">
            <button v-for="image in gem.images" :key="image.id" type="button"
              class="overflow-hidden rounded-lg border-2 transition" :class="selectedImage === image.url
                ? 'border-primary'
                : 'border-transparent'
                " @click="selectedImage = image.url">
              <img :src="image.url" :alt="image.alt_text || gem.inventory_code"
                class="aspect-square w-full object-cover" />
            </button>
          </div>
        </div>

        <!-- Details -->
        <div class="space-y-6">
          <!-- Header -->
          <div>
            <UBadge color="primary" variant="soft" class="mb-3">
              {{ gem.variety }}
            </UBadge>

            <h1 class="text-3xl font-bold tracking-tight">
              {{ gem.inventory_code }}
            </h1>

            <p class="mt-3 text-3xl font-semibold">
              ₹{{ gem.price }}
            </p>
          </div>

          <!-- Key Specs -->
          <UCard>
            <template #header>
              <h2 class="font-semibold">Specifications</h2>
            </template>

            <div class="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p class="text-gray-500 dark:text-gray-400">
                  Weight
                </p>
                <p class="font-medium">
                  {{ gem.weight }} ct
                </p>
              </div>

              <div>
                <p class="text-gray-500 dark:text-gray-400">
                  Shape
                </p>
                <p class="font-medium">
                  {{ gem.shape }}
                </p>
              </div>

              <div>
                <p class="text-gray-500 dark:text-gray-400">
                  Clarity
                </p>
                <p class="font-medium">
                  {{ gem.clarity }}
                </p>
              </div>

              <div>
                <p class="text-gray-500 dark:text-gray-400">
                  Variety
                </p>
                <p class="font-medium">
                  {{ gem.variety }}
                </p>
              </div>
            </div>
          </UCard>

          <!-- Dimensions -->
          <UCard>
            <template #header>
              <h2 class="font-semibold">Dimensions (mm)</h2>
            </template>

            <div class="grid grid-cols-3 gap-4 text-sm">
              <div>
                <p class="text-gray-500 dark:text-gray-400">
                  Length
                </p>
                <p class="font-medium">
                  {{ gem.dimension_length }}
                </p>
              </div>

              <div>
                <p class="text-gray-500 dark:text-gray-400">
                  Width
                </p>
                <p class="font-medium">
                  {{ gem.dimension_width }}
                </p>
              </div>

              <div>
                <p class="text-gray-500 dark:text-gray-400">
                  Height
                </p>
                <p class="font-medium">
                  {{ gem.dimension_height }}
                </p>
              </div>
            </div>
          </UCard>

          <!-- Metadata -->
          <UCard>
            <template #header>
              <h2 class="font-semibold">Metadata</h2>
            </template>

            <div class="space-y-3 text-sm">
              <div class="flex justify-between gap-4">
                <span class="text-gray-500 dark:text-gray-400">
                  ID
                </span>
                <span class="font-mono text-xs break-all text-right">
                  {{ gem.id }}
                </span>
              </div>

              <div class="flex justify-between gap-4">
                <span class="text-gray-500 dark:text-gray-400">
                  Created
                </span>
                <span>
                  {{ new Date(gem.created_at).toLocaleString() }}
                </span>
              </div>

              <div class="flex justify-between gap-4">
                <span class="text-gray-500 dark:text-gray-400">
                  Updated
                </span>
                <span>
                  {{ new Date(gem.updated_at).toLocaleString() }}
                </span>
              </div>
            </div>
          </UCard>
        </div>
      </div>
    </template>
  </UContainer>
</template>
