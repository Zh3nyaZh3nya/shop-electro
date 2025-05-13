<script setup lang="ts">
import { useDisplay } from "vuetify";
import { useApi } from "~/composables/useApi";
import { useAsyncData } from "#app";
import { storeToRefs } from "pinia";

const { mdAndUp } = useDisplay()
const store = useStore()

const { data: citiesData, pending: citiesPending } = await useAsyncData('default-data-cities', async () => {
  const { data: responseData } = await useApi<{ items: any }>('/cities')

  return { cities: responseData?.value?.items }
})

const { data: categoriesData, pending: categoriesPending } = await useAsyncData<ICategory[]>('main-page-categories-data', async () => {
  await store.fetchCategories()
})
</script>

<template>
  <v-overlay
      :model-value="citiesPending || categoriesPending"
      class="align-center justify-center"
  >
    <v-progress-circular
        color="primary"
        size="64"
        indeterminate
    ></v-progress-circular>
  </v-overlay>
  <v-app>
    <Header :cities="citiesData?.cities" />
    <MobileMenu v-if="!mdAndUp" />
    <NuxtPage />
    <Footer />
  </v-app>
</template>

<style scoped>

</style>