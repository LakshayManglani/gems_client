import type { NitroFetchOptions, NitroFetchRequest } from 'nitropack';
import type { ApiResponse } from './types/api';

export async function api<T>(url: string, opts?: NitroFetchOptions<NitroFetchRequest>) {
  // const requestHeaders = useRequestHeaders(['cookie']);

  // TODO: Problaby the below code is not needed
  // I can use the base url in config so that I
  // don't have to include it here
  //
  // const config = useRuntimeConfig();
  // const apiBase = config.public.apiBase;
  // if (!apiBase) {
  //   throw new Error('API base is missing in .env');
  // }

  return await $fetch<ApiResponse<T>>(`/api/v1${url}`, {
    // credentials: 'include',
    headers: {
      // ...requestHeaders,
      ...opts?.headers,
    },
    ...opts,
  });
}
