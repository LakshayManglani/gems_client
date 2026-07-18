<script setup lang="ts">
import useGemFilters from '~/composables/home/useGemFilters';

const route = useRoute();

const gemFilters = useGemFilters();

if (import.meta.server) {
  gemFilters.fromQuery(route.query)
}

const gemsListStore = useGemsListStore();

let requestId = 0;

const { data, refresh, status } = await useAsyncData(
  async (_, { signal }) => {
    console.log(gemFilters.query.value)
    await gemsListStore.fetchPage(gemFilters.query.value, false, signal);

    const key = gemsListStore.pageKey(gemFilters.query.value);

    return {
      products: gemsListStore.getPageProducts(key) ?? [],
      pagination: gemsListStore.getPageMeta(key)
    };
  },
  {
    lazy: true,
    dedupe: 'cancel',
  }
)

const displayData = shallowRef(data.value)
const uiState = ref<'fade_in' | 'skeleton' | 'fade_out'>(
  import.meta.client && requestId === 0
    ? 'skeleton'
    : 'fade_in'
);

const MIN_FADE_TIME = 300;
let timer: NodeJS.Timeout | null = null;

if (import.meta.client) {
  watchDebounced(
    gemFilters.query,
    async () => {
      const id = ++requestId;

      async function commit() {
        console.log('commiting')
        displayData.value = data.value;
        console.log(displayData.value, data.value)
        uiState.value = 'fade_in';
        await navigateTo({
          query: gemFilters.query.value,
        });
      }

      let requestFinished = false;

      if (!timer) {
        if (uiState.value === 'fade_in') {
          uiState.value = 'fade_out';
        }

        timer = setTimeout(async () => {
          if (id === requestId && requestFinished && status.value === "success") {
            await commit();
          } else {
            uiState.value = 'skeleton';
          }
          timer = null;
        }, MIN_FADE_TIME);
      }

      await refresh();

      requestFinished = true;

      if (uiState.value === 'skeleton') {
        if (id !== requestId) return;
        if (status.value !== "success") return;
        await commit()
      }
    },
    {
      debounce: 300,
      immediate: true,
    }
  );
}

if (import.meta.client) {
  watchDebounced(
    () => route.query,
    (value) => {
      gemFilters.fromQuery(value)
    },
    {
      immediate: true,
    }
  )
}

function smoothScrollToTop(duration = 300) {
  const start = window.scrollY
  const startTime = performance.now()

  function frame(now: number) {
    const elapsed = now - startTime
    const progress = Math.min(elapsed / duration, 1)

    // Ease-out cubic
    const eased = 1 - Math.pow(1 - progress, 3)

    window.scrollTo(0, start * (1 - eased))

    if (progress < 1) {
      requestAnimationFrame(frame)
    }
  }

  requestAnimationFrame(frame)
}

if (import.meta.client) {
  watch(gemFilters.items.pagination.model, () => {
    smoothScrollToTop(300)
  })
}

const open = ref(false)

const paginationText = computed(() => {
  const pagination = data.value?.pagination;

  if (!pagination || pagination.total === 0) {
    return "0 results";
  }

  const start = (pagination.page - 1) * pagination.limit + 1;
  const end = Math.min(pagination.page * pagination.limit, pagination.total);

  return `${start}-${end} of ${pagination.total} results`;
});
</script>

<template>
  <UContainer class="lg:min-h-[calc(100vh-var(--ui-header-height))]">
    <UPage :ui="{
      root: 'lg:flex lg:flex-row lg:min-h-[calc(100vh-var(--ui-header-height))]',
      left: 'max-w-xs w-full',
      center: 'flex flex-col flex-1',
    }">
      <template #left>
        <UPageAside
          class="lg:max-h-[calc(100vh-var(--ui-header-height)-4rem)]  lg:top-[calc(var(--ui-header-height)+2rem)] mb-8 flex-col overflow-hidden lg:pe-0 lg:ps-0 h-full py-0 px-0 w-full">
          <AppCard class="lg:max-h-[calc(100vh-var(--ui-header-height)-4rem)] overflow-y-auto space-y-4 h-full p-4">
            <div>
              <div class="flex items-center justify-between">
                <div class="text-highlighted font-semibold">Filters</div>
                <UButton label="Clear" icon="i-lucide-rotate-ccw" variant="ghost" color="neutral" size="sm"
                  @click="gemFilters.reset" />
              </div>

              <div class="text-sm text-muted">
                {{ paginationText }}
              </div>
            </div>

            <div>
              <USeparator />

              <HomeGemFilters :filters="gemFilters" />
            </div>
          </AppCard>
        </UPageAside>
      </template>

      <div class="pt-8 relative flex flex-col flex-1">
        <!-- Mobile Filters -->
        <UDrawer v-model:open="open" :handle="false" handle-only dismissible inset>
          <UButton icon="i-lucide-filter" color="neutral" variant="subtle" size="xl" square
            class="fixed bottom-20 right-4 z-50 rounded-full shadow-lg lg:hidden" />

          <template #body>
            <div class="max-h-[50vh] overflow-y-auto px-4">
              <div class="pb-3.5">
                <div class="flex items-center justify-between">
                  <div class="text-highlighted font-semibold">Filters</div>
                  <UButton label="Clear Filters" icon="i-lucide-rotate-ccw" variant="ghost" color="neutral" size="sm"
                    @click="gemFilters.reset" />
                </div>

                <div class="text-sm text-muted">
                  {{ paginationText }}
                </div>
              </div>

              <USeparator />

              <HomeGemFilters :filters="gemFilters" />
            </div>
          </template>

          <template #footer>
            <USeparator />
            <div class="flex justify-between mt-2 items-center">
              <h2 class="text-highlighted font-semibold">Filters</h2>
              <UButton icon="i-lucide-x" color="neutral" variant="ghost" square @click="open = false" />
            </div>
          </template>
        </UDrawer>


        <div class="flex flex-col relative flex-1">
          <!-- Skeletons -->
          <ul
            class="absolute inset-0 grid grid-cols-[repeat(auto-fill,minmax(256px,1fr))] gap-8 transition-all duration-300"
            :class="[
              uiState === 'skeleton'
                ? 'opacity-100 visible'
                : 'opacity-0 invisible pointer-events-none scale-[0.985]'
            ]">
            <li v-for="i in 8" :key="i">
              <HomeProductSkeleton />
            </li>
          </ul>

          <!-- Products -->
          <ul
            class="absolute inset-0 flex-1 relative grid grid-cols-[repeat(auto-fill,minmax(256px,1fr))] gap-8 transition-all duration-300"
            :class="[
              uiState === 'fade_in' && !!displayData?.products.length ?
                'opacity-100 visible' :
                'opacity-0 invisible pointer-events-none scale-[0.985]'
            ]">
            <li v-for="gem in displayData?.products" :key="gem.id">
              <HomeProduct :gem-id="gem.id" />
            </li>
          </ul>

          <!-- Pagination -->
          <div class="flex justify-end flex-col transition-all duration-300" :class="[
            uiState === 'fade_in' && !!displayData?.products.length ?
              'opacity-100 visible' :
              'opacity-0 invisible pointer-events-none scale-[0.985]'
          ]">
            <AppCard class="mx-auto my-8 w-min p-4">
              <UPagination :items-per-page="displayData?.pagination?.limit"
                v-model:page="gemFilters.items.pagination.model.value" :total="displayData?.pagination?.total"
                :sibling-count="1" />
            </AppCard>
          </div>

          <!-- Empty -->
          <div class="absolute inset-0 flex flex-col justify-center items-center transition-all duration-300" :class="[
            uiState === 'fade_in' && !displayData?.products.length ?
              'opacity-100 visible' :
              'opacity-0 invisible pointer-events-none scale-[0.985]'
          ]">
            <p>No Results Found</p>
            <UButton @click="gemFilters.reset" label="Clear Filters" />
          </div>
        </div>
      </div>
    </UPage>
  </UContainer>
</template>
