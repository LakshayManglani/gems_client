import type { LocationQuery } from "vue-router";

type QueryEntry<Key extends string> = readonly [
  key: Key,
  value: string | undefined,
];

export default function usePaginationFilter<QueryKey extends string>(options: {
  queryKey: QueryKey;
}) {
  const { queryKey } = options;

  const rawModel = ref(1);

  const model = computed({
    get: () => rawModel.value,
    set(value) {
      setModel(value);
    }
  })

  function isEqual(a: number, b: number) {
    return a === b;
  }

  function normalize(value: number): number {
    const safeValue = Math.floor(value);

    return Math.max(1, safeValue);
  }

  function setModel(value: number) {
    const next = normalize(value);

    if (isEqual(rawModel.value, next)) {
      return;
    }

    rawModel.value = next;
  }

  function toQueryValue(value: number) {
    return value !== 1 ? value.toString() : undefined;
  }

  const queryEntries = computed<QueryEntry<QueryKey>[]>(() => [
    [queryKey, toQueryValue(model.value)],
  ]);

  function reset() {
    setModel(1)
  }

  function parseNumber(value: unknown): number | undefined {
    if (typeof value === "string" || typeof value === "number") {
      const number = Number(value);

      return Number.isFinite(number)
        ? number
        : undefined;
    }

    return undefined;
  }

  function fromQuery(value: LocationQuery) {
    const pageValue = parseNumber(value[queryKey]) ?? 1;

    setModel(pageValue)
  }

  return {
    model,
    queryEntries,
    reset,
    fromQuery,
  }
}
