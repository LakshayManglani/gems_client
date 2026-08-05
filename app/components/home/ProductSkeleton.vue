<template>
  <AppCard class="hover:-translate-y-1 group hover:scale-105">
    <article class="flex flex-col">
      <!-- Image -->
      <div class="relative aspect-square overflow-hidden">
        <USkeleton class="aspect-square rounded-md" />

        <UBadge color="neutral" variant="solid" class="absolute bottom-2 left-2 bg-inverted/50 backdrop-blur">
          <UIcon name="i-lucide-gem" />
          <USkeleton class="text-transparent rounded-full">Loading</USkeleton>
        </UBadge>

        <UBadge color="neutral" variant="solid" class="absolute bottom-2 left-2 bg-inverted/50 backdrop-blur">
          <UIcon name="i-lucide-gem" />
          <USkeleton class="text-transparent rounded-full">Loading</USkeleton>
        </UBadge>

        <UButton class="absolute bottom-2 right-2 bg-inverted/50 backdrop-blur" icon="i-lucide-play" color="neutral"
          variant="solid" size="sm">Video</UButton>
      </div>

      <!-- Content -->
      <div class="p-4">
        <div>
          <USkeleton class="text-2xl font-semibold leading-tight text-transparent rounded-full w-fit">Loading
          </USkeleton>
          <p class="text-sm text-muted">per carat</p>
        </div>

        <USeparator class="my-3" />

        <div class="flex gap-1 text-sm text-muted flex-wrap justify-between items-center ">
          <div class="flex items-center justify-center gap-2">
            <UIcon name="i-lucide-weight" />
            <USkeleton class="text-transparent rounded-full">Loading</USkeleton>
            <span>ct</span>
          </div>

          <div class="flex items-center justify-center gap-2">
            <UIcon name="i-lucide-shapes" />
            <USkeleton class="text-transparent rounded-full">Loading</USkeleton>
          </div>
        </div>
      </div>
    </article>
  </AppCard>
</template>
