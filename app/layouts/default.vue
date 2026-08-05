<template>
  <AppContext>
    <NuxtPwaManifest />
    <NuxtRouteAnnouncer />
    <NuxtLoadingIndicator />

    <AppHeader />
    <UMain class="flex flex-col relative">
      <slot />
    </UMain>
    <AppFooter />
    <AppNavbar />
  </AppContext>
</template>
