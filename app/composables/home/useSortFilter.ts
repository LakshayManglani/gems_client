import type { LocationQuery } from "vue-router";

type QueryEntry<Key extends string> = readonly [
  key: Key,
  value: string | undefined,
];

export default function useSortFilter<SortByQueryKey extends string, SortOrderQueryKey extends string>(options: {
  sortByQueryKey: SortByQueryKey;
  sortOrderQueryKey: SortOrderQueryKey;
  items: {
    label: string;
    id: string,
    order: string;
    by: string;
  }[];
  defaultId: string;
}) {
  const { sortByQueryKey, sortOrderQueryKey } = options;

  const rawModel = ref(options.defaultId);

  const model = computed({
    get: () => rawModel.value,
    set(value) {
      setModel(value);
    }
  })

  function normalize(id: string) {
    return options.items.find((item) => item.id === id)
  }

  function setModel(value: string) {
    const next = normalize(value);

    if (next === undefined) return;

    if (rawModel.value === next.id) return;

    rawModel.value = next.id;
  }

  function toQueryValue<K extends "order" | "by">(
    id: string,
    key: K,
  ) {
    const item = normalize(id);

    return (item && item.id !== options.defaultId)
      ? item[key]
      : undefined;
  }

  const queryEntries = computed<QueryEntry<SortOrderQueryKey | SortByQueryKey>[]>(() => [
    [sortByQueryKey, toQueryValue(model.value, 'by')],
    [sortOrderQueryKey, toQueryValue(model.value, 'order')],
  ]);

  function reset() {
    setModel(options.defaultId)
  }

  function fromQuery(value: LocationQuery) {
    const routeBy = String(value[sortByQueryKey] ?? "");
    const routeOrder = String(value[sortOrderQueryKey] ?? "");

    const item = options.items.find((item) => item.by === routeBy && item.order === routeOrder);

    if (item) {
      setModel(item.id)
    }
  }

  return {
    model,
    items: options.items,
    queryEntries,
    reset,
    fromQuery,
  }
}
