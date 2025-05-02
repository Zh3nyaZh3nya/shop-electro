<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useAsyncData } from "#app";
import { useApi } from "~/composables/useApi";

const route = useRoute()
const { getByPage } = useAdminMenu()

const pageConfig = computed(() => getByPage(route.params.page as string))
const pageTitle = computed(() => pageConfig.value?.title ?? 'Без названия')
const pageType = computed(() => pageConfig.value?.type ?? 'card')

const currentPage = ref(1)
const itemsPerPage = ref(10)
const sortBy = ref<string | undefined>(undefined)
const sortDesc = ref<boolean>(false)

function generateHeadersFromData(items: any[]): TableHeader[] {
  if (!items.length || typeof items[0] !== 'object') return []

  const baseHeaders: TableHeader[] = Object.keys(items[0]).map((key) => ({
    title: key.charAt(0).toUpperCase() + key.slice(1),
    key,
    align: 'center',
    sortable: key !== 'active'
  }))

  return baseHeaders.concat([
    {
      title: '',
      key: 'edit',
      sortable: false,
      align: 'end'
    }
  ])
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
        },
        credentials: 'include',
      })

      return dataFetch.value
    },
)

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
    <section class="mb-4">
      <v-container class="d-flex justify-space-between align-center">
        <h1 class="text-h4 font-weight-bold">{{ pageTitle }}</h1>
        <v-btn
            color="admin-primary"
            elevation="0"
            size="large"
            class="text-white"
        >
          Создать
        </v-btn>
      </v-container>

    </section>
    <section v-if="(pageType === 'card' || pageType === 'card-color') && pageData && pageData.items">
      <v-container>
        <AdminTable
            :header="generateHeadersFromData(pageData?.items || [])"
            :items="pageData?.items || []"
            :total="pageData?.total"
            :page="currentPage"
            :items-per-page="itemsPerPage"
            @update:pagination="onPaginationUpdate"
            @toggle:active="updateActiveItem"
        />
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