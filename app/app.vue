<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const items: NavigationMenuItem[] = [{
  label: 'Temp',
  to: '#',
  target: '_blank'
}, {
  label: 'Temp',
  to: '#',
  target: '_blank'
}, {
  label: 'Temp',
  to: '#',
  target: '_blank'
}]
</script>

<template>
  <UApp>
    <NuxtRouteAnnouncer />
    <UHeader title="Gems" />

    <NuxtPage />

    <USeparator icon="i-simple-icons-nuxtdotjs" type="dashed" class="h-px" />

    <UFooter>
      <template #left>
        <p class="text-muted text-sm">
          Copyright © {{ new Date().getFullYear() }}
        </p>
      </template>

      <UNavigationMenu :items="items" variant="link" />

      <template #right>
        <UButton icon="i-simple-icons-whatsapp" color="neutral" variant="ghost" to="#" target="_blank"
          aria-label="Whatsapp" />
        <UButton icon="i-simple-icons-instagram" color="neutral" variant="ghost" to="#" target="_blank"
          aria-label="Instagram" />
        <UButton icon="i-simple-icons-facebook" color="neutral" variant="ghost" to="#" target="_blank"
          aria-label="Facebook" />
      </template>
    </UFooter>
  </UApp>
</template>
