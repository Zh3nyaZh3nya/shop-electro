<script setup lang="ts">
import { useRoute } from 'vue-router'
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

const currentPage = ref(1)
const itemsPerPage = ref(10)
const sortBy = ref<string | undefined>(undefined)
const sortDesc = ref<boolean>(false)
const search = ref('')

function generateHeadersFromData(items: any[]): TableHeader[] {
  if (!items.length || typeof items[0] !== 'object') return []

  const keys = Object.keys(items[0]).filter(
      (key) => key !== 'key' && key !== 'value'
  )

  const reorderedKeys: string[] = []

  for (const key of keys) {
    if (key === 'id') {
      reorderedKeys.push('id')
      if (keys.includes('image')) {
        reorderedKeys.push('image')
      }
    } else if (key !== 'image') {
      reorderedKeys.push(key)
    }
  }

  const baseHeaders: TableHeader[] = reorderedKeys.map((key) => ({
    title: key.charAt(0).toUpperCase() + key.slice(1),
    key,
    align: 'center',
    sortable: key !== 'active' && key !== 'image'
  }))

  return [
    {
      title: '',
      key: 'select',
      sortable: false,
      align: 'start',
      width: '50px'
    },
    ...baseHeaders,
    {
      title: '',
      key: 'edit',
      sortable: false,
      align: 'end'
    }
  ]
}

const { data: pageData, pending: pagePending, error: pageError, refresh } = await useAsyncData(
    `admin-${route.params.page}-data`,
    async () => {
      const { data: dataFetch } = await useApi(`/admin/${route.params.page}`, {
        method: 'GET',
        query: {
          page: currentPage.value,
          perPage: itemsPerPage.value,
          sortBy: sortBy.value,
          sortDesc: sortDesc.value,
          search: search.value
        },
        credentials: 'include',
      })

      return dataFetch.value
    },
)

const crumbs: PropsCrumbs[] = [
  {
    title: pageTitle.value,
    href: String(route.params.page),
    disabled: true,
  },
  {
    title: 'Список',
    href: String(route.params.page),
    disabled: true,
  }
]

function onPaginationUpdate(p: {
  page: number
  itemsPerPage: number
  sortBy?: string
  sortDesc?: boolean
}) {
  currentPage.value = p.page
  itemsPerPage.value = p.itemsPerPage
  sortBy.value = p.sortBy
  sortDesc.value = p.sortDesc ?? false
  refresh()
}

async function updateActiveItem(payload: { id: number, active: boolean }) {
  await useApi(`/admin/${route.params.page}/edit`, {
    method: 'POST',
    body: payload,
    credentials: 'include'
  })

  notifications.add({
    title: 'Сохранено',
    message: 'Данные сохранены',
    type: 'success'
  })
}

async function removeSelectItem(payload: { id: number }[]) {
  console.log(payload.map(item => item.id))

  await useApi(`/admin/${route.params.page}/delete`, { method: 'POST', credentials: 'include', body: { ids: payload.map(item => item.id) }})

  notifications.add({
    title: 'Сохранено',
    message: 'Данные сохранены',
    type: 'success'
  })

  await refresh()
}

const onSearch = (value: string) => {
  search.value = value
  refresh()
}

definePageMeta({
  layout: 'admin',
})
</script>


<template>
  <template v-if="!pageError">
    <v-overlay
        :model-value="pagePending"
        class="align-center justify-center"
    >
      <v-progress-circular
          color="admin-primary"
          size="64"
          indeterminate
      ></v-progress-circular>
    </v-overlay>
    <section>
      <v-container class="d-flex justify-space-between align-center py-0">
        <AdminBreadCrumbs :crumbs="crumbs" />
      </v-container>
    </section>
    <section class="mb-4">
      <v-container class="d-flex justify-space-between align-center pt-0">
        <h1 class="text-h4 font-weight-bold">{{ pageTitle }}</h1>
        <v-btn
            color="admin-primary"
            elevation="0"
            size="large"
            class="text-white"
            :to="{
              name: 'admin-page-create',
              params: { page: $route.params.page },
            }"
        >
          Создать
        </v-btn>
      </v-container>
    </section>
    <section v-if="!pageType.includes('index') && pageData && pageData.items">
      <v-container>
        <AdminTable
            :header="generateHeadersFromData(pageData?.items || [])"
            :items="pageData?.items || []"
            :total="pageData?.total"
            :page="currentPage"
            :items-per-page="itemsPerPage"
            @update:pagination="onPaginationUpdate"
            @toggle:active="updateActiveItem"
            @remove:select="removeSelectItem"
            @search="onSearch"
        />
      </v-container>
    </section>

    <AdminNotificationStack ref="notificationRef" />
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