export function usePaginationFilter(options: {
  query: string
}) {
  const route = useRoute();

  const model = ref(1);

  const query = computed(() => {
    return {
      [options.query]: model.value
    }
  })

  function reset() {
    model.value = 1;
  }

  function toNumber(value: string): number | null {
    const trimmed = value.trim();

    if (trimmed === "") {
      return null;
    }

    const num = Number(trimmed);

    return Number.isFinite(num) ? num : null;
  }

  function normalizePage(value: unknown) {
    let newValue: number | null = null;

    if (typeof value === "number") {
      newValue = value;
    }

    if (typeof value === "string") {
      newValue = toNumber(value);
    }

    if (newValue === null || newValue <= 0) {
      newValue = 1;
    }

    return newValue
  }

  function initialize() {
    // can be wrong, we have to validate
    const routeModel = normalizePage(route.query[options.query]);

    if (routeModel === model.value) {
      return
    }

    model.value = routeModel;
  }


  let isInternalUpdate = false;
  watch(model, (next) => {
    if (isInternalUpdate) {
      isInternalUpdate = false;
      return;
    }

    const validNext = normalizePage(next);

    if (validNext === next) {
      return
    }

    model.value = validNext;
    isInternalUpdate = true;
  })

  return {
    model: model,
    query,
    initialize,
    reset,
  }
}
