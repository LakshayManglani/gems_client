<script setup lang="ts">
import GemFilters from '~/components/filters/GemFilters.vue';
import { useGemFilters } from '~/composables/filters/useGemFilters';

const route = useRoute();

const gemsListStore = useGemsListStore();

const gemFilters = useGemFilters();
const {
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


if (import.meta.server) {
  initialize()
}

if (import.meta.client) {
  initialize();
  callOnce(async () => {
    await updateRoute();
  })
}

const { data, refresh, status } = await useAsyncData(
  'products',
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
  <UContainer class="min-h-[calc(100vh-var(--ui-header-height))]">
    <UPage :ui="{
      root: 'lg:flex lg:flex-row min-h-[calc(100vh-var(--ui-header-height))]',
      left: 'max-w-xs w-full',
      center: 'flex-1',
    }">
      <template #left>
        <UPageAside
          class="lg:max-h-[calc(100vh-var(--ui-header-height)-4rem)] h-full py-0 lg:top-[calc(var(--ui-header-height)+2rem)] mb-8 rounded-xl border border-transparent hover:shadow-xl hover:border-muted duration-300 bg-muted/20 hover:bg-muted/40 flex flex-col overflow-hidden lg:pe-0">
          <div
            class="space-y-4 flex h-full flex-col overflow-y-auto lg:max-h-[calc(100vh-var(--ui-header-height)-4rem)] pe-4 py-4 me-1">
            <div>
              <div class="text-highlighted font-semibold">Filters</div>
              <div class="text-sm text-muted">
                {{ paginationText }}
              </div>
            </div>

            <div>
              <USeparator />

              <GemFilters :price="price" :weight="weight" :variety="variety" :variety-items="varietyItems"
                :shape="shape" :shape-items="shapeItems" :clarity="clarity" :clarity-items="clarityItems" />
            </div>
          </div>
        </UPageAside>
      </template>

      <div class="mt-8 relative h-full">
        <div class="relative">
          <div class="lg:hidden h-16" />

          <div
            class="fixed top-16 inset-x-0 z-50 flex gap-2 flex-wrap justify-between items-center p-4 bg-default lg:hidden border-b border-default">

            <div class="text-sm text-muted">
              {{ paginationText }}
            </div>

            <USlideover title="Filters" :description="paginationText">
              <UButton label="Filters" variant="subtle" color="neutral" class="lg:hidden" />

              <template #body>
                <GemFilters :price="price" :weight="weight" :variety="variety" :variety-items="varietyItems"
                  :shape="shape" :shape-items="shapeItems" :clarity="clarity" :clarity-items="clarityItems" />
              </template>
            </USlideover>
          </div>
        </div>

        <ul v-show="data && data.products.length" class="grid grid-cols-[repeat(auto-fill,minmax(256px,1fr))] gap-8">
          <li v-for="gem in data?.products" :key="gem.id">
            <HomeProduct :gem-id="gem.id" />
          </li>
        </ul>
        <div v-show="(data && !data.products.length) || status === 'error'"
          class="flex justify-center items-center h-full flex-col">
          <p>No Results Found</p>
          <UButton @click="reset" label="Reset Filters" />
        </div>

        <UPagination v-if="data && data.pagination && data.pagination.total" v-model:page="pagination.model.value"
          :items-per-page="data.pagination.limit" :total="data.pagination.total" :sibling-count="1"
          class="mx-auto w-min mb-8 mt-8 bg-muted/20 hover:bg-muted/40 border border-transparent hover:border-muted rounded-xl p-4 hover:shadow-xl duration-300" />
      </div>
    </UPage>
  </UContainer>
</template>
