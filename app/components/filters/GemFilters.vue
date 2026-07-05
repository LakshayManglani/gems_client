<script setup lang="ts">
import type { AccordionItem, CheckboxGroupItem } from '@nuxt/ui'
import type { useOptionFilter } from '~/composables/filters/useOptionFilter';
import type { useRangeFilter } from '~/composables/filters/useRangeFilter';
import RangeFilter from './RangeFilter.vue';
import OptionsFilter from './OptionsFilter.vue';
import type { useSortFilter } from '~/composables/filters/useSortFilter';

const props = defineProps<{
  price: ReturnType<typeof useRangeFilter>
  weight: ReturnType<typeof useRangeFilter>

  variety: ReturnType<typeof useOptionFilter>
  varietyItems: CheckboxGroupItem[];

  shape: ReturnType<typeof useOptionFilter>
  shapeItems: CheckboxGroupItem[];

  clarity: ReturnType<typeof useOptionFilter>
  clarityItems: CheckboxGroupItem[];

  sortBy: ReturnType<typeof useSortFilter>;
}>()

const active = ['0', '1']

const items: AccordionItem[] = [
  {
    label: 'Sort By',
    slot: 'sort',
  },
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
  <UAccordion :items="items" type="multiple" :default-value="active" :ui="{
    content: 'px-4'
  }">

    <template #sort>
      <UFormField class="pb-3.5">
        <USelect v-model="sortBy.model.value" value-key="id" :items="sortBy.items" class="w-full" />
      </UFormField>
    </template>

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
