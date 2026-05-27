import type { NitroFetchOptions, NitroFetchRequest } from 'nitropack';
import type { ApiResponse } from './types/api';

export async function api<T>(url: string, opts?: NitroFetchOptions<NitroFetchRequest>) {
  // const requestHeaders = useRequestHeaders(['cookie']);

  return await $fetch<ApiResponse<T>>(url, {
    // credentials: 'include',
    headers: {
      // ...requestHeaders,
      ...opts?.headers,
    },
    ...opts,
    baseURL: '/api'
  });
}
