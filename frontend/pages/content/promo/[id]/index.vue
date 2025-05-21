<script setup lang="ts">
import { useAsyncData } from "#app";
import { useApi } from "~/composables/useApi";

const route = useRoute()

const { data: promoSlugData, pending: promoSlugDataPending } = await useAsyncData('promo-data', async () => {
  const { data: dataFetch } = await useApi<{ item: IPromo }>(`/content-promo/${route.params.id}`, { method: 'GET' })

  return dataFetch?.value?.item || {}
})

const crumbs: IBreadcrumbs[] = [
  {
    title: 'Главная',
    href: '/',
    disabled: false,
  },
  {
    title: 'Все Акции',
    href: '/content/promo',
    disabled: false,
  },
  {
    title: promoSlugData.value.title || '',
    href: '/',
    disabled: true,
  }
]
</script>

<template>
  <v-overlay
      :model-value="
        promoSlugDataPending
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
      <v-container>
        <h1 class="text-h4 font-weight-bold text-secondary">Акции «{{ promoSlugData.title }}»</h1>
      </v-container>
    </section>
    <section>
      <v-container>
        <v-sheet
            color="grey-light-4"
            max-width="850px"
            class="pa-10"
            rounded="lg"
        >
          <p class="text-body-1 text-center mb-4 text-secondary">Акции «{{ promoSlugData.title }}»</p>
          <div v-html="promoSlugData.description" class="text-secondary text-body-1"></div>
        </v-sheet>
      </v-container>
    </section>
  </v-main>
</template>

<style scoped lang="scss">

</style>