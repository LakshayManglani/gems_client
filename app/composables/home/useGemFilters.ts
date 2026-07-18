import gemsSchema from "~/schema/gems";
import type { LocationQuery } from "vue-router";
import useOptionFilter from "./useOptionFilter";
import useRangeFilter from "./useRangeFilter";
import usePaginationFilter from "./usePaginationFilter";
import useSortFilter from "./useSortFilter";

type QueryEntry<Key extends string = string> = readonly [
  key: Key,
  value: string | undefined,
];

export default function useGemFilters() {
  const items = {
    sort: useSortFilter({
      defaultId: 'newest',
      sortByQueryKey: 'sort_by',
      sortOrderQueryKey: 'sort_order',
      items: [
        { label: "Newest", id: "newest", order: "desc", by: "created_at" },
        {
          label: 'Price: Low to High',
          id: 'price_low_to_high',
          order: 'asc',
          by: 'price',
        },
        {
          label: 'Price: High to Low',
          id: 'price_high_to_low',
          order: 'desc',
          by: "price",
        },
        { label: "Weight: Light to Heavy", id: "weight_light_to_heavy", order: "asc", by: "weight" },
        { label: "Weight: Heavy to Light", id: "weight_heavy_to_light", order: "desc", by: "weight" },
      ]
    }),
    variety: useOptionFilter({ queryKey: 'variety', keys: [...gemsSchema.variety] }),
    shape: useOptionFilter({ queryKey: 'shape', keys: [...gemsSchema.shape] }),
    clarity: useOptionFilter({ queryKey: 'clarity', keys: [...gemsSchema.clarity] }),
    price: useRangeFilter({ fractionDigits: 2, max: 1_00_000, min: 1_000, queryKey: 'price' }),
    weight: useRangeFilter({ fractionDigits: 2, max: 10, min: 0.1, queryKey: 'weight' }),
    pagination: usePaginationFilter({ queryKey: 'page' })
  };

  const syncingFromQuery = ref(false)

  function fromQuery(query: LocationQuery) {
    syncingFromQuery.value = true;

    try {
      Object.values(items).forEach(filter => filter.fromQuery(query));
    } finally {
      syncingFromQuery.value = false;
    }
  }

  const nonPaginationQuery = computed(() => {
    const { pagination, ...rest } = items;
    return Object.values(rest).map(item => item.model.value)
  })

  watch(nonPaginationQuery, () => {
    if (syncingFromQuery.value) return

    items.pagination.reset()
  })

  const query = computed(() => {
    return Object.fromEntries(
      Object.values(items).flatMap<QueryEntry>(filter => filter.queryEntries.value)
    )
  });

  function reset() {
    Object.values(items).forEach(filter =>
      filter.reset()
    );
  }

  return {
    items,
    fromQuery,
    query,
    reset,
  }
}
