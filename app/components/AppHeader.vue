<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui';
import platform from '~/utils/platform'

const items = ref<NavigationMenuItem[]>([
  {
    label: 'Gems',
    to: '/',
    icon: 'i-lucide-gem',
  },
  {
    label: 'Sell',
    to: '/sell',
    icon: 'i-lucide-store',
  },
  {
    label: 'Contact',
    to: '/contact',
    icon: 'i-lucide-phone',
  },
  {
    label: 'About',
    to: '/about',
    icon: 'i-lucide-info',
  },
]);

const mobileItems = ref<NavigationMenuItem[]>([
  {
    label: 'Main',
    open: true,
    children: items.value,
  },
  {
    label: 'Legal',
    children: [
      {
        label: 'Privacy Policy',
        to: '/legal/privacy-policy',
      },
      {
        label: 'Terms & Conditions',
        to: '/legal/terms-and-conditions',
      },
      {
        label: 'Refund Policy',
        to: '/legal/refund-policy',
      },
    ],
  },
]);
</script>

<template>

  <div class="sticky top-0 left-0 right-0 z-50">
    <UHeader :toggle="false" :title="platform.name" :ui="{
      left: 'flex-1',
    }" class="mx-auto bg-default left-0 right-0 border-b">
      <UNavigationMenu :items="items" />

      <template #right>
        <UColorModeButton />
        <UButton to="https://whatsapp.com" icon="logos:whatsapp-icon" square color="neutral" variant="ghost" />
      </template>

      <template #body>
        <UNavigationMenu :items="mobileItems" orientation="vertical" class="-mx-2.5" />
      </template>
    </UHeader>
  </div>
</template>
