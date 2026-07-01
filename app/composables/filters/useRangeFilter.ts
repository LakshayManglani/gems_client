export function useRangeFilter(options: {
  query: string;

  min: number;
  max: number;

  step: number;
  minStepsBetweenThumbs: number;

  fractionDigits: number;
}) {
  const route = useRoute();
  const model = ref<[number, number]>([options.min, options.max]);

  const queryMinKey = `${options.query}_min`;
  const queryMaxKey = `${options.query}_max`
  const gap = options.step * options.minStepsBetweenThumbs;

  const query = computed(() => {
    return {
      [queryMinKey]: model.value[0],
      [queryMaxKey]: model.value[1],
    }
  })

  function reset() {
    model.value = [options.min, options.max];
  }

  const clamp = (value: number) => Math.min(options.max, Math.max(options.min, value));

  function toNumber(value: string): number | null {
    const trimmed = value.trim();

    if (trimmed === "") {
      return null;
    }

    const num = Number(trimmed);

    return Number.isFinite(num) ? num : null;
  }

  function round(n: number) {
    const factor = 10 ** options.fractionDigits;
    return Math.round((n + Number.EPSILON) * factor) / factor;
  };

  function isUndefined(value: unknown) {
    if (typeof value === "string") {
      if (value.trim().length === 0) {
        return true
      }
    }

    if (value === undefined) {
      return true
    }

    return false
  }

  function isCorrect(value: unknown) {
    let newValue: number | null = null;

    if (typeof value === "number") {
      newValue = value;
    }

    if (typeof value === "string") {
      newValue = toNumber(value);
    }

    if (newValue === null) return false;

    return newValue === round(clamp(newValue))
  }

  function normalizeRangeValue(value: unknown, fallback: number) {
    let newValue: number | null = null;

    if (typeof value === "number") {
      newValue = value;
    }

    if (typeof value === "string") {
      newValue = toNumber(value);
    }

    if (newValue === null) {
      newValue = fallback;
    }

    return round(clamp(newValue));
  }

  function normalizeRange(
    min: unknown,
    max: unknown,
  ): [number, number] {
    let newMin = normalizeRangeValue(min, options.min)
    let newMax = normalizeRangeValue(max, options.max)

    if (newMax - newMin < gap) {
      newMax = clamp(newMin + gap)

      if (newMax - newMin < gap) {
        newMin = clamp(newMax - gap)
      }
    }

    return [newMin, newMax]
  }

  function isSameRange(range1: [unknown, unknown], range2: [unknown, unknown]) {
    return range1[0] === range2[0] && range1[1] === range2[1]
  }

  function initialize() {
    const routeMin = route.query[queryMinKey];
    const routeMax = route.query[queryMaxKey];

    const isRouteMinUndefined = isUndefined(routeMin);
    const isRouteMaxUndefined = isUndefined(routeMax);
    const isRouteUndefined = isRouteMinUndefined === undefined && isRouteMaxUndefined === undefined;

    if (isRouteUndefined) return

    const isRouteMinCorrect = isCorrect(routeMin);
    const isRouteMaxCorrect = isCorrect(routeMax);
    const isRouteCorrect = isRouteMinCorrect && isRouteMaxCorrect;

    const normalizeRouteRange = normalizeRange(routeMin, routeMax);

    const isRouteAndModelSame = isSameRange(normalizeRouteRange, model.value);

    if (isRouteCorrect && isRouteAndModelSame) {
      return
    }

    model.value = normalizeRouteRange;
  }

  let isInternalUpdate = false;
  watch((): [number, number] => model.value, (next, prev) => {
    if (isInternalUpdate) {
      isInternalUpdate = false;
      return;
    }

    // previous is always going to be correct
    let [prevMin] = prev;

    let [minNext, maxNext]: [number, number] = [...next];

    // normalize next
    const isMinUpdated = prevMin !== minNext;
    if (maxNext - minNext < gap) {
      if (isMinUpdated) {
        minNext = normalizeRangeValue(maxNext - gap, options.min);
      } else {
        maxNext = normalizeRangeValue(minNext + gap, options.max);
      }

      if (maxNext - minNext < gap) {
        maxNext = normalizeRangeValue(minNext + gap, options.max);
      }
    }

    const isNextAndPrevSame = isSameRange([minNext, maxNext], prev);

    if (isNextAndPrevSame) {
      return
    }

    isInternalUpdate = true;
    model.value = [minNext, maxNext]
  })

  return {
    model,
    query,
    min: options.min,
    max: options.max,
    step: options.step,
    minStepsBetweenThumbs: options.minStepsBetweenThumbs,
    initialize,
    reset,
  }
}
