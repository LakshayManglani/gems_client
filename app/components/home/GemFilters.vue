<script setup lang="ts">
import type { AccordionItem } from '@nuxt/ui'
// import type { useSortFilter } from '~/composables/filters/useSortFilter';
import useGemFilters from '~/composables/home/useGemFilters';
import RangeFilter from '../filters/RangeFilter.vue';
import OptionsFilter from '../filters/OptionsFilter.vue';


const props = defineProps<{
  filters: ReturnType<typeof useGemFilters>
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
        <USelect v-model="filters.items.sort.model.value" value-key="id" :items="filters.items.sort.items"
          class="w-full" />
      </UFormField>
    </template>

    <template #price>
      <RangeFilter v-bind="filters.items.price" icon="i-lucide-indian-rupee" />
    </template>

    <template #weight>
      <RangeFilter v-bind="filters.items.weight" />
    </template>

    <template #shape>
      <OptionsFilter v-bind="filters.items.shape" :items="filters.items.shape.keys" />
    </template>

    <template #variety>
      <OptionsFilter v-bind="filters.items.variety" :items="filters.items.variety.keys" />
    </template>

    <template #clarity>
      <OptionsFilter v-bind="filters.items.clarity" :items="filters.items.clarity.keys" />
    </template>
  </UAccordion>
</template>
