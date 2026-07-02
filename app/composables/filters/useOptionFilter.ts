export function useOptionFilter<T extends string>(options: {
  query: string;
  items: readonly T[];
}) {
  const route = useRoute();
  const model: Ref<T[]> = ref([]);

  const query = computed(() => {
    return {
      [options.query]: [...model.value].join(','),
    }
  })

  function reset() {
    model.value = [];
  }

  function generateValidOptions(a: string[]) {
    let aSet = new Set(a);
    return new Set(options.items.filter(option => aSet.has(option)));
  }

  // assuming a and b both are invalid
  function isSameOptions(a: string[], b: string[]) {
    let aValid = generateValidOptions(a);
    let bValid = generateValidOptions(b);

    if (aValid.size !== bValid.size) {
      return false;
    }

    for (const value of bValid) {
      if (!aValid.has(value)) {
        return false;
      }
    }

    return true
  }

  function initialize() {
    const routeModel = String(route.query[options.query] ?? "").split(',');

    if (isSameOptions(routeModel, model.value)) {
      return
    }

    const validModel = [...generateValidOptions(routeModel)];

    model.value = validModel;
  }

  let isInternalUpdate = false;
  watch(model, (next, prev) => {
    if (isInternalUpdate) {
      isInternalUpdate = false;
      return;
    }

    if (isSameOptions(prev, next)) {
      return
    }

    const validModel = [...generateValidOptions(next)].sort();

    isInternalUpdate = true;
    model.value = validModel;
  })

  return {
    model,
    query,
    initialize,
    reset,
  }
}
