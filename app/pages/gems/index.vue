<script setup lang="ts">
import GemFilters from '~/components/filters/GemFilters.vue';
import OptionsFilter from '~/components/filters/OptionsFilter.vue';
import RangeFilter from '~/components/filters/RangeFilter.vue';
import { useGemFilters } from '~/composables/filters/useGemFilters';

const router = useRouter();
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
  callOnce(() => {
    initialize();
    updateRoute();
  });
}

const { data, pending, refresh } = useAsyncData(
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

// update all other query which depends upon pagination
watch(paginationQuery, (query) => {
  router.replace({
    query: {
      ...query,
      page: 1,
    }
  })
})

// update page
watch(pagination.query, (query) => {
  router.push({
    query: {
      ...route.query,
      ...query,
    }
  })
})

// initialize state if route.query changes
// this case is for when user goes back/forward in history
watch(
  () => route.query,
  initialize
)

watch(query, () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  })
});

// call api if query is not changed after some time-frame
watchDebounced(
  query,
  refresh,
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
  <UContainer>
    <UPage :ui="{
      root: 'lg:flex lg:flex-row',
      left: 'max-w-xs w-full',
      center: 'flex-1',
    }">
      <template #left>
        <UPageAside>
          <div class="space-y-4">
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
        <div v-show="data && !data.products.length" class="flex justify-center items-center h-full flex-col">
          <p>No Results Found</p>
          <UButton @click="reset" label="Reset Filters" />
        </div>

        <UPagination v-if="data && data.pagination && data.pagination.total" v-model:page="pagination.model.value"
          :items-per-page="data.pagination.limit" :total="data.pagination.total" :sibling-count="1"
          class="mx-auto w-min mb-8 mt-8" />
      </div>
    </UPage>
  </UContainer>
</template>
