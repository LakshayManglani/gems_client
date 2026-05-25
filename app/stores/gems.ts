import { defineStore } from "pinia";
import type { Gem } from "./types/gems";

export const useGemsStore = defineStore('gems', {
  state() {
    const currentState: {
      data: Record<Gem['id'], Gem>;
    } = {
      data: {}
    };

    return currentState;
  },
  getters: {
    getById(state) {
      return (id: Gem['id']) => state.data[id];
    },
  },
  actions: {
    upsertMany(gems: Gem[]) {
      for (const gem of gems) {
        const existing = this.data[gem.id];
        this.data = {
          ...this.data,
          [gem.id]: {
            ...existing,
            ...gem,
          }
        };
      }
    },
  },
});
