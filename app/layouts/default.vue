<template>
  <AppContext>
    <NuxtPwaManifest />
    <NuxtRouteAnnouncer />
    <NuxtLoadingIndicator />

    <AppHeader />
    <UMain class="flex flex-col">
      <slot />
    </UMain>
    <AppFooter />
    <AppNavbar />
  </AppContext>
</template>
