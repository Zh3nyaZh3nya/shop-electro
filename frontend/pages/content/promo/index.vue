<script setup lang="ts">
import { useAsyncData } from "#app";
import { useApi } from "~/composables/useApi";

const crumbs: IBreadcrumbs[] = [
  {
    title: 'Главная',
    href: '/',
    disabled: false,
  },
  {
    title: 'Все Акции',
    href: '/',
    disabled: true,
  }
]

const { data: promoData, pending: promoDataPending } = await useAsyncData('promo-data', async () => {
  const { data: dataFetch } = await useApi<{ items: IPromo[] }>(`/content-promo`, { method: 'GET' })

  return dataFetch?.value?.items || []
})

</script>

<template>
  <v-overlay
      :model-value="
        promoDataPending
      "
      class="align-center justify-center"
  >
    <v-progress-circular
        color="primary"
        size="64"
        indeterminate
    ></v-progress-circular>
  </v-overlay>
  <v-main>
    <section>
      <v-container>
        <UIBreadcrumbs :crumbs="crumbs" />
      </v-container>
    </section>
    <section>
      <v-container class="text-center">
        <h1 class="text-h4 font-weight-bold text-secondary">Акции и скидки Haier</h1>
        <p class="text-h6 font-weight-regular text-secondary">Воспользуйтесь нашими выгодными предложениями!</p>
      </v-container>
    </section>
    <section>
      <v-container>
        <v-row justify="center">
          <v-col
              v-for="promo in promoData"
              :key="promo.id"
              cols="12"
              md="4"
          >
            <v-card
                rounded="lg"
                class="v-card-not-shadow h-100"
                color="grey-light-4"
                :to="`/content/promo/${promo.id}`"
            >
              <v-img :src="promo.image" height="255px" rounded="lg" cover />
              <div class="pa-4">
                <p class="text-h5 font-weight-medium text-secondary">{{ promo.title }}</p>
                <nuxt-link class="text-h6 text-primary font-weight-regular d-fex align-center">
                  <span>Подробнее</span>
                  <v-icon icon="mdi-arrow-right" size="18" class="ml-1" />
                </nuxt-link>
              </div>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </section>
  </v-main>
</template>

<style scoped lang="scss">

</style>