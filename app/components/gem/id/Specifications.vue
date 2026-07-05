<script setup lang="ts">
import type { Gem } from '~/stores/types/gems';

const { gem } = defineProps<{
  gem: Gem
}>()

const specs = computed(() => [
  {
    label: 'SKU',
    value: gem.inventory_code,
    icon: 'i-lucide-package-search'
  },
  {
    label: 'Variety',
    value: gem.variety,
    icon: 'i-lucide-gem'
  },
  {
    label: 'Weight',
    value: gem.weight,
    icon: 'i-lucide-scale'
  },
  {
    label: 'Shape',
    value: gem.shape,
    icon: 'i-lucide-pentagon'
  },
  {
    label: 'Clarity',
    value: gem.clarity,
    icon: 'i-lucide-sparkles'
  },
  {
    label: 'Dimensions',
    value: `${!!gem.dimension_height ? gem.dimension_height : '_'} × ${!!gem.dimension_width ? gem.dimension_width : '_'} × ${gem.dimension_length ? gem.dimension_length : '_'}`,
    icon: 'i-lucide-ruler'
  }
])
</script>

<template>

  <div
    class="rounded-xl border border-transparent hover:border-muted bg-muted/20 hover:bg-muted/40 duration-300 hover:shadow-xl p-4">
    <p class="text-highlighted font-semibold mb-1">Specifications</p>
    <div class="divide-y divide-default">
      <div v-for="spec in specs" :key="spec.label" class="grid grid-cols-2 gap-4 py-3">
        <div class="flex items-center gap-2 text-muted">
          <UIcon :name="spec.icon" class="size-4" />
          <span class="font-medium">{{ spec.label }}</span>
        </div>
        <div class="text-end text-highlighted">
          {{ spec.value }}
        </div>
      </div>
    </div>
  </div>

</template>
