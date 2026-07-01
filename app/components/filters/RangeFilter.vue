<script setup lang="ts">
const props = defineProps<{
  model: Ref<[number, number]>;

  min: number;
  max: number;

  step: number;
  minStepsBetweenThumbs: number;

  icon?: string;
}>()
</script>

<template>
  <UFormField class="pb-3.5">
    <div class="mb-3 grid grid-cols-2 gap-3">
      <UFormField label="Min">
        <UInput v-model.number="model.value[0]" type="number" :icon :min :max />
      </UFormField>

      <UFormField label="Max">
        <UInput v-model.number="model.value[1]" type="number" :icon :min :max />
      </UFormField>
    </div>

    <div class="px-1">
      <USlider v-model="model.value" :min :max :step :minStepsBetweenThumbs />
    </div>
  </UFormField>
</template>
