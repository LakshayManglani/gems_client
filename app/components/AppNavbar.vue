<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui';

const open = ref(false)

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
    onSelect() {
      open.value = true
    }
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

</script>

<template>
  <div>
    <UNavigationMenu :items="displayItems"
      class="fixed border-default bg-default md:flex lg:hidden [&>div]:w-full px-2 z-50 bottom-0 left-0 right-0 border-t pt-2"
      :ui="{
        list: 'max-w-sm mx-auto',
        item: 'w-full py-0',
        link: 'flex-col w-full py-0',
      }" variant="link" />
    <div class="h-18.75 md:hidden" />

    <UDrawer v-model:open="open" :handle="false" handle-only dismissible inset>
      <template #body>
        <div class="max-h-[50vh] overflow-y-auto px-2">
          <UNavigationMenu :items="allItems" orientation="vertical" />
        </div>
      </template>

      <template #footer>
        <div>
          <USeparator />
          <div class="flex justify-between mt-2 items-center">
            <h2 class="text-highlighted font-semibold">Pages</h2>
            <UButton icon="i-lucide-x" color="neutral" variant="ghost" square @click="open = false" />
          </div>
        </div>
      </template>
    </UDrawer>
  </div>
</template>
