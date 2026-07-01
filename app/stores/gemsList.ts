import { defineStore } from 'pinia';
import api from '~/api';
import type { Gem } from './types/gems';

type PaginationKey = string;
type Pagination = Awaited<ReturnType<typeof api.gems.getList>>['pagination'];
type QueryParam = Parameters<typeof api.gems.getList>['0'];


export const useGemsListStore = defineStore('gems:list', {
  state() {
    const currentState: {
      pages: Record<PaginationKey, Gem['id'][]>;
      pagination: Record<PaginationKey, Pagination>;
      loading: boolean;
    } = {
      pages: {},
      pagination: {},
      loading: false,
    };

    return currentState;
  },
  getters: {
    pageKey() {
      return (filters: QueryParam) => {
        return JSON.stringify(sortObject(filters));
      };
    },

    hasPage(state) {
      return (key: PaginationKey) => {
        return state.pages[key] !== undefined;
      };
    },

    getPagesIds(state) {
      return (key: PaginationKey) => {
        return state.pages[key];
      };
    },

    getPageMeta(state) {
      return (key: PaginationKey) => {
        return state.pagination[key];
      };
    },

    getPageProducts() {
      const gems = useGemsStore();

      return (key: PaginationKey) => {
        const gemStore = this.getPagesIds(key);
        return gemStore?.map((id) => gems.getById(id)).filter((item) => !!item);
      };
    },
  },
  actions: {
    async fetchPage(queryParam: QueryParam, hard?: boolean, signal?: AbortSignal) {
      const key = this.pageKey(queryParam);

      if (!hard && this.hasPage(key)) return

      this.loading = true;

      const response = await api.gems.getList(queryParam, signal);

      const gemStore = useGemsStore();
      gemStore.upsertMany(response.items);

      this.pages[key] = response.items.map((item) => item.id);
      this.pagination[key] = response.pagination;
      this.loading = false;
    },
  },
});
