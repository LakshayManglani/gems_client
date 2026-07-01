<script setup lang="ts">
import type { AccordionItem, CheckboxGroupItem } from '@nuxt/ui'
import type { useOptionFilter } from '~/composables/filters/useOptionFilter';
import type { useRangeFilter } from '~/composables/filters/useRangeFilter';
import RangeFilter from './RangeFilter.vue';
import OptionsFilter from './OptionsFilter.vue';

const props = defineProps<{
  price: ReturnType<typeof useRangeFilter>
  weight: ReturnType<typeof useRangeFilter>

  variety: ReturnType<typeof useOptionFilter>
  varietyItems: CheckboxGroupItem[];

  shape: ReturnType<typeof useOptionFilter>
  shapeItems: CheckboxGroupItem[];

  clarity: ReturnType<typeof useOptionFilter>
  clarityItems: CheckboxGroupItem[];
}>()

const active = ['0', '1']

const items: AccordionItem[] = [
  {
    label: 'Price',
    slot: 'price',
  },
  {
    label: 'Variety',
    slot: 'variety',
  },
  {
    label: 'Weight (ct)',
    slot: 'weight',
  },
  {
    label: 'Shape',
    slot: 'shape',
  },
  {
    label: 'Clarity',
    slot: 'clarity',
  },
]
</script>

<template>
  <UAccordion :items="items" type="multiple" :default-value="active">

    <template #price>
      <RangeFilter v-bind="price" icon="i-lucide-indian-rupee" />
    </template>

    <template #weight>
      <RangeFilter v-bind="weight" />
    </template>

    <template #shape>
      <OptionsFilter v-bind="shape" :items="shapeItems" />
    </template>

    <template #variety>
      <OptionsFilter v-bind="variety" :items="varietyItems" />
    </template>

    <template #clarity>
      <OptionsFilter v-bind="clarity" :items="clarityItems" />
    </template>
  </UAccordion>
</template>
