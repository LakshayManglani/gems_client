<script setup lang="ts">
import type { AccordionItem } from '@nuxt/ui';
import gemsSchema, { type GemClarity, type GemShape, type GemVariety } from '~/schema/gems';

const router = useRouter();
const route = useRoute();


const { products: rawProducts, pagination } = await useProductsPageModel();


const products = computed(() => (rawProducts.value === undefined ? [] : rawProducts.value).filter((item) => !!item));


const items = ref<AccordionItem[]>([
  {
    label: 'Price',
    slot: 'price' as const,
  },
  {
    label: 'Variety',
    slot: 'variety' as const,
  },
  {
    label: 'Weight (ct)',
    slot: 'weight' as const,
  },
  {
    label: 'Shape',
    slot: 'shape' as const,
  },
  {
    label: 'Clarity',
    slot: 'clarity' as const,
  },
]);


const active = ref(['0', '1']);

const shapeItems = ref([...gemsSchema.shape.map((shape) => {
  return {
    label: lowerCase(shape.replaceAll('_', ' ')),
    value: shape,
  };
})]);
const varietyItems = ref([...gemsSchema.variety.map((variety) => {
  return {
    label: lowerCase(variety.replaceAll('_', ' ')),
    value: variety,
  };
})]);
const clarityItems = ref([...gemsSchema.clarity.map((clarity) => {
  return {
    label: lowerCase(clarity.replaceAll('_', ' ')),
    value: clarity,
  };
})]);

const weightMin = 0.01;
const weightMax = 10;

const priceMin = 1;
const priceMax = 10_000;



const selectedShapes = ref<GemShape[]>([]);
const selectedVarieties = ref<GemVariety[]>([]);
const selectedClarities = ref<GemClarity[]>([]);
const weight = ref([weightMin, weightMax]);
const price = ref([priceMin, priceMax]);

onMounted(() => {
  if (route.query.shape) {
    selectedShapes.value = String(route.query.shape).split(',') as GemShape[];
  }

  if (route.query.variety) {
    selectedVarieties.value = String(route.query.variety).split(',') as GemVariety[];
  }

  if (route.query.clarity) {
    selectedClarities.value = String(route.query.clarity).split(',') as GemClarity[];
  }

  const weightMinQuery = Number(route.query.weight_min);
  const weightMaxQuery = Number(route.query.weight_max);

  if (!Number.isNaN(weightMinQuery)) {
    weight.value = [weightMinQuery, weight.value[1] ?? weightMax];
  }

  if (!Number.isNaN(weightMaxQuery)) {
    weight.value = [weight.value[0] ?? weightMin, weightMaxQuery];
  }

  const priceMinQuery = Number(route.query.price_min);
  const priceMaxQuery = Number(route.query.price_max);


  if (!Number.isNaN(priceMinQuery)) {
    price.value = [priceMinQuery, price.value[1] ?? priceMax];
  }

  if (!Number.isNaN(priceMaxQuery)) {
    price.value = [price.value[0] ?? priceMin, priceMaxQuery];
  }
});

watch(
  [
    selectedShapes,
    selectedVarieties,
    selectedClarities,
    weight,
    price
  ],
  () => {
    router.replace({
      query: {
        ...route.query,
        shape: selectedShapes.value.length
          ? selectedShapes.value.sort().join(',')
          : undefined,

        variety: selectedVarieties.value.length
          ? selectedVarieties.value.sort().join(',')
          : undefined,

        clarity: selectedClarities.value.length
          ? selectedClarities.value.sort().join(',')
          : undefined,

        weight_min: weight.value[0],
        weight_max: weight.value[1],

        price_min: price.value[0],
        price_max: price.value[1],
      },
    });
  },
  {
    deep: true,
  },
);


const checkboxGroupUi = {
  fieldset: 'pb-3.5 grid grid-cols-2 gap-2',
  container: 'hidden',
  item: 'text-center flex items-center',
};

function updatePage(page: number) {
  return {
    query: {
      ...route.query,
      page: page,
    },
  };
}
</script>

<template>
  <UContainer>
    <UPage :ui="{
      root: 'lg:flex lg:flex-row',
      left: 'max-w-75 w-full',
      center: 'flex-1',
    }">
      <template #left>
        <UPageAside>
          <div class="space-y-4">
            <div>
              <div class="text-highlighted font-semibold">Filters</div>
              <div v-if="pagination" class="text-sm text-muted">{{ pagination.page * pagination.limit -
                pagination.limit + 1
                }}-{{ pagination.page * pagination.limit }} of
                over {{ pagination.total }}
                results</div>
            </div>
            <div>
              <USeparator />

              <UAccordion :items="items" type="multiple" :default-value="active">

                <template #price>
                  <UFormField :description="`${priceMin} - ${priceMax}`" class="pb-3.5">
                    <div class="px-1">
                      <USlider v-model="price" :min="priceMin" :max="priceMax" :step="10" />
                    </div>
                  </UFormField>
                </template>

                <template #weight>
                  <UFormField :description="`${weightMin} - ${weightMax}`" class="pb-3.5">
                    <div class="px-1">
                      <USlider v-model="weight" :min="weightMin" :max="weightMax" :step="0.01" />
                    </div>
                  </UFormField>
                </template>

                <template #shape>
                  <UCheckboxGroup v-model="selectedShapes" color="primary" variant="card" :items="shapeItems" size="sm"
                    :ui="checkboxGroupUi" />
                </template>

                <template #variety>
                  <UCheckboxGroup v-model="selectedVarieties" color="primary" variant="card" :items="varietyItems"
                    size="sm" :ui="checkboxGroupUi" />
                </template>

                <template #clarity>
                  <UCheckboxGroup v-model="selectedClarities" color="primary" variant="card" :items="clarityItems"
                    size="sm" :ui="checkboxGroupUi" />
                </template>
              </UAccordion>
            </div>
          </div>
        </UPageAside>
      </template>

      <div class="mt-8 relative">
        <div class="relative">
          <div class="lg:hidden h-16" />

          <div
            class="fixed top-16 inset-x-0 z-50 flex gap-2 flex-wrap justify-between items-center p-4 bg-default lg:hidden border-b border-default">
            <div v-if="pagination" class="text-sm text-muted">{{ pagination.page * pagination.limit -
              pagination.limit + 1
              }}-{{ pagination.page * pagination.limit }} of
              over {{ pagination.total }}
              results</div>

            <USlideover title="Filters" description="1-20 of over 200 results">
              <UButton label="Filters" variant="subtle" color="neutral" class="lg:hidden" />

              <template #body>
                <div class="space-y-4">
                  <div>
                    <UAccordion :items="items" type="multiple" :default-value="active">
                      <template #price>
                        <UFormField :description="`${priceMin} - ${priceMax}`" class="pb-3.5">
                          <div class="px-1">
                            <USlider v-model="price" :min="priceMin" :max="priceMax" :step="10" />
                          </div>
                        </UFormField>
                      </template>

                      <template #weight>
                        <UFormField :description="`${weightMin} - ${weightMax}`" class="pb-3.5">
                          <div class="px-1">
                            <USlider v-model="weight" :min="weightMin" :max="weightMax" :step="0.01" />
                          </div>
                        </UFormField>
                      </template>


                      <template #shape>
                        <UCheckboxGroup v-model="selectedShapes" color="primary" variant="card" :items="shapeItems"
                          size="sm" :ui="checkboxGroupUi" />
                      </template>

                      <template #variety>
                        <UCheckboxGroup v-model="selectedVarieties" color="primary" variant="card" :items="varietyItems"
                          size="sm" :ui="checkboxGroupUi" />
                      </template>

                      <template #clarity>
                        <UCheckboxGroup v-model="selectedClarities" color="primary" variant="card" :items="clarityItems"
                          size="sm" :ui="checkboxGroupUi" />
                      </template>
                    </UAccordion>
                  </div>
                </div>
              </template>
            </USlideover>
          </div>
        </div>

        <ul class="grid grid-cols-[repeat(auto-fill,minmax(256px,1fr))] gap-8">
          <li v-for="gem in products" :key="gem.id">
            <HomeProduct :gem-id="gem.id" />
          </li>
        </ul>

        <UPagination v-if="pagination && pagination.total" :page="pagination.page" :items-per-page="pagination.limit"
          :total="pagination.total" :to="updatePage" :sibling-count="1" class="mx-auto w-min" />
      </div>
    </UPage>
  </UContainer>
</template>
