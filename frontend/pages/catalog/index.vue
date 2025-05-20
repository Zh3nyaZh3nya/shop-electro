<script setup lang="ts">
import { useAsyncData } from "#app";
import { useApi } from "~/composables/useApi";
import { storeToRefs } from "pinia";
import { pluralize } from "~/utils/pluralize";

const store = useStore()

const { data: productsData, pending: productsDataPending } = await useAsyncData('products-data', async () => {
  const { data: dataFetch } = await useApi<{ data: IProductCard[] }>(`/catalog`)

  return { data: dataFetch?.value?.data }
})

const { data: categoriesData, pending: categoriesDataPending } = await useAsyncData('categories-data', async () => {
  await store.fetchCategories()
  const { categories } = storeToRefs(store)

  return categories.value
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
  <v-main class="pl-0 pb-0">
    <v-container>
      <UIBreadcrumbs :crumbs="crumbs" />
      <h1 class="text-center text-secondary">Каталог</h1>
    </v-container>
  </v-main>
  <section>
    <v-container>
      <UISlider
          :slides="categoriesData || []"
          :per-view="6.6"
          :space-between="20"
          :breakpoints="{
          '375': {
            slidesPerView: 1.3,
            spaceBetween: 20
          },
          '475': {
            slidesPerView: 2.3,
            spaceBetween: 20
          },
           '760': {
            slidesPerView: 3.3,
            spaceBetween: 20
          },
          '1100': {
            slidesPerView: 4.6,
            spaceBetween: 20
          }
        }"
      >
        <template #default="{ slide, index }">
          <v-card
              class="d-flex flex-column align-center border my-2 text-center pa-4 w-100 card-hover"
              :to="`/catalog/${slide.value}`"
              elevation="light"
              rounded="lg"
          >
            <v-img :src="slide.image" width="150" max-height="72" height="100%" class="mb-2" />
            <p class="text-body-2 font-weight-bold" style="max-width: 140px">
              {{ slide.label }}
              <v-icon icon="mdi-chevron-right" size="16px"></v-icon>
            </p>
          </v-card>
        </template>
      </UISlider>
    </v-container>
  </section>
  <section class="d-flex position-relative" v-if="productsData && productsData?.data?.length && productsData && categoriesData">
    <div class="d-flex flex-grow-1" style="min-width: 0">
      <v-container>
        <div class="d-flex justify-space-between mb-4">
          <p class="text-body-2 text-grey">Найдено {{ productsData.data.length }} {{ pluralize(productsData.data.length, ['товар', 'товара', 'товаров'])}}</p>
        </div>
        <v-row>
          <v-col
              v-for="category in categoriesData"
              :key="category.id"
              cols="12"
          >
            <div class="d-flex flex-column flex-sm-row justify-space-between align-sm-center flex-wrap">
              <p class="text-h6 text-sm-h5 font-weight-bold lh-normal">{{ category.label }}</p>
              <nuxt-link class="d-flex align-center text-primary text-body-1 text-sm-h6" :to="`/catalog/${category.value}`">
                Перейти в категорию
                <v-icon icon="mdi-chevron-right" size="20" class="d-inline-block" />
              </nuxt-link>
            </div>

            <v-divider class="my-4"></v-divider>

            <UISlider
                :slides="productsData.data.filter(p => p.category.value === category.value)"
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
                   1600: {
                    slidesPerView: 5,
                    spaceBetween: 15
                  },
                }"
                :space-between="15"
                :pagination="true"
                :slider-id="category.id"
            >
              <template #default="{ slide, index }">
                <UICardProduct
                    :data="slide || {}"
                />
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