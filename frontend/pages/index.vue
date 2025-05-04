<script setup lang="ts">
import { useAsyncData } from "#app";
import { useApi } from "~/composables/useApi";

interface infoBlocks {
  title: string
  description: string
  color: string
  id: string
}

interface Brand {
  id: string
  key: string
  value: string
  label: string
  image: string
}

const { data: infoBlocksData, pending: infoBlocksPending } = await useAsyncData<infoBlocks[]>('main-page-info-blocks-data', async () => {
      const { data: dataFetch } = await useApi<{ items: infoBlocks[] }>(`/info-blocks`, { method: 'GET' })

      return dataFetch?.value?.items || []
    }
)

const { data: brandData, pending: brandPending } = await useAsyncData<Brand[]>('main-page-brand-data', async () => {
      const { data: dataFetch } = await useApi<{ items: Brand[] }>(`/brand-enums?mainPage=true`, { method: 'GET' })

      return dataFetch?.value?.items || []
    }
)
</script>

<template>
  <v-overlay
      :model-value="infoBlocksPending || brandPending"
      class="align-center justify-center"
  >
    <v-progress-circular
        color="admin-primary"
        size="64"
        indeterminate
    ></v-progress-circular>
  </v-overlay>
  <section v-if="infoBlocksData && infoBlocksData.length">
    <v-container>
      <v-row>
        <v-col
          cols="12"
          md="3"
        >
          <v-card
              elevation="0"
              class="pa-6 main-info-blocks-enter"
              height="204px"
              rounded="xl"
          >
            <p class="text-body-1 mb-2 font-weight-bold">Личный кабинет</p>
            <p class="text-body-2">Получайте бонусы, отслеживайте заказы и делитесь мнением</p>
          </v-card>
        </v-col>
        <v-col
          cols="12"
          md="9"
        >
          <UISlider
              :slides="infoBlocksData || []"
              :per-view="4.4"
              :space-between="15"
          >
            <template #default="{ slide, index }">
              <v-card
                  elevation="0"
                  rounded="xl"
                  class="pa-4"
                  :style="{'background': slide.color }"
                  width="100%"
                  height="204px"
              >
                <p class="text-body-1 font-weight-bold mb-2 text-secondary">{{ slide.title }}</p>
                <p class="text-body-2 text-secondary">{{ slide.description }}</p>
              </v-card>
            </template>
          </UISlider>

        </v-col>
      </v-row>
    </v-container>
  </section>
  <section v-if="brandData && brandData.length">
    <v-container>
      <UISlider
          :slides="brandData || []"
          :per-view="9.8"
          :space-between="15"

      >
        <template #default="{ slide, index }">
          <v-card
              elevation="1"
              rounded="xl"
              class="d-flex align-center justify-center pa-4 my-1"
              width="132px"
              height="68px"
              :to="`/brand/${slide.value}`"
          >
            <v-img :src="slide.image"  />
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
</style>