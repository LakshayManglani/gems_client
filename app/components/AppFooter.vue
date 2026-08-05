<script setup lang="ts">
import platform from '~/utils/platform'

const columns = [
  {
    label: 'Company',
    children: [
      {
        label: 'Gems',
        to: '/',
      },
      {
        label: 'Sell',
        to: '/sell',
      },
      {
        label: 'Contact',
        to: '/contact',
      },
      {
        label: 'About',
        to: '/about',
      },
    ],
  },
  {
    label: 'Policies',
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
    <USeparator class="h-px">
      <UIcon :name="platform.logo" size="16" />
    </USeparator>

    <UFooter :ui="{ top: 'border-b border-default' }">
      <template #top>
        <UContainer>
          <UFooterColumns :columns="columns">
            <template #left>
              <div class="text-highlighted font-bold">
                {{ platform.name }}
              </div>
              <div class="text-muted">Curated natural & certified gemstones.</div>
            </template>
          </UFooterColumns>
        </UContainer>
      </template>

      <template #left>
        <p class="text-sm text-muted">
          © {{ new Date().getFullYear() }} {{ platform.name }}. All rights reserved.
        </p>
      </template>

      <template #right>
        <UButton to="https://whatsapp.com" icon="logos:whatsapp-icon" square color="neutral" variant="ghost" />
      </template>
    </UFooter>
  </div>
</template>
