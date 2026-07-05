<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui';

const items: NavigationMenuItem[] = [
  {
    label: 'Gems',
    to: '/gems',
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
];

const displayItems: NavigationMenuItem[] = [
  ...items,
  {
    label: 'More',
    icon: 'i-lucide-ellipsis-vertical',
    slot: 'more' as const,
  }
]

const mainItems: NavigationMenuItem[] = [
  ...items,
  {
    label: 'About',
    to: '/about',
    icon: 'i-lucide-info',
  }
]

const allItems: NavigationMenuItem[] = [
  {
    label: 'Main',
    open: true,
    children: mainItems,
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
];

const open = ref(false)
</script>

<template>
  <UNavigationMenu :items="displayItems"
    class="fixed border-default bg-default md:hidden [&>div]:w-full px-2 z-50 bottom-0 left-0 right-0 border-t pt-2"
    :ui="{
      list: 'max-w-sm mx-auto',
      item: 'w-full py-0',
      link: 'flex-col w-full py-0',
    }" variant="link">

    <template #more>
      <UDrawer v-model:open="open" :handle="false" handle-only dismissible inset>
        <UButton label="More" icon="i-lucide-ellipsis-vertical" variant="link" color="neutral"
          class="lg:hidden flex-col" :ui="{
            leadingIcon: 'text-dimmed'
          }" />

        <template #body>
          <div class="max-h-[50vh] overflow-y-auto px-2">
            <UNavigationMenu :items="allItems" orientation="vertical" />
          </div>
        </template>

        <template #footer>
          <USeparator />
          <div class="flex justify-between mt-2 items-center">
            <h2 class="text-highlighted font-semibold">Pages</h2>
            <UButton icon="i-lucide-x" color="neutral" variant="ghost" square @click="open = false" />
          </div>
        </template>
      </UDrawer>
    </template>

  </UNavigationMenu>
  <div class="h-18.75 md:hidden" />
</template>
