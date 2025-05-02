<script setup lang="ts">
import { useAsyncData } from "#app";
import { useApi } from "~/composables/useApi";

const route = useRoute()
const { getByPage } = useAdminMenu()

const pageConfig = computed(() => getByPage(route.params.page as string))
const pageTitle = computed(() => pageConfig.value?.title ?? 'Без названия')
const pageType = computed(() => pageConfig.value?.type ?? 'card')

const { data: pageEditData, pending: pageEditPending, error: pageEditError } = await useAsyncData(
    `admin-${route.params.page}-data-${route.query.id}`,
    async () => {
      const { data: dataFetch } = await useApi(`/admin/${route.params.page}/${route.query.id}`, {
        method: 'GET',
        credentials: 'include',
      })

      const { item } = dataFetch.value

      return item
    },
)

const crumbs = ref([
  {
    title: pageTitle.value,
    href: route.params.page,
    disabled: false,
  },
  {
    title: pageEditData.value.title,
    href: route.params.page,
    disabled: true,
  },
])

definePageMeta({
  layout: 'admin',
})
</script>

<template>
  <template v-if="!pageEditError">
    <section>
      <v-container>
        <AdminBreadCrumbs :crumbs="crumbs" />
      </v-container>
    </section>
  </template>
  <template v-else>
    <section class="h-100">
      <v-container class="d-flex flex-column justify-center h-100 align-center text-center">
        <h1 class="text-h4 font-weight-bold">Произошла ошибка при получении данных</h1>
        <h2 class="text-h6 font-weight-medium">Обновите страницу или перезайди в админ-панель</h2>
      </v-container>
    </section>
  </template>
</template>

<style scoped>

</style>