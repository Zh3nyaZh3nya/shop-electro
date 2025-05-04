<script setup lang="ts">
import { useAsyncData } from "#app";
import { useApi } from "~/composables/useApi";
import type { PropsCrumbs } from "~/components/Admin/BreadCrumbs.vue";
import { useNotificationStore } from "~/stores/notifications";

const route = useRoute()
const { getByPage } = useAdminMenu()
const notifications = useNotificationStore()

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

const crumbs: PropsCrumbs[] = [
  {
    title: pageTitle.value,
    href: String(route.params.page),
    disabled: false,
  },
  {
    title: 'Список',
    href: String(route.params.page),
    disabled: false,
  },
  {
    title: 'Редактирование',
    href: route.params.page + '/edit?' + route.query.id,
    disabled: true,
  },
  {
    title: pageEditData.value.title,
    href: route.params.page + '/edit?' + route.query.id,
    disabled: true,
  },
]

async function editData(payload) {
  if(!payload) return

  await useApi(`/admin/${route.params.page}/edit`, {
    method: 'POST',
    credentials: 'include',
    body: payload
  })

  notifications.add({
    title: 'Сохранено',
    message: 'Данные сохранены',
    type: 'success'
  })
}

definePageMeta({
  layout: 'admin',
})
</script>

<template>
  <template v-if="!pageEditError || !route.query.id">
    <section>
      <v-container>
        <AdminBreadCrumbs :crumbs="crumbs" />
      </v-container>
    </section>
    <section v-if="pageEditData && Object.keys(pageEditData).length">
      <v-container>
        <template v-if="pageType === 'card-color'">
          <AdminDisplayCardColor
              :action="'edit'"
              :title="pageEditData.title"
              :item="pageEditData"
              @update-data="editData"
          />
        </template>
      </v-container>
    </section>
  </template>
  <template v-else>
    <section class="h-100">
      <v-container class="d-flex flex-column justify-center h-100 align-center text-center">
        <h1 class="text-h4 font-weight-bold">Произошла ошибка при получении данных</h1>
        <h2 class="text-h6 font-weight-medium">Обновите страницу или перезайдите в админ-панель</h2>
      </v-container>
    </section>
  </template>
</template>

<style scoped>

</style>