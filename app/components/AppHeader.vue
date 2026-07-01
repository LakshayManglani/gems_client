<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui';

const items = ref<NavigationMenuItem[]>([
  {
    label: 'Home',
    to: '/',
    icon: 'i-lucide-home',
  },
  {
    label: 'Gems',
    to: '/gems',
    icon: 'i-lucide-gem',
  },
  {
    label: 'About',
    to: '/about',
    icon: 'i-lucide-info',
  },
  {
    label: 'Sell With Us',
    to: '/sell-with-us',
    icon: 'i-lucide-store',
  },
  {
    label: 'Contact',
    to: '/contact',
    icon: 'i-lucide-phone',
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
  <div class="sticky top-0 left-0 right-0 z-50 bg-default">
    <UHeader toggle-side="left" :title="platform.name" :ui="{
      left: 'flex-1',
      title: 'mx-auto lg:mx-0 w-max items-center pl-11 lg:pl-0',
    }">
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
