<script setup lang="ts">
interface TableItem {
  [key: string]: any
}

const props = defineProps<{
  header: TableHeader[]
  items: TableItem[]
  total: number
  page: number
  itemsPerPage: number
}>()

const emit = defineEmits<{
  (e: 'update:pagination', value: { page: number; itemsPerPage: number }): void
  (e: 'toggle:active', value: { id: number; active: boolean }): void
}>()

const page = computed({
  get: () => props.page,
  set: (val) => emit('update:pagination', { page: val, itemsPerPage: props.itemsPerPage })
})

const itemsPerPage = computed({
  get: () => props.itemsPerPage,
  set: (val) => emit('update:pagination', { page: props.page, itemsPerPage: val })
})
</script>

<template>
  <v-data-table
      :headers="header"
      :items="items"
      v-model:page="page"
      v-model:items-per-page="itemsPerPage"
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

  </v-data-table>
</template>

<style lang="scss">
.admin-table {
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
