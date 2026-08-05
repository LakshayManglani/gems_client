import type { LocationQuery } from "vue-router";

type QueryEntry<Key extends string = string> = readonly [
  key: Key,
  value: string | undefined,
];

type Range = [number, number];

export default function useRangeFilter<QueryKey extends string>(
  options: {
    queryKey: QueryKey;

    min: number;
    max: number;

    fractionDigits: number;
  }
) {
  const queryMinKey = `${options.queryKey}_min` as const;
  const queryMaxKey = `${options.queryKey}_max` as const;

  const rawModel: Ref<Range> = ref([options.min, options.max]);

  const model: ComputedRef<Range> = computed({
    get: (): Range => [rawModel.value[0], rawModel.value[1]],
    set(values) {
      setModel(values);
    }
  })

  const minModel = computed({
    get: () => rawModel.value[0],
    set(value) {
      setModel([value, Math.max(value, rawModel.value[1])]);
    }
  })

  const maxModel = computed({
    get: () => rawModel.value[1],
    set(value) {
      setModel([Math.min(rawModel.value[0], value), value]);
    }
  })

  function isEqual(a: Range, b: Range) {
    if (a.length !== b.length) {
      return false;
    }

    return a.every((value, index) => value === b[index]);
  }

  function clamp(value: number) {
    return Math.min(options.max, Math.max(options.min, value))
  }

  function round(value: number) {
    return Number(value.toFixed(options.fractionDigits))
  }

  function normalize(values: Range): Range {
    let [min, max] = values;

    min = round(clamp(min));
    max = round(clamp(max));

    if (min > max) {
      [min, max] = [max, min];
    }

    return [min, max];
  }

  function setModel(value: Range) {
    const next = normalize(value);

    if (isEqual(rawModel.value, next)) {
      return;
    }

    rawModel.value = next;
  }

  function toMinQueryValue(value: number) {
    return (value === options.min) ? undefined : value.toString();
  }

  function toMaxQueryValue(value: number) {
    return (value === options.max) ? undefined : value.toString();
  }

  const queryEntries = computed<QueryEntry<typeof queryMaxKey | typeof queryMinKey>[]>(() => [
    [queryMinKey, toMinQueryValue(model.value[0])],
    [queryMaxKey, toMaxQueryValue(model.value[1])],
  ]);

  function reset() {
    setModel([options.min, options.max])
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
    const minValue = parseNumber(value[queryMinKey]) ?? options.min
    const maxValue = parseNumber(value[queryMaxKey]) ?? options.max;

    setModel([minValue, maxValue])
  }

  return {
    model,
    minModel,
    maxModel,
    queryEntries,
    reset,
    fromQuery,
    min: options.min,
    max: options.max
  }
}
