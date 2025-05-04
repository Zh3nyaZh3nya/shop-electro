<script setup lang="ts">
import { useAsyncData } from "#app";
import { useApi } from "~/composables/useApi";
import type { PropsCrumbs } from "~/components/Admin/BreadCrumbs.vue";
import { useNotificationStore } from "~/stores/notifications";
import type {BaseItem, BaseItemEnum} from "~/components/Admin/Display/Props";

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

async function editData<T extends object>(payload: T & (BaseItem | BaseItemEnum)) {
  if (!payload) return

  const formData = new FormData()

  for (const [key, value] of Object.entries(payload)) {
    if (value instanceof File) {
      formData.append(key, value)
    } else if (value !== undefined && value !== null) {
      formData.append(key, String(value))
    }
  }

  await useApi(`/admin/${route.params.page}/edit`, {
    method: 'POST',
    body: formData,
    credentials: 'include'
  })

  notifications.add({
    title: 'Сохранено',
    message: 'Данные сохранены',
    type: 'success'
  })

  navigateTo({ name: 'admin-page', params: { page: route.params.page } })
}

async function removeData(payload: { id: number | string }) {
  if(!payload) return

  await useApi(`/admin/${route.params.page}/delete`, {
    method: 'POST',
    credentials: 'include',
    body: { id: payload.id }
  })

  notifications.add({
    title: 'Удалено',
    message: 'Данные сохранены',
    type: 'success'
  })

  navigateTo({ name: 'admin-page', params: { page: route.params.page } })
}

definePageMeta({
  layout: 'admin',
})
</script>

<template>
  <template v-if="!pageEditError || !route.query.id">
    <v-overlay
        :model-value="pageEditPending"
        class="align-center justify-center"
    >
      <v-progress-circular
          color="admin-primary"
          size="64"
          indeterminate
      ></v-progress-circular>
    </v-overlay>
    <section>
      <v-container>
        <AdminBreadCrumbs :crumbs="crumbs" />
      </v-container>
    </section>
    <section v-if="pageEditData && Object.keys(pageEditData).length">
      <v-container>
        <template v-if="pageType.includes('card-color')">
          <AdminDisplayCardColor
              :action="'edit'"
              :item="pageEditData"
              @update-data="editData"
              @remove="removeData"
          />
        </template>
        <template v-if="pageType.includes('card-enum')">
          <AdminDisplayCardEnum
              :action="'edit'"
              :item="pageEditData"
              :is-image="pageType.includes('image')"
              :is_for_main_page="pageType.includes('for-main-page')"
              @update-data="editData"
              @remove="removeData"
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