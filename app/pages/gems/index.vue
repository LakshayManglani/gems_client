<script setup lang="ts">
import GemFilters from '~/components/filters/GemFilters.vue';
import { useGemFilters } from '~/composables/filters/useGemFilters';

const route = useRoute();

const gemsListStore = useGemsListStore();

const gemFilters = useGemFilters();
const {
  sortBy,
  price,
  weight,
  variety,
  varietyItems,
  shape,
  shapeItems,
  clarity,
  clarityItems,
  pagination,
  query,
  paginationQuery,
  initialize,
  updateRoute,
  reset
} = gemFilters;


const open = ref(false)

if (import.meta.server) {
  initialize()
}

if (import.meta.client) {
  initialize();
  await updateRoute();
}

const { data, refresh, status } = await useAsyncData(
  async (_, { signal }) => {
    await gemsListStore.fetchPage(query.value, false, signal);

    const key = gemsListStore.pageKey(query.value);

    return {
      products: gemsListStore.getPageProducts(key) ?? [],
      pagination: gemsListStore.getPageMeta(key)
    };
  },
  {
    dedupe: 'cancel'
  }
)


const isInitializingFromRoute = ref(false)
// update all other query which depends upon pagination
watch(paginationQuery, () => {
  if (isInitializingFromRoute.value) return
  if (pagination.model.value !== 1) {
    pagination.reset();
  }
})

// initialize state if route.query changes
// this case is for when user goes back/forward in history
watch(
  () => route.query,
  () => {
    isInitializingFromRoute.value = true
    initialize()
    nextTick(() => {
      isInitializingFromRoute.value = false
    })
  }
)

watch(query, () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  })
});

// call api if query is not changed after some time-frame
let requestId = 0;
watchDebounced(
  query,
  async () => {
    const id = ++requestId;
    const currentQuery = { ...query.value };

    await refresh()

    if (id !== requestId) return;
    if (status.value !== "success") return;

    await navigateTo({
      query: currentQuery
    })

  },
  {
    debounce: 200,
  }
)

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
      center: 'flex-1',
    }">
      <template #left>
        <UPageAside
          class="lg:max-h-[calc(100vh-var(--ui-header-height)-4rem)]  lg:top-[calc(var(--ui-header-height)+2rem)] mb-8 flex-col overflow-hidden lg:pe-0 lg:ps-0 h-full py-0 px-0 w-full">
          <AppCard class="lg:max-h-[calc(100vh-var(--ui-header-height)-4rem)] overflow-y-auto space-y-4 h-full p-4">
            <div>
              <div class="flex items-center justify-between">
                <div class="text-highlighted font-semibold">Filters</div>
                <UButton label="Clear" icon="i-lucide-rotate-ccw" variant="ghost" color="neutral" size="sm"
                  @click="reset" />
              </div>

              <div class="text-sm text-muted">
                {{ paginationText }}
              </div>
            </div>

            <div>
              <USeparator />

              <GemFilters :price="price" :weight="weight" :variety="variety" :variety-items="varietyItems"
                :shape="shape" :shape-items="shapeItems" :clarity="clarity" :clarity-items="clarityItems" :sortBy />
            </div>
          </AppCard>
        </UPageAside>
      </template>

      <div class="pt-8 relative flex flex-col h-full">
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
                    @click="reset" />
                </div>

                <div class="text-sm text-muted">
                  {{ paginationText }}
                </div>
              </div>

              <USeparator />

              <GemFilters :price="price" :weight="weight" :variety="variety" :variety-items="varietyItems"
                :shape="shape" :shape-items="shapeItems" :clarity="clarity" :clarity-items="clarityItems" :sortBy />
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

        <!-- Product List -->
        <ul v-show="data && data.products.length" class="grid grid-cols-[repeat(auto-fill,minmax(256px,1fr))] gap-8">
          <li v-for="gem in data?.products" :key="gem.id">
            <HomeProduct :gem-id="gem.id" />
          </li>
        </ul>
        <div v-show="(data && !data.products.length) || status === 'error'"
          class="flex justify-center items-center h-full flex-col">
          <p>No Results Found</p>
          <UButton @click="reset" label="Clear Filters" />
        </div>

        <!-- Pagination -->
        <div class="flex flex-1 justify-end flex-col">
          <AppCard class="mx-auto my-8 w-min p-4">
            <UPagination v-if="data && data.pagination && data.pagination.total" v-model:page="pagination.model.value"
              :items-per-page="data.pagination.limit" :total="data.pagination.total" :sibling-count="1" />
          </AppCard>
        </div>
      </div>
    </UPage>
  </UContainer>
</template>
