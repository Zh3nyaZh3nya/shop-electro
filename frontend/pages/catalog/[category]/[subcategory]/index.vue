<script setup lang="ts">
import { useAsyncData } from "#app";
import { useApi } from "~/composables/useApi";
import { storeToRefs } from "pinia";
import { useDisplay } from "vuetify";

const route = useRoute()
const store = useStore()
const { mdAndUp } = useDisplay()

const page = ref(1)
const drawer = ref(false)
const perPage = 12
const banner: IBanner[] = [
  {
    id: 1,
    title: 'Телевизоры',
    slug: '',
    video: '/video-banner-televizory.webm',
  }
]

const { data: filtersData, pending: filtersDataPending } = await useAsyncData('filters-data', async () => {
  const { data: dataFetch } = await useApi<{ minPrice: number, maxPrice: number }>(`/catalog/${route.params.category}/${route.params.subcategory}/filters`)

  return { data: dataFetch?.value }
})

const filters = ref({
  installment: false,
  discount: false,
  inStock: false,
  priceRange: [filtersData?.value?.data?.minPrice || 0, filtersData?.value?.data?.maxPrice || 0],
})

const { data: productsData, pending: productsDataPending } = await useAsyncData(
    `products-${filters.value}-${page.value}`,
    async () => {
      const { data: dataFetch } = await useApi<{ data: IProductCard[], meta: IMeta }>(
          `/catalog/${route.params.category}/${route.params.subcategory}?` +
          `discount=${filters.value.discount}` +
          `&installment=${filters.value.installment}` +
          `&inStock=${filters.value.inStock}` +
          `&priceFrom=${filters.value.priceRange[0]}` +
          `&priceTo=${filters.value.priceRange[1]}` +
          `&page=${page.value}` +
          `&per_page=${perPage}`
      )

      return {
        data: dataFetch?.value?.data || [],
        meta: dataFetch?.value?.meta || { total: 0, page: 1, per_page: perPage, totalPages: 1 },
      }
    },
    {
      watch: [filters, page]
    }
)

const { data: categoriesData, pending: categoriesDataPending } = await useAsyncData('categories-data', async () => {
  await store.fetchCategories()
  const { categories } = storeToRefs(store)

  const category = categories.value.find(item => item.value === route.params.category)
  const subcategory = category?.subcategories?.find(item => item.value === route.params.subcategory) || {}

  return { category, subcategory }
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
    title: categoriesData?.value?.category?.label || '',
    href: `/catalog/${categoriesData?.value?.category?.value}`,
    disabled: false,
  },
  {
    title: categoriesData?.value?.subcategory?.label || '',
    href: `/`,
    disabled: true,
  },
]

watch(filters, () => {
  page.value = 1
}, { deep: true })
</script>

<template>
  <v-overlay
      :model-value="productsDataPending || categoriesDataPending || filtersDataPending"
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
  <v-main  class="pl-0 pb-0" :class="$route.params.category === 'televizory' ? 'pt-0' : ''">
    <section>
      <v-container>
        <UIBreadcrumbs :crumbs="crumbs" />
        <h1 class="text-center text-secondary" v-if="$route.params.category !== 'televizory' && mdAndUp">{{ categoriesData?.label || 'Категория' }}</h1>
        <div class="d-flex align-center justify-space-between" v-else-if="!mdAndUp">
          <h1 class="text-center text-secondary" v-if="$route.params.category !== 'televizory'">{{ categoriesData?.label || 'Категория' }}</h1>
          <div class="d-flex align-center ga-2 cursor-pointer" @click="drawer = !drawer">
            <v-icon icon="mdi-tune-variant" />
            <p>Фильтры</p>
          </div>
        </div>
      </v-container>
    </section>
  </v-main>
  <section
      class="d-flex position-relative"
      v-if="
        categoriesData &&
        categoriesData.category &&
        categoriesData.subcategory
      "
  >
    <UIFilters
        v-if="filtersData && filtersData?.data"
        v-model="filters"
        v-model:drawer-value="drawer"
        :min-price="filtersData.data.minPrice"
        :max-price="filtersData.data.maxPrice"
    />
    <div
        class="d-flex flex-grow-1"
        style="min-width: 0"
        v-if="
          productsData &&
          productsData?.data &&
          productsData?.data?.length
        "
    >
      <v-container>
        <v-row>
          <v-col
              v-for="item in productsData.data"
              :key="item.id"
              cols="12"
              sm="6"
              md="4"
              lg="3"
          >
            <UICardProduct :data="item" />
          </v-col>
        </v-row>

        <v-row justify="center" v-if="productsData?.meta?.totalPages > 1" class="mt-10">
          <v-pagination
              v-model="page"
              :length="productsData.meta.totalPages"
              :total-visible="5"
              color="primary"
          />
        </v-row>
      </v-container>

    </div>
    <div
        v-else
        class="d-flex flex-grow-1"
        style="min-width: 0"
    >
      <v-container class="text-center py-10" >
        <v-icon size="48" color="grey">mdi-package-variant-remove</v-icon>
        <p class="text-h6 mt-4">Товары не найдены</p>
        <p class="text-body-2 text-grey-darken-1">Попробуйте изменить параметры фильтрации</p>
      </v-container>
    </div>

  </section>

</template>

<style lang="scss">
</style>