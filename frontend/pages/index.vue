<script setup lang="ts">
import { useAsyncData } from "#app";
import { useApi } from "~/composables/useApi";
import { useStore } from "~/stores/store";
import { storeToRefs } from "pinia";

const store = useStore()

const info: { title: string, icon: string, description: string }[] = [
  {
    title: 'Выгода при покупке',
    icon: 'mdi-credit-card',
    description: 'Совершите первый заказ и получите клубную скидку'
  },
  {
    title: 'Расширенная гарантия',
    icon: 'mdi-text-box',
    description: 'при покупке на haieronline.kz и в фирменных магазинах Haier'
  },
  {
    title: 'Бесплатная доставка',
    icon: 'mdi-truck-fast',
    description: 'до двери'
  },
  {
    title: 'Бесплатная установка',
    icon: 'mdi-gift',
    description: 'стиральных машин, стирально-сушильных машин и cушильных машин',
  }
]

const { data: bannersData, pending: bannersDataPending } = await useAsyncData('main-page-banners-data', async () => {
  const { data: dataFetch } = await useApi<{ items: IBanner[] }>(`/main-banner?mainPage=true`, { method: 'GET' })

  return dataFetch?.value?.items || []
})

const { data: categoriesData, pending: categoriesDataPending } = await useAsyncData('main-page-categories-data', async () => {
  await store.fetchCategories(true)
  const { categoriesMain } = storeToRefs(store)

  const data = categoriesMain.value.map((item: Omit<ICategory, 'subcategories'>): IBannerOnlyImage => {
    return {
      id: item.id,
      image: item.image,
      title: item.label,
      link: item.value,
      slug: item.value
    }
  })

  return data
})

const { data: offersData, pending: offersDataPending } = await useAsyncData('main-page-offers-data', async () => {
  const { data: dataFetch } = await useApi<{ items: IBanner[] }>(`/main-offer?mainPage=true`, { method: 'GET' })

  return dataFetch?.value?.items || []
})

const { data: catalogData, pending: catalogDataPending } = await useAsyncData('main-page-catalog-data', async () => {
  const { data: dataFetch } = await useApi<IProductCard[]>(`/catalog/main`, { method: 'GET' })

  return dataFetch?.value || []
})

const { data: techData, pending: techDataPending } = await useAsyncData('main-page-tech-data', async () => {
  const { data: dataFetch } = await useApi<{ items: IBanner[] }>(`/main-technology?mainPage=true`, { method: 'GET' })

  return dataFetch?.value?.items || []
})
</script>

<template>
  <v-overlay
      :model-value="
        bannersDataPending ||
        categoriesDataPending ||
        offersDataPending ||
        catalogDataPending ||
        techDataPending
      "
      class="align-center justify-center"
  >
    <v-progress-circular
        color="primary"
        size="64"
        indeterminate
    ></v-progress-circular>
  </v-overlay>
  <section v-if="bannersData && bannersData.length" id="mainBanner">
    <UIBanner :slides="bannersData" />
  </section>
  <section v-if="categoriesData && categoriesData.length">
    <v-container>
      <UISlider
        :slides="categoriesData"
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
        :slider-id="'category-main'"
      >
        <template #default="{ slide, index }">
          <v-card
              class="d-flex flex-column align-center border my-2 text-center pa-4 w-100 card-hover"
              :to="`/catalog/${slide.link}`"
              elevation="light"
              rounded="lg"
          >
            <v-img :src="slide.image" width="150" max-height="72" height="100%" class="mb-2" />
            <p class="text-body-2 font-weight-bold" style="max-width: 140px">
              {{ slide.title }}
              <v-icon icon="mdi-chevron-right" size="16px"></v-icon>
            </p>
          </v-card>
        </template>
      </UISlider>
    </v-container>
  </section>
  <section v-if="offersData && offersData.length" class="rounded-lg mb-8">
    <v-container class="rounded-lg">
      <UISlider
          :slides="offersData"
          :per-view="1.2"
          :space-between="5"
          :pagination="true"
          :slider-id="'category-offers'"
      >
        <template #default="{ slide, index }">
          <div class="position-relative h-100 w-100">
            <v-img
                :src="slide.image"
                width="100%"
                height="100%"
                rounded="lg"
                class="offers-image"
                cover
            />
            <v-container class="slider-container">
              <p class="text-h5 text-md-h4 font-weight-regular mb-2" style="max-width: 400px">{{ slide.title }}</p>
              <div v-html="slide.description" class="text-body-2 text-md-body-1 font-weight-bold lh-normal mb-4"></div>
              <v-btn
                  color="primary"
                  size="large"
                  rounded="lg"
                  class="text-body-2"
                  elevation="0"
              >
                {{ slide.link_text }}
              </v-btn>
            </v-container>
          </div>
        </template>
      </UISlider>
    </v-container>
  </section>
  <section v-if="catalogData && catalogData.length" class="mb-10">
    <v-container>
      <h2 class="text-h4 font-weight-medium mb-8">Выгодные предложения</h2>
      <UISlider
          :slides="catalogData"
          :per-view="5"
          :space-between="15"
          :pagination="true"
          :slider-id="'category-offers'"
      >
        <template #default="{ slide, index }">
          <UICardProduct
            :data="slide"
            :is_main="true"
          />
        </template>
      </UISlider>

    </v-container>
  </section>
  <section class="mb-4">
    <v-container>
      <v-row>
        <v-col
            v-for="card in info"
            :key="card.title"
            cols="12"
            md="6"
            lg="3"
        >
          <v-card
              rounded="lg"
              height="232px"
              width="100%"
              elevation="0"
              class="pt-8 px-8 pb-10"
              style="background: radial-gradient(149.65% 34.67% at 50% -9.17%,hsla(0,0%,100%,.3) 0,hsla(0,0%,100%,0) 100%),#0f0f0f"
          >
            <div class="d-flex flex-column align-center">
              <div class="rounded-lg d-flex justify-center align-center mb-4" style="background: linear-gradient(314.8deg,#333 45.91%,#c1c1c1 153.69%); width: 46px; height: 46px;">
                <v-icon :icon="card.icon" color="white" />
              </div>
              <p class="text-body-2 text-white text-center mb-2">{{ card.title }}</p>
              <p class="text-body-2 text-grey text-center">{{ card.description }}</p>
            </div>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </section>
  <section v-if="techData && techData.length" class="mb-8">
    <v-container>
      <h3 class="text-h4 font-weight-medium mb-8">Технологии</h3>
      <UISlider
          :slides="techData"
          :per-view="3.2"
          :space-between="15"
          :pagination="true"
          :loop="true"
          :slider-id="'category-tech'"
      >
        <template #default="{ slide, index }">
          <v-card
            elevation="0"
            :style="{
              backgroundImage: `url('${slide?.image}')`,
              backgroundPosition: 'center',
              backgroundSize: 'cover',
              backgroundRepeat: 'no-repeat'
            }"
            height="420px"
            width="100%"
            rounded="lg"
            class="d-flex flex-column align-center justify-end"
            :to="slide.link"
          >
            <p class="text-h6 font-weight-bold" :class="index === 0 ? 'text-black' : 'text-white'">{{ slide.title }}</p>
            <div v-html="slide.description" class="text-center text-body-2 text-grey mb-8"></div>
            <div class="d-flex align-center ga-1 text-primary mb-6 font-weight-medium">
              <p>{{ slide.link_text }}</p>
              <v-icon icon="mdi-chevron-right" size="18" style="margin-top: 1px" />
            </div>
          </v-card>
        </template>
      </UISlider>
    </v-container>
  </section>
</template>

<style lang="scss">
.main {
  &-info-blocks {
    &-enter {
      background: #fff7da url('/main/enter.png') no-repeat bottom right;
    }
  }

}

.slider-container {
  position: absolute;
  top: 0;
  color: #fff;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: start;
  margin-left: 80px;
  height: 100%;
  @media (max-width: 960px) {
    margin-left: 60px;
  }
  @media (max-width: 600px) {
    margin-left: 20px;
  }
}

.offers-image {
  @media (min-width: 0px) {
    min-height: 430px;
  }
  @media (min-width: 960px) {
    max-height: 352px;
    min-height: 300px;
  }
}
</style>