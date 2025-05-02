<script setup lang="ts">
interface TableItem {
  [key: string]: any
}

type SortItem = {
  key: string
  order?: 'asc' | 'desc'
}

const props = defineProps<{
  header: TableHeader[]
  items: TableItem[]
  total: number
  page: number
  itemsPerPage: number
}>()

const emit = defineEmits<{
  (e: 'update:pagination', value: {
    page: number
    itemsPerPage: number
    sortBy?: string
    sortDesc?: boolean
  }): void
  (e: 'toggle:active', value: { id: number; active: boolean }): void
}>()

const sortBy = ref<SortItem[]>([])
const sortDesc = ref(false)

const page = computed({
  get: () => props.page,
  set: (val) => emit('update:pagination', { page: val, itemsPerPage: props.itemsPerPage })
})

const itemsPerPage = computed({
  get: () => props.itemsPerPage,
  set: (val) => emit('update:pagination', { page: props.page, itemsPerPage: val })
})

watch(sortBy, () => {
  const sort = sortBy.value[0]
  emit('update:pagination', {
    page: props.page,
    itemsPerPage: props.itemsPerPage,
    sortBy: sort?.key,
    sortDesc: sort?.order === 'desc'
  })
})
</script>

<template>
  <v-data-table
      :headers="header"
      :items="items"
      v-model:items-per-page="itemsPerPage"
      v-model:sort-by="sortBy"
      class="bg-admin-grey-dark-1 rounded-lg admin-table"
      items-per-page-text="На страницу"
      no-data-text="Нет данных"
      dense
      sort-asc-icon="mdi-chevron-up"
      sort-desc-icon="mdi-chevron-down"
  >
    <template #item.active="{ item }">
      <div class="d-flex justify-center">
        <v-switch
            v-model="item.active"
            color="admin-primary"
            :hide-details="true"
            @update:model-value="value => emit('toggle:active', { id: item.id, active: value })"
        />
      </div>

    </template>
    <template #item.edit="{ item }">
      <nuxt-link
          class="d-flex align-center ga-2 justify-end text-admin-primary"
          :to="{
            name: 'admin-page-edit',
            params: { page: 'offers' },
            query: { id: item.id }
          }"
      >
        <v-icon icon="mdi-pencil-outline" />
        Изменить
      </nuxt-link>
    </template>
    <template #bottom>
      <v-divider class="mb-3"></v-divider>
      <v-container class="d-flex justify-space-between align-center py-2 pb-4 px-4">
        <div class="text-body-2">
          Показано с
          {{ (page - 1) * itemsPerPage + 1 }}
          по
          {{ Math.min(page * itemsPerPage, total) }}
          из {{ total }}
        </div>

        <div class="d-flex align-center select-items ga-4">
          <label class="text-body-2 label-select text-admin-grey-light-1">На страницу</label>
          <v-select
              v-model="itemsPerPage"
              :items="[5, 10, 20, 50, 100]"
              hide-details
              density="compact"
              variant="outlined"
              style="max-width: 90px"
              :focused="true"
          />
        </div>

        <div class="d-flex align-center ga-4">
          <v-pagination
              v-model="page"
              :length="Math.ceil(total / itemsPerPage)"
              color="admin-primary"
              density="comfortable"
              size="small"
              class="text-caption"
          />
        </div>
      </v-container>
    </template>
  </v-data-table>
</template>

<style lang="scss">
.admin-table {
  .v-switch__track {
    height: 26px;
    min-width: 46px;
  }
  .v-data-table-header__content {
    column-gap: 6px;
  }
  .v-pagination__last, .v-pagination__first {
    display: none;
  }

  .v-data-table__th--sortable {
    transition: color 0.3s ease;

    span {
      transition: color 0.3s ease;
    }
    .v-icon {
      transition: color 0.3s ease;
      opacity: 1 !important;
    }

    &:hover {
      color: rgb(var(--v-theme-admin-primary)) !important;
      span {
        color: rgb(var(--v-theme-admin-primary)) !important;
      }
      .v-icon {
        color: rgb(var(--v-theme-admin-primary)) !important;
      }
    }
  }
}
</style>
