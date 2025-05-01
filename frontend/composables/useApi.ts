import { useFetch, useRequestHeaders, useNuxtApp } from '#app'
import { useRuntimeConfig } from 'nuxt/app'

type UseFetchType = typeof useFetch

export const useApi: UseFetchType = (path: string, options: any = {}) => {
  const config = useRuntimeConfig()

  const headers = process.server ? useRequestHeaders(['cookie']) : {}

  const modifiedOptions = {
    ...options,
    headers: {
      ...headers,
      ...options.headers,
    },
    baseURL: config.public.apiUrl,
  }

  return useFetch(path, modifiedOptions)
}
