import type { LocationQuery } from "vue-router";

type QueryEntry<Key extends string> = readonly [
  key: Key,
  value: string | undefined,
];

export default function useOptionFilter<QueryKey extends string, Key extends string>(options: {
  queryKey: QueryKey;
  keys: Key[];
}) {
  const { queryKey } = options;
  const keys = new Set(options.keys);

  const rawModel: Ref<Key[]> = ref([]);

  const model: ComputedRef<Key[]> = computed({
    get: () => rawModel.value,
    set(values) {
      setModel(values);
    }
  })

  function isEqual(a: Key[], b: Key[]) {
    if (a.length !== b.length) {
      return false;
    }

    return a.every((value, index) => value === b[index]);
  }

  function setModel(value: unknown) {
    const next = buildModel(value);

    if (isEqual(rawModel.value, next)) {
      return;
    }

    rawModel.value = next;
  }

  function parseString(value: string): string[] {
    return value.replaceAll(' ', '').split(",")
  }

  function isKey(str: string): str is Key {
    return keys.has(str as Key);
  }

  function validate(values: string[]): Key[] {
    return values.filter(isKey);
  }

  function normalize(values: Key[]): Key[] {
    return [...new Set(values)].sort();
  }

  function buildModel(value: unknown): Key[] {
    if (typeof value === "string") {
      return normalize(validate(parseString(value)));
    }

    if (Array.isArray(value)) {
      return normalize(validate(value));
    }

    return [];
  }

  function toQueryValue(value: Key[]) {
    return value.length !== 0 ? value.join(",") : undefined;
  }

  const queryEntries = computed<QueryEntry<QueryKey>[]>(() => [
    [queryKey, toQueryValue(model.value)],
  ]);

  function reset() {
    setModel([])
  }

  function fromQuery(value: LocationQuery) {
    setModel(value[queryKey])
  }

  return {
    model,
    queryEntries,
    reset,
    fromQuery,
    keys: [...keys],
  }
}
