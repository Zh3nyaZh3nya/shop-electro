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

const { data: lastId, pending: lastIdPending, error: lastIdError } = await useAsyncData(
    `admin-${route.params.page}-data-create`,
    async () => {
      const { data: dataFetch } = await useApi(`/admin/${route.params.page}/last-id`, {
        method: 'GET',
        credentials: 'include',
      })

      return dataFetch
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
    title: 'Создание',
    href: route.params.page + '/edit?' + route.query.id,
    disabled: true,
  },
]

async function createData<T extends object>(payload: T & BaseItem | BaseItemEnum) {
  if (!payload) return

  const formData = new FormData()

  for (const [key, value] of Object.entries(payload)) {
    if (value instanceof File) {
      formData.append(key, value)
    } else if (Array.isArray(value) || typeof value === 'object') {
      formData.append(key, JSON.stringify(value))
    } else if (value !== undefined && value !== null) {
      formData.append(key, String(value))
    }
  }

  await useApi(`/admin/${route.params.page}/add`, {
    method: 'POST',
    body: formData,
    credentials: 'include',
  })

  notifications.add({
    title: 'Добавлено',
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
  <template v-if="!lastIdError">
    <section>
      <v-overlay
          :model-value="lastIdPending"
          class="align-center justify-center"
      >
        <v-progress-circular
            color="admin-primary"
            size="64"
            indeterminate
        ></v-progress-circular>
      </v-overlay>
      <v-container>
        <AdminBreadCrumbs :crumbs="crumbs" />
      </v-container>
    </section>
    <section>
      <v-container>
        <template v-if="pageType.includes('card-color')">
          <AdminDisplayCardColor
              :action="'create'"
              :last_id="lastId?.value?.last_id"
              @update-data="createData"
          />
        </template>
        <template v-if="pageType.includes('card-enum') || pageType.includes('card-enum-subcategory')">
          <AdminDisplayCardEnum
              :action="'create'"
              :last_id="lastId?.value?.last_id"
              :is-image="pageType.includes('image')"
              :is_for_main_page="pageType.includes('for-main-page')"
              :is_subcategory="pageType.includes('card-enum-subcategory')"
              @update-data="createData"
          />
        </template>
        <template v-if="pageType.includes('product')">
          <AdminDisplayProduct
              :action="'create'"
              :last_id="lastId?.value?.last_id"
              :is-image="pageType.includes('image')"
              :is_for_main_page="pageType.includes('for-main-page')"
              :is_subcategory="pageType.includes('card-enum-subcategory')"
              @update-data="createData"
          />
        </template>
        <template v-else>
          <AdminDisplayCard
              :action="'create'"
              :last_id="lastId?.value?.last_id"
              :is_video="pageType.includes('video')"
              :is-image="pageType.includes('image')"
              :is_for_main_page="pageType.includes('for-main-page')"
              :is_link="pageType.includes('link')"
              @update-data="createData"
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