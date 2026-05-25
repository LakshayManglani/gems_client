import { computed } from 'vue';
import { useRoute } from 'vue-router';
import api from '~/api';


export async function useGemById() {
  const route = useRoute();

  const gemId = route.params.id;

  if (typeof gemId !== "string") {
    throw new Error("Fail to validate gemId")
  }

  const gemsStore = useGemsStore();


  const gem = computed(() => gemsStore.getById(gemId));

  if (!gem.value) {
    const gem = await api.gems.getById({ id: gemId });
    gemsStore.upsertMany([gem]);
  }

  return {
    gem
  };
}
