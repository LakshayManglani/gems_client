<script setup lang="ts">
import { useGemById } from '~/composables/useGemById'

const { gem } = await useGemById()

if (!gem.value) {
  throw new Error('Gem not found')
}

const productLabel = computed(() => {
  if (gem.value) {
    const temp = gem.value.variety;
    const firstChar = temp.charAt(0).toUpperCase();
    const subStr = temp.slice(1)
    return firstChar + subStr;
  }
  return ''
})

const breadcrumbs = computed(() => [
  { label: 'Gems', to: '/gems' },
  { label: productLabel.value }
])
</script>

<template>
  <UContainer v-if="gem" class="py-8 pt-4 flex flex-col flex-1 gap-4">
    <UBreadcrumb :items="breadcrumbs" />
    <div class="flex flex-col md:flex-row flex-1 gap-8">
      <GemIdGallery :gem />

      <div class="flex-1 flex flex-col gap-8">
        <GemIdSummary :gem />

        <GemIdSpecifications :gem />
      </div>
    </div>
  </UContainer>
</template>
