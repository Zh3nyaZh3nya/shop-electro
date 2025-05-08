<script setup lang="ts">
import { useAsyncData } from "#app";
import { useApi } from "~/composables/useApi";
import { useStore } from "~/stores/store";
import { storeToRefs } from "pinia";

const store = useStore()

const { data: bannersData, pending: bannersDataPending } = await useAsyncData<IBanner[]>('main-page-banners-data', async () => {
  const { data: dataFetch } = await useApi<{ items: IBanner[] }>(`/main-banner?mainPage=true`, { method: 'GET' })

  return dataFetch?.value?.items || []
})

const { data: categoriesData, pending: categoriesDataPending } = await useAsyncData<IBannerOnlyImage[]>('main-page-categories-data', async () => {
  await store.fetchCategories(true)
  const { categoriesMain } = storeToRefs(store)

  const data = categoriesMain.value.map((item: ICategory): IBannerOnlyImage => {
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

const { data: offersData, pending: offersDataPending } = await useAsyncData<IBannerOnlyImage[]>('main-page-offers-data', async () => {
  const { data: dataFetch } = await useApi<{ items: IBanner[] }>(`/main-offer?mainPage=true`, { method: 'GET' })

  return dataFetch?.value?.items || []
})
</script>

<template>
  <v-overlay
      :model-value="bannersDataPending || categoriesDataPending || offersDataPending"
      class="align-center justify-center"
  >
    <v-progress-circular
        color="admin-primary"
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
      >
        <template #default="{ slide, index }">
          <v-card
              class="d-flex flex-column align-center border my-2 text-center pa-4 w-100 card-hover"
              :to="`/categories/${slide.link}`"
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
<!--  <section v-if="infoBlocksData && infoBlocksData.length">-->
<!--    <v-container>-->
<!--      <v-row>-->
<!--        <v-col-->
<!--          cols="12"-->
<!--          md="3"-->
<!--        >-->
<!--          <v-card-->
<!--              elevation="0"-->
<!--              class="pa-6 main-info-blocks-enter"-->
<!--              height="204px"-->
<!--              rounded="xl"-->
<!--          >-->
<!--            <p class="text-body-1 mb-2 font-weight-bold">Личный кабинет</p>-->
<!--            <p class="text-body-2">Получайте бонусы, отслеживайте заказы и делитесь мнением</p>-->
<!--          </v-card>-->
<!--        </v-col>-->
<!--        <v-col-->
<!--          cols="12"-->
<!--          md="9"-->
<!--        >-->
<!--          <UISlider-->
<!--              :slides="infoBlocksData || []"-->
<!--              :per-view="4.4"-->
<!--              :space-between="15"-->
<!--          >-->
<!--            <template #default="{ slide, index }">-->
<!--              <v-card-->
<!--                  elevation="0"-->
<!--                  rounded="xl"-->
<!--                  class="pa-4"-->
<!--                  :style="{'background': slide.color }"-->
<!--                  width="100%"-->
<!--                  height="204px"-->
<!--              >-->
<!--                <p class="text-body-1 font-weight-bold mb-2 text-secondary">{{ slide.title }}</p>-->
<!--                <p class="text-body-2 text-secondary">{{ slide.description }}</p>-->
<!--              </v-card>-->
<!--            </template>-->
<!--          </UISlider>-->

<!--        </v-col>-->
<!--      </v-row>-->
<!--    </v-container>-->
<!--  </section>-->
<!--  <section v-if="brandData && brandData.length">-->
<!--    <v-container>-->
<!--      <UISlider-->
<!--          :slides="brandData || []"-->
<!--          :breakpoints="{-->
<!--            '0': {-->
<!--              slidesPerView: 2.3,-->
<!--              spaceBetween: 10,-->
<!--            },-->
<!--            '600': {-->
<!--              slidesPerView: 4.3,-->
<!--              spaceBetween: 10,-->
<!--            },-->
<!--            '960': {-->
<!--              slidesPerView: 6.6,-->
<!--              spaceBetween: 10,-->
<!--            },-->
<!--            '1200': {-->
<!--              slidesPerView: 8.4,-->
<!--              spaceBetween: 10,-->
<!--            },-->
<!--            '1500': {-->
<!--              slidesPerView: 9.8,-->
<!--              spaceBetween: 15,-->
<!--            }-->
<!--          }"-->
<!--      >-->
<!--        <template #default="{ slide, index }">-->
<!--          <v-card-->
<!--              elevation="1"-->
<!--              rounded="xl"-->
<!--              class="d-flex align-center justify-center pa-4 my-1"-->
<!--              width="132px"-->
<!--              height="68px"-->
<!--              :to="`/categories/${slide.value}`"-->
<!--          >-->
<!--            <v-img :src="slide.image"  />-->
<!--          </v-card>-->
<!--        </template>-->
<!--      </UISlider>-->
<!--    </v-container>-->
<!--  </section>-->
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