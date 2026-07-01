<script setup lang="ts">
import type { CheckboxGroupItem } from '@nuxt/ui';

const props = defineProps<{
  model: Ref<string[]>;
  items: CheckboxGroupItem[];
}>()

const ui = {
  fieldset: 'pb-3.5 grid grid-cols-2 gap-2',
  container: 'hidden',
  item: 'text-center flex items-center',
}
</script>

<template>
  <UFormField class="pb-3.5">
    <UCheckboxGroup v-model="model.value" :items :ui color="primary" variant="card" size="sm" />
  </UFormField>
</template>
