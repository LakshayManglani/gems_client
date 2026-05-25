import { computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import type api from '~/api';

type QueryParam = Parameters<typeof api.gems.getList>['0'];

export async function useProductsPageModel() {
  const route = useRoute();

  function parseQuery(): QueryParam {
    const page = Number(route.query.page) || 1;

    const sort_by = typeof route.query.sort_by === 'string'
      ? route.query.sort_by as QueryParam['sort_by']
      : undefined;

    const sort_order = typeof route.query.sort_order === 'string'
      ? route.query.sort_order as QueryParam['sort_order']
      : undefined;

    // Filters
    const clarity = typeof route.query.clarity === 'string'
      ? route.query.clarity as QueryParam['clarity']
      : undefined;

    const shape = typeof route.query.shape === 'string'
      ? route.query.shape as QueryParam['shape']
      : undefined;

    const variety = typeof route.query.variety === 'string'
      ? route.query.variety as QueryParam['variety']
      : undefined;

    const price_min = Number(route.query.price_min) || undefined;
    const price_max = Number(route.query.price_max) || undefined;


    const weight_min = Number(route.query.weight_min) || undefined;
    const weight_max = Number(route.query.weight_max) || undefined;

    return {
      page,
      sort_by,
      sort_order,
      clarity,
      shape,
      variety,
      price_max,
      price_min,
      weight_max,
      weight_min,
      limit: 48,
    };
  }

  const gemsListStore = useGemsListStore();

  const query = computed(() => parseQuery());
  const queryKey = computed(() => gemsListStore.pageKey(query.value));

  const products = computed(() => gemsListStore.getPageProducts(queryKey.value))
  const pagination = computed(() => gemsListStore.getPageMeta(queryKey.value));
  const loading = computed(() => gemsListStore.loading);

  async function refresh() {
    await gemsListStore.fetchPage(query.value, true);
  }

  await refresh();

  watch(
    query,
    async (newQuery) => {
      await gemsListStore.fetchPage(newQuery);
    },
  );

  return {
    products,
    loading,
    query,
    queryKey,
    pagination,
    refresh,
  };
}
