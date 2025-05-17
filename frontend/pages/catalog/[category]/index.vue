<script setup lang="ts">
import { useAsyncData } from "#app";
import { useApi } from "~/composables/useApi";
import { storeToRefs } from "pinia";
import { useDisplay } from "vuetify";

const route = useRoute()
const store = useStore()
const { mdAndUp } = useDisplay()

const banner: IBanner[] = [
  {
    id: 1,
    title: 'Телевизоры',
    slug: '',
    video: '/video-banner-televizory.webm',
  }
]

const { data: productsData, pending: productsDataPending } = await useAsyncData('products-data', async () => {
  const { data: dataFetch } = await useApi<{ data: IProductCard[], meta: IMeta }>(`/catalog/${route.params.category}`)

  return { data: dataFetch?.value?.data, meta: dataFetch?.value?.meta }
})

const { data: categoriesData, pending: categoriesDataPending } = await useAsyncData('categories-data', async () => {
  await store.fetchCategories()
  const { categories } = storeToRefs(store)

  return categories.value.find(item => item.value === route.params.category) || []
})

const crumbs: IBreadcrumbs[] = [
  {
    title: 'Главная',
    href: '/',
    disabled: false,
  },
  {
    title: 'Каталог',
    href: '/catalog',
    disabled: false,
  },
  {
    title: categoriesData?.value?.label || [],
    href: '/',
    disabled: true,
  }
]

</script>

<template>
  <v-overlay
      :model-value="productsDataPending || categoriesDataPending"
      class="align-center justify-center"
  >
    <v-progress-circular
        color="primary"
        size="64"
        indeterminate
    ></v-progress-circular>
  </v-overlay>
  <section v-if="$route.params.category === 'televizory'">
    <UIBanner :slides="banner" />
  </section>
  <v-main class="pl-0 pt-0">
    <section>
      <v-container>
        <UIBreadcrumbs :crumbs="crumbs" />
        <h1 class="text-center text-secondary" v-if="$route.params.category !== 'televizory'">{{ categoriesData?.label || 'Категория' }}</h1>
      </v-container>
    </section>
  </v-main>
  <section class="d-flex position-relative" v-if="categoriesData && categoriesData.subcategories && productsData && productsData?.data?.length && productsData?.meta">
    <v-navigation-drawer
        class="position-relative filters"
        style="height: 100%; top: 0;"
        v-if="mdAndUp"
        width="325"
        color="grey-light-4"
    >
      <v-container>
        <div>
          <nuxt-link to="/catalog" class="d-flex align-center text-body-1 text-primary">
            <v-icon icon="mdi-chevron-left" size="18" />
            <p>Весь каталог</p>
          </nuxt-link>
        </div>

        <div style="margin-left: 20px">
          <p class="text-body-1 font-weight-medium mb-1">{{ categoriesData.label }}</p>
          <ul class="ml-4">
            <li
                class="text-body-2 font-weight-medium"
                v-for="sub in categoriesData.subcategories"
                :key="sub.id"
            >
              <nuxt-link :to="`/catalog/${categoriesData.value}/${sub.value}`" class="d-flex align-center ga-1 link-hover">
                {{ sub.label }}
                <v-icon icon="mdi-chevron-right" size="14" style="margin-top: 2px" />
              </nuxt-link>
            </li>
          </ul>
        </div>

      </v-container>
    </v-navigation-drawer>
    <div class="d-flex flex-grow-1" style="min-width: 0">
      <v-container>
        <div class="d-flex justify-space-between mb-4">
          <p class="text-body-2 text-grey">Найдено {{ productsData?.meta.total }} товара</p>
        </div>
        <v-row>
          <v-col
              v-for="sub in categoriesData.subcategories"
              :key="sub.id"
              cols="12"
          >
            <div class="d-flex justify-space-between align-center mb-4">
              <p class="text-h5">{{ sub.label }}</p>
              <nuxt-link class="d-flex align-center text-primary text-h6" :to="`/catalog/${categoriesData.value}/${sub.value}`">
                Перейти в категорию
                <v-icon icon="mdi-chevron-right" size="20" class="d-inline-block" />
              </nuxt-link>
            </div>

            <v-divider class="my-4"></v-divider>

            <UISlider
                :slides="productsData.data.filter(p => p.subcategory.value === sub.value)"
                :per-view="4"
                :breakpoints="{
                  0: {
                    slidesPerView: 1,
                    spaceBetween: 15
                  },
                  760: {
                    slidesPerView: 2,
                    spaceBetween: 15
                  },
                  960: {
                    slidesPerView: 3,
                    spaceBetween: 15
                  },
                  1400: {
                    slidesPerView: 4,
                    spaceBetween: 15
                  },
                  1700: {
                    slidesPerView: 5,
                    spaceBetween: 15
                  },
                }"
            >
              <template #default="{ slide, index }">
                <UICardProduct :data="slide" />
              </template>
            </UISlider>
          </v-col>
        </v-row>
      </v-container>
    </div>
  </section>
</template>

<style lang="scss">
</style>