<script setup lang="ts">
import { useAsyncData } from "#app";
import { useApi } from "~/composables/useApi";

const { data: bannersData, pending: bannersDataPending } = await useAsyncData<IBanner[]>('main-page-banners-data', async () => {
      const { data: dataFetch } = await useApi<{ items: IBanner[] }>(`/main-banner?mainPage=true`, { method: 'GET' })

      return dataFetch?.value?.items || []
    }
)

const { data: categoriesData, pending: categoriesDataPending } = await useAsyncData<IBanner[]>('main-page-categorie-data', async () => {
      const { data: dataFetch } = await useApi<{ items: IBanner[] }>(`/categories?mainPage=true`, { method: 'GET' })

      return dataFetch?.value?.items || []
    }
)
</script>

<template>
  <v-overlay
      :model-value="bannersDataPending || categoriesDataPending"
      class="align-center justify-center"
  >
    <v-progress-circular
        color="admin-primary"
        size="64"
        indeterminate
    ></v-progress-circular>
  </v-overlay>
  <section v-if="bannersData && bannersData.length" id="mainBanner">
    <MainBanner :slides="bannersData" />
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
<!--              :to="`/brand/${slide.value}`"-->
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
</style>