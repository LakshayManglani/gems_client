<script setup lang="ts">
const props = defineProps<{
  model: Ref<[number, number]>;
  minModel: Ref<number>;
  maxModel: Ref<number>;

  min: number;
  max: number;

  icon?: string;
}>()

const draftMin = ref(String(props.minModel.value))
const isEditingMin = ref(false);

watch(props.minModel, value => {
  draftMin.value = String(value)
})

function commitMin() {
  if (!isEditingMin.value)
    isEditingMin.value = false;

  const value = Number(draftMin.value)

  if (Number.isFinite(value)) {
    props.minModel.value = value
  }

  draftMin.value = String(props.minModel.value)
}

const draftMax = ref(String(props.maxModel.value))
const isEditingMax = ref(false);

watch(props.maxModel, value => {
  draftMax.value = String(value)
})

function commitMax() {
  if (!isEditingMax.value)
    isEditingMax.value = false;

  const value = Number(draftMax.value)

  if (Number.isFinite(value)) {
    props.maxModel.value = value
  }

  draftMax.value = String(props.maxModel.value)
}
</script>

<template>
  <UFormField class="pb-3.5">
    <div class="mb-3 grid grid-cols-2 gap-3">
      <UFormField label="Min">
        <UInput v-model="draftMin" @blur="commitMin" @keydown.enter="commitMin" />
      </UFormField>

      <UFormField label="Max">
        <UInput v-model="draftMax" @blur="commitMax" @keydown.enter="commitMax" />
      </UFormField>
    </div>

    <div class="px-1">
      <USlider v-model="model.value" :min :max />
    </div>
  </UFormField>
</template>
