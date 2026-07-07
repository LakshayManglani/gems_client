<script setup lang="ts">
import type { Gem } from '~/stores/types/gems';

const props = defineProps<{
  gem: Gem
}>()

const whatsappLink = computed(() => {
  const text = encodeURIComponent(
    `Hi, I'm interested in ${props.gem.variety} (${props.gem.inventory_code}).`
  )

  return `https://wa.me/YOUR_NUMBER?text=${text}`
})

const price = computed(() => formatPrice(props.gem.price ?? 0))

const formatPrice = (value: number) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
  }).format(value)


const trust = [
  { label: 'Certified natural', icon: 'i-lucide-badge-check' },
  { label: 'Easy returns', icon: 'i-lucide-truck' },
  { label: 'Cash on delivery', icon: 'i-lucide-banknote' },
]
</script>

<template>
  <AppCard class="p-4 flex flex-col gap-4">
    <div>
      <p class="flex items-center gap-1.5 text-sm text-muted mb-1">
        <UIcon name="i-lucide-gem" class="size-4" />
        Natural {{ gem.variety }}
      </p>
      <h1 class="text-2xl font-semibold text-highlighted leading-tight">
        {{ gem.weight }} ct {{ gem.variety }}
      </h1>
    </div>

    <div>
      <p class="text-3xl text-primary font-semibold leading-tight">
        {{ price }}
      </p>
      <p class="text-sm text-muted">per carat</p>
    </div>

    <p>Total: {{ formatPrice(gem.price * gem.weight) }}</p>

    <UButton size="xl" block label="Order on WhatsApp" :to="whatsappLink" icon="logos:whatsapp-icon" color="primary"
      variant="solid" class="mt-2" />

    <div class="flex items-start justify-between pt-4 border-t border-default">
      <div v-for="item in trust" :key="item.label" class="flex flex-col items-center gap-1.5 text-center flex-1 px-1">
        <UIcon :name="item.icon" class="size-4 text-primary" />
        <span class="text-xs text-muted leading-tight">{{ item.label }}</span>
      </div>
    </div>
  </AppCard>
</template>
