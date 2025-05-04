// https://nuxt.com/docs/api/configuration/nuxt-config
import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'
import { copyFile, mkdir, readdir, stat } from 'fs/promises'
import { join, dirname } from 'path'

async function copyStaticData() {
  const fromDir = join(process.cwd(), 'assets/staticData')
  const toDir = join(process.cwd(), '.output/assets/staticData')

  async function copyRecursive(src: string, dest: string) {
    const entries = await readdir(src, { withFileTypes: true })

    for (const entry of entries) {
      const srcPath = join(src, entry.name)
      const destPath = join(dest, entry.name)

      if (entry.isDirectory()) {
        await mkdir(destPath, { recursive: true })
        await copyRecursive(srcPath, destPath)
      } else {
        await mkdir(dirname(destPath), { recursive: true })
        await copyFile(srcPath, destPath)
      }
    }
  }

  await mkdir(toDir, { recursive: true })
  await copyRecursive(fromDir, toDir)
}

export default defineNuxtConfig({
  hooks: {
    'nitro:build:public-assets': async () => {
      await copyStaticData()
    }
  },
  css: [
    'vuetify/lib/styles/main.sass',
    "@/assets/fonts/fonts.css",
    "@/assets/styles/admin.scss",
    '@/assets/styles/global.scss',
  ],
  runtimeConfig: {
    public: {
      apiUrl: process.env.API_ENDPOINT ?? 'http://localhost:3000/api'
    }
  },
  build: {
    transpile: ['vuetify'],
  },
  modules: [
    'vue-yandex-maps/nuxt',
    '@pinia/nuxt',
    (_options, nuxt) => {
      nuxt.hooks.hook('vite:extendConfig', (config) => {
        // @ts-expect-error
        config.plugins.push(vuetify({
          autoImport: true,
          styles: {
            configFile: 'assets/styles/vuetify.scss',
          },
        }))
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
