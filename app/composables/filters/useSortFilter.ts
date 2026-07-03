export function useSortFilter(options: {
  query: string;
  orderQuery: string;
  items: {
    id: string,
    order: string;
    by: string;
  }[];
  defaultId: string;
  defaultOrder: string;
  defaultBy: string;
}) {
  const route = useRoute();
  const model = ref(options.defaultId);

  const activeItem = computed(() => {
    return options.items.find(item => item.id === model.value) ?? {
      id: options.defaultId,
      order: options.defaultOrder,
      by: options.defaultBy,
    }
  })

  const query = computed(() => {
    return {
      [options.query]: activeItem.value.by,
      [options.orderQuery]: activeItem.value.order,
    }
  })

  function reset() {
    model.value = options.defaultId;
  }

  function initialize() {
    const routeBy = String(route.query[options.query] ?? "");
    const routeOrder = String(route.query[options.orderQuery] ?? "");

    if (routeBy === activeItem.value.by && routeOrder === activeItem.value.order) {
      return;
    }

    const validModel = options.items.find(item => item.by === routeBy && item.order === routeOrder)?.id ?? options.defaultId;

    model.value = validModel;
  }

  let isInternalUpdate = false;
  watch(model, (next, prev) => {
    if (isInternalUpdate) {
      isInternalUpdate = false;
      return;
    }

    if (next === prev) {
      return
    }

    const validModel = options.items.find(item => item.id === next)?.id ?? options.defaultId;

    isInternalUpdate = true;
    model.value = validModel;
  })

  return {
    model,
    items: options.items,
    activeItem,
    query,
    initialize,
    reset,
  }
}
