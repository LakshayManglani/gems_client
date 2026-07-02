import gemsSchema from "~/schema/gems";
import { useRangeFilter } from "./useRangeFilter";
import { useOptionFilter } from "./useOptionFilter";
import { usePaginationFilter } from "./usePaginationFilter";

export function useGemFilters() {
  const price = useRangeFilter({
    query: "price",
    step: 1000,
    max: 1_00_000,
    min: 1,
    minStepsBetweenThumbs: 4,
    fractionDigits: 2
  })

  const weight = useRangeFilter({
    query: "weight",
    step: 0.1,
    max: 10,
    min: 0.01,
    minStepsBetweenThumbs: 4,
    fractionDigits: 2
  })

  const varietyItems = [...gemsSchema.variety.map((variety) => {
    return {
      label: lowerCase(variety.replaceAll('_', ' ')),
      value: variety,
    };
  })];

  const variety = useOptionFilter({
    query: "variety",
    items: gemsSchema.variety,
  })


  const shapeItems = ref([...gemsSchema.shape.map((shape) => {
    return {
      label: lowerCase(shape.replaceAll('_', ' ')),
      value: shape,
    };
  })]);

  const shape = useOptionFilter({
    query: "shape",
    items: gemsSchema.shape,
  })

  const clarityItems = ref([...gemsSchema.clarity.map((clarity) => {
    return {
      label: lowerCase(clarity.replaceAll('_', ' ')),
      value: clarity,
    };
  })]);

  const clarity = useOptionFilter({
    query: "clarity",
    items: gemsSchema.clarity,
  })

  const pagination = usePaginationFilter({
    query: "page"
  });

  const paginationFilter = [price, weight, variety, shape, clarity];

  const filters = [...paginationFilter, pagination];

  const paginationQuery = computed(() => Object.assign({},
    ...paginationFilter.map(filter => filter.query.value),
  ))

  const query = computed(() => Object.assign({},
    ...filters.map(filter => filter.query.value),
  ))

  function initialize() {
    filters.forEach(filter => {
      filter.initialize();
    })
  }

  async function updateRoute() {
    await navigateTo({
      query: query.value,
      replace: true,
    })
  }

  function reset() {
    filters.forEach(filter => {
      filter.reset();
    })
  }

  return {
    price,
    weight,
    variety,
    varietyItems,
    shape,
    shapeItems,
    clarity,
    clarityItems,
    pagination,
    filters,
    query,
    paginationQuery,
    initialize,
    updateRoute,
    reset
  }
}
