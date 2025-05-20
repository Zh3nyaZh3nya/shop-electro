<script setup lang="ts">
import { useAsyncData } from "#app";
import { useApi } from "~/composables/useApi";
import { storeToRefs } from "pinia";

const store = useStore()
const route = useRoute()
const tab = ref<'desc' | 'specifications' | 'reviews'>('desc')

const { data: productsData, pending: productsDataPending } = await useAsyncData(`products-data-slug`, async () => {
  const { data: dataFetch } = await useApi<IProduct>(`/catalog/${route.params.category}/${route.params.subcategory}/${route.params.slug}`)

  return dataFetch?.value
})

const { data: recomData, pending: recomDataPending } = await useAsyncData(`recom-data-slug`, async () => {
  const { data: dataFetch } = await useApi<IProduct[]>(`/catalog/${route.params.category}/${route.params.subcategory}/recommendations?id=${productsData?.value?.id}`)

  return dataFetch?.value?.data || []
})

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
    href: `/catalog/${categoriesData?.value?.category?.value}/${categoriesData?.value?.subcategory?.value}`,
    disabled: false,
  },
  {
    title: productsData?.value?.title || '',
    href: '/',
    disabled: true,
  }
]
</script>

<template>
  <v-overlay
      :model-value="productsDataPending || categoriesDataPending || recomDataPending"
      class="align-center justify-center"
  >
    <v-progress-circular
        color="primary"
        size="64"
        indeterminate
    ></v-progress-circular>
  </v-overlay>
  <v-main v-if="productsData">
    <section>
      <v-container>
        <UIBreadcrumbs :crumbs="crumbs" />
        <h1 class="text-secondary text-uppercase text-body-1 font-weight-bold mb-4">{{ productsData.title }}</h1>
        <div class="d-flex align-center justify-space-between">
          <div>
            <v-chip
                rounded="lg"
                v-if="productsData.installment"
                elevation="0"
                color="dark-primary"
                variant="outlined"
                class="text-caption text-uppercase font-weight-medium"
            >
              Рассрочка
            </v-chip>
          </div>
          <div class="d-flex align-center ga-4">
<!--            <div>-->
<!--              <p v-if="productsData.reviews.length" class="text-body-2 text-grey">{{ productsData.reviews.length }}</p>-->
<!--              <p class="text-body-2 text-grey">Пока нет отзывов</p>-->
<!--            </div>-->
            <div>
              <v-btn
                  v-if="!store.favorites.find(p => p.id === productsData?.id)"
                  elevation="0"
                  @click="store.addProduct('favorite', productsData)"
              >
                <div class="d-flex align-center ga-2">
                  <v-icon icon="mdi-heart" color="grey" size="18" />
                  <p class="text-body-1 text-light-primary">В избранное</p>
                </div>
              </v-btn>
              <v-btn
                  v-else
                  elevation="0"
                  @click="store.removeProduct('favorite', productsData.id)"
              >
                <div class="d-flex align-center ga-2">
                  <v-icon icon="mdi-heart-broken" color="primary" size="18" />
                  <p class="text-body-1 text-light-primary">В избранном</p>
                </div>
              </v-btn>
            </div>
          </div>
        </div>
        <v-divider class="mt-4"></v-divider>
      </v-container>
    </section>
    <section>
      <v-container>
        <v-row>
          <v-col
            cols="12"
            md="4"
          >
            <UISliderDouble :images="productsData.images" />
            <p class="text-grey mt-2 text-end text-body-2">В демонстрации технологий могут быть использованы другие модели</p>
          </v-col>
          <v-col
            cols="12"
            md="8"
            class="d-flex justify-end"
          >
            <div class=" w-100" style="max-width: 360px">
              <v-sheet
                  class="pa-8 elevation-light mb-4"
                  rounded="lg"
                  width="100%"
              >
                <div v-if="!productsData.discount">
                  <p class="text-h5 font-weight-bold text-secondary">{{ Number(productsData.price).toLocaleString('ru-RU') }} ₸</p>
                </div>
                <div v-else class="d-flex flex-column align-start mb-2">
                  <div class="d-flex align-start ga-2">
                    <p class="text-body-1 font-weight-bold text-grey text-line ga-2">
                      {{ Number(productsData.price).toLocaleString('ru-RU') }} ₸
                    </p>
                    <p class="text-body-1 text-red font-weight-bold">-{{ productsData.discount_percent }}%</p>
                  </div>

                  <p class="text-h5 font-weight-bold text-red">
                    {{ Math.floor(productsData.price - (productsData.price / productsData.discount_percent)).toLocaleString('ru-RU') }} ₸
                  </p>
                </div>
                <div v-if="productsData.installment" class="d-flex align-center ga-2">
                  <div class="px-3" style="border-radius: 4px; padding: 2px 0; background: #feca65">
                    <span class="text-body-2 font-weight-bold text-secondary">{{ (productsData.price / 24).toFixed() }} ₸</span>
                  </div>
                  <p>x 24 мес.</p>
                </div>
                <v-divider class="my-4" />
                <div v-if="productsData.delivery" class="d-flex align-center ga-2">
                  <v-icon icon="mdi-truck-fast" color="primary" size="20" />
                  <p class="text-body-2">Доставим в любое удобное время!</p>
                </div>
                <v-btn
                    v-if="!store.cart.find(p => p.id === productsData?.id)"
                    class="mt-4"
                    color="primary"
                    elevation="0"
                    size="x-large"
                    block
                    rounded="lg"
                    @click="store.addProduct('cart', productsData)"
                >
                  Добавить в корзину
                </v-btn>
                <v-btn
                    v-else
                    class="mt-4"
                    color="red"
                    elevation="0"
                    size="x-large"
                    block
                    rounded="lg"
                    @click="store.removeProduct('cart', productsData.id)"
                >
                  Удалить
                </v-btn>
              </v-sheet>
              <v-row>
                <v-col
                    cols="6"
                    class="pr-1"
                >
                  <v-card
                      class="pa-8 d-flex flex-column align-center link-hover"
                      rounded="lg"
                      elevation="0"
                      color="grey-light-4"
                      width="100%"
                      to="/terms/payment-and-delivery"
                  >
                    <v-icon icon="mdi-truck-fast" color="grey" class="mb-1" />
                    <p class="text-caption text-grey text-center lh-normal">
                      Бесплатная <br />
                      доставка
                    </p>
                  </v-card>
                </v-col>
                <v-col
                    cols="6"
                    class="pl-1"
                >
                  <v-card
                      class="pa-8 d-flex flex-column align-center"
                      rounded="lg"
                      elevation="0"
                      color="grey-light-4"
                      width="100%"
                  >
                    <v-icon icon="mdi-shield-half-full" color="grey" class="mb-1" />
                    <p class="text-caption text-grey text-center lh-normal">
                      Расширенная <br />
                      гарантия
                    </p>
                  </v-card>
                </v-col>
              </v-row>
            </div>

          </v-col>
        </v-row>

      </v-container>
    </section>
    <section class="mt-10">
      <div>
        <v-container class="pb-0">
          <v-tabs
              v-model="tab"
              align-tabs="center"
              color="primary"
          >
            <v-tab value="desc" class="text-h6">Подробнее о модели</v-tab>
            <v-tab value="specifications" class="text-h6">Характеристики</v-tab>
<!--            <v-tab value="reviews" class="text-h6">Отзывы</v-tab>-->
          </v-tabs>
        </v-container>

        <v-tabs-window v-model="tab">
          <v-tabs-window-item value="desc" class="py-4">
            <v-container max-width="1200px">
              <div v-html="productsData.description" class="text-h6 lh-normal text-secondary"></div>
            </v-container>
          </v-tabs-window-item>
          <v-tabs-window-item value="specifications" class="bg-grey-light-4">
            <v-container max-width="800px">
              <v-expansion-panels
                  variant="accordion"
                  multiple
                  elevation="0"
                  class="accordion"
              >
                <v-expansion-panel
                    v-for="spec in productsData.specifications"
                    :key="spec.title"
                    elevation="0"
                >
                  <v-expansion-panel-title>
                    <span class="text-primary text-h5 font-weight-regular">{{ spec.title }}</span>
                  </v-expansion-panel-title>
                  <v-expansion-panel-text>
                    <div
                        v-for="s in spec.specification"
                        :key="s.title"
                        class="d-flex justify-space-between align-center text-h6 mb-2 px-2 px-sm-16 font-weight-regular"
                    >
                      <p class="text-body-2 text-sm-body-1">
                        {{ s.title }}
                      </p>
                      <p class="text-body-2 text-sm-body-1">
                        {{ s.description }}
                      </p>
                    </div>
                  </v-expansion-panel-text>
                </v-expansion-panel>
              </v-expansion-panels>
            </v-container>
          </v-tabs-window-item>
<!--          <v-tabs-window-item value="reviews"></v-tabs-window-item>-->
        </v-tabs-window>
      </div>
    </section>
    <section>
      <v-container>
        <h2 class="text-h4 text-secondary font-weight-bold mb-4">Смотрите также</h2>
        <UISlider
            v-if="recomData && recomData.length"
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
            :slider-id="1"
            :slides="recomData"
        >
          <template #default="{slide, index}">
            <UICardProduct
                :data="slide"
            />
          </template>
        </UISlider>
        <div
            v-else
            class="d-flex justify-center align-center flex-column text-center my-4"
        >
          <p class="text-h5 font-weight-bold">Пока нет похожих товаров.</p>
          <p class="text-body-1" style="max-width: 400px">Мы не нашли других товаров, соответствующих текущему предложению. Попробуйте посмотреть другие категории или воспользоваться поиском.</p>
        </div>
      </v-container>
    </section>
  </v-main>
</template>

<style scoped>

</style>