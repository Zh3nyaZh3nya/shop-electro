<script setup lang="ts">
import { useDisplay } from "vuetify";
import { useApi } from "~/composables/useApi";
import { useAsyncData } from "#app";

const { mdAndUp } = useDisplay()

const { data: defaultData, pending: defaultPending, error } = await useAsyncData('default-data', async () => {
  const { data: citiesData } = await useApi<{ items: any }>('/cities')

  return { cities: citiesData?.value?.items }
})
</script>

<template>
  <v-overlay
      :model-value="defaultPending"
      class="align-center justify-center"
  >
    <v-progress-circular
        color="primary"
        size="64"
        indeterminate
    ></v-progress-circular>
  </v-overlay>
  <v-app>
    <Header :cities="defaultData?.cities" />
    <MobileMenu v-if="!mdAndUp" />
    <v-main>
      <NuxtPage />
    </v-main>
  </v-app>
</template>

<style scoped>

</style>