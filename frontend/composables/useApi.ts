import { useFetch, useRequestHeaders, useNuxtApp } from '#app'
import { useRuntimeConfig } from 'nuxt/app'

type UseFetchType = typeof useFetch

export const useApi: UseFetchType = (path: string, options: any = {}) => {
  const config = useRuntimeConfig()

  const headers = process.server ? useRequestHeaders(['cookie']) : {}
  const isFormData = options.body instanceof FormData

  const modifiedOptions = {
    ...options,
    headers: {
      ...headers,
      ...options.headers,
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
    },
    baseURL: config.public.apiUrl,
    ...(isFormData ? {} : { body: JSON.stringify(options.body) }),
  }

  if (isFormData) {
    modifiedOptions.body = options.body
  }

  return useFetch(path, modifiedOptions)
}
