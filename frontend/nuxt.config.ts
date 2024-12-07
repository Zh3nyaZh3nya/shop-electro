// https://nuxt.com/docs/api/configuration/nuxt-config
import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'
import i18n from '@nuxtjs/i18n'

export default defineNuxtConfig({
  css: ['~/assets/styles/global.scss', 'vuetify/lib/styles/main.sass'],
  runtimeConfig: {
    public: {
      apiUrl: process.env.API_ENDPOINT ?? 'http://127.0.0.1:8000/api'
    }
  },
  build: {
    transpile: ['vuetify'],
  },
  modules: [
    '@nuxtjs/i18n',
    'vue-yandex-maps/nuxt',
    '@pinia/nuxt',
    (_options, nuxt) => {
      nuxt.hooks.hook('vite:extendConfig', (config) => {
        // @ts-expect-error
        config.plugins.push(vuetify({ autoImport: true }))
      })
    },
  ],
  vite: {
    vue: {
      template: {
        transformAssetUrls,
      },
    },
  },
  i18n: {
    defaultLocale: "ru",
    locales: [
      { code: "ru", name: "Рус", file: 'locales/ru.json' },
      { code: "kk", name: "Каз", file: 'locales/kk.json' },
    ],
    lazy: true,
    langDir: '',
  },
  yandexMaps: {
    apikey: '61a0064e-8ce3-4b3e-a7d1-cf970fadd310',
    servicesApikeys: {
      suggest: '047542a5-b4a3-4530-96d1-74d58f0e0117',
    }
  },
  pinia: {
    storesDirs: ['./stores/**', './custom-folder/stores/**'],
  },
  imports: {
    dirs: [
      'composables',
      'composables/*/index.{ts,js,mjs,mts}',
      'composables/**'
    ]
  },
  compatibilityDate: '2024-11-01',
  devtools: { enabled: false },
  ssr: true
})
