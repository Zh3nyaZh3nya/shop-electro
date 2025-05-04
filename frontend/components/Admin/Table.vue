<script setup lang="ts">
import { pluralize } from "~/utils/pluralize";
// @ts-ignore
import debounce from "lodash-es/debounce"

interface TableItem {
  [key: string]: any
}

type SortItem = {
  key: string
  order?: 'asc' | 'desc'
}

const { header, items, total, page, itemsPerPage} = defineProps<{
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
  (e: 'remove:select', value: { id: number } | { id: number }[]): void
  (e: 'search', value: string): void
}>()

const sortBy = ref<SortItem[]>([])
const selected = ref<number[]>([])
const search = ref<string>('')

const pages = computed({
  get: () => page,
  set: (val) => emit('update:pagination', { page: val, itemsPerPage: itemsPerPage })
})

const itemsPerPages = computed({
  get: () => itemsPerPage,
  set: (val) => emit('update:pagination', { page: page, itemsPerPage: val })
})

const isSelected = (id: number) => selected.value.includes(id)

const toggleSelect = (id: number) => {
  if (isSelected(id)) {
    selected.value = selected.value.filter((itemId) => itemId !== id)
  } else {
    selected.value.push(id)
  }
}

const selectAll = () => {
  const allIds = items.map((item) => item.id)
  selected.value = allIds
}

const clearAll = () => {
  selected.value = []
}

const toggleAll = () => {
  const allIds = items.map((item) => item.id)
  const allSelected = allIds.every(id => selected.value.includes(id))
  selected.value = allSelected ? [] : allIds
}

const toggleSelectAll = () => {
  const allIds = items.map((item) => item.id)
  const allSelected = allIds.every((id) => selected.value.includes(id))
  selected.value = allSelected ? [] : allIds
}
const getRowClass = (item: TableItem) => {
  return selected.value.includes(item.id) ? 'row-selected' : ''
}

const removeSelect = () => {
  emit('remove:select', selected.value.map(id => ({ id })))

  selected.value = []
}

watch(sortBy, () => {
  const sort = sortBy.value[0]
  emit('update:pagination', {
    page: page,
    itemsPerPage: itemsPerPage,
    sortBy: sort?.key,
    sortDesc: sort?.order === 'desc'
  })
})

watch(search, debounce(() => emit('search', search.value), 300))
</script>

<template>
  <v-pagination
      v-show="false"
      :length="4"
      color="admin-primary"
      size="small"
  />
  <div class="bg-admin-grey-dark-1 px-4 pt-4 rounded-t-lg admin-table-search-panel">
    <div class="d-flex align-center" :class="[selected.length ? 'justify-space-between' : 'justify-end']">
      <v-menu :close-on-content-click="false" content-class="table-select-menu" offset="10px" v-if="selected.length">
        <template v-slot:activator="{ props }">
          <div
              class="d-flex align-center ga-2 border-card pa-2 rounded-lg bg-admin-grey-dark-2 cursor-pointer "
              v-bind="props"
          >
            <v-icon icon="mdi-format-list-bulleted" />
            <p>Открыть действия</p>
          </div>
        </template>
        <v-card color="admin-grey-dark-2" elevation="0" class="py-3" rounded="lg">
          <div class="px-2 d-flex align-center ga-2 cursor-pointer text-admin-error" @click="removeSelect">
            <v-icon icon="mdi-trash-can-outline" size="20px" />
            <p class="text-body-2">Удалить отмеченное</p>
          </div>
        </v-card>
      </v-menu>
      <v-text-field
        v-model="search"
        max-width="245px"
        variant="outlined"
        class="text-field-admin"
        color="primary"
        prepend-inner-icon="mdi-magnify"
      />
    </div>
  </div>
  <div
      v-show="selected.length"
      class="bg-admin-grey-dark-1 pa-4 admin-table-show-panel"
  >
    <div class="d-flex align-center justify-space-between">
      <p>
        {{ pluralize(selected.length, ['Выбрана', 'Выбрано', 'Выбрано']) }}
        {{ selected.length }}
        {{ pluralize(selected.length, ['запись', 'записи', 'записей']) }}
      </p>
      <v-btn
          color="admin-primary"
          class=""
          variant="text"
          @click="toggleAll"
      >
        {{ selected.length === items.length ? 'Снять выделение' : 'Выбрать все' }}
      </v-btn>
    </div>
  </div>
  <v-data-table
      :headers="header"
      :items="items"
      :item-class="getRowClass"
      v-model:items-per-page="itemsPerPages"
      v-model:sort-by="sortBy"
      class="bg-admin-grey-dark-1 admin-table rounded-b-lg "
      items-per-page-text="На страницу"
      no-data-text="Нет данных"
      dense
      sort-asc-icon="mdi-chevron-up"
      sort-desc-icon="mdi-chevron-down"
  >
    <template #header.select>
      <v-checkbox
          :model-value="items.length && items.every(i => selected.includes(i.id))"
          :indeterminate="selected.length > 0 && selected.length < items.length"
          @update:model-value="() => toggleSelectAll()"
          color="admin-primary"
          hide-details
      />
    </template>
    <template v-slot:item="{ item, props: rowProps }">
      <tr v-bind="rowProps" :class="[ selected.includes(item.id) ? 'row-selected' :  'row' ]">
        <td class="v-data-table__td v-data-table-column--align-center">
          <v-checkbox
              :model-value="selected.includes(item.id)"
              @update:model-value="() => toggleSelect(item.id)"
              color="admin-primary"
              hide-details
          />
        </td>

        <td
            v-for="column in header.filter(h => h.key !== 'select' && h.key !== 'edit')"
            :key="column.key"
            class="v-data-table__td v-data-table-column--align-center"
        >
          <template v-if="column.key === 'description'">
            <div v-if="item?.description">
              {{
                item.description.replace(/<[^>]*>/g, '').slice(0, 30)
              }}
              <span v-if="item.description.replace(/<[^>]*>/g, '').length > 30">...</span>
            </div>
          </template>
          <template v-else-if="column.key === 'active'">
            <div class="d-flex justify-center">
              <v-switch
                  v-model="item.active"
                  color="admin-primary"
                  :hide-details="true"
                  @update:model-value="value => emit('toggle:active', { id: item.id, active: value })"
              />
            </div>
          </template>
          <template v-else>
            {{ item[column.key] }}
          </template>
        </td>

        <td class="v-data-table__td v-data-table-column--align-end">
          <nuxt-link
              class="d-flex align-center ga-2 justify-end text-admin-primary"
              :to="{
                name: 'admin-page-edit',
                params: { page: $route.params.page },
                query: { id: item.id, ...$route.query }
              }"
          >
            <v-icon icon="mdi-pencil-outline" />
            Изменить
          </nuxt-link>
        </td>
      </tr>
    </template>
    <template #bottom>
      <v-divider class="mb-3"></v-divider>
      <v-container class="d-flex justify-space-between align-center py-2 pb-4 px-4">
        <div class="text-body-2">
          Показано с
          {{ (pages - 1) * itemsPerPages + 1 }}
          по
          {{ Math.min(pages * itemsPerPages, total) }}
          из {{ total }}
        </div>

        <div class="d-flex align-center select-items ga-4">
          <label class="text-body-2 label-select text-admin-grey-light-1">На страницу</label>
          <v-select
              v-model="itemsPerPages"
              :items="[5, 10, 20, 50, 100]"
              hide-details
              density="compact"
              variant="outlined"
              style="max-width: 90px"
              :focused="true"
              :menu-props="{ contentClass: 'table-select-menu', closeOnContentClick: false, offset: '15px' }"

          />
        </div>

        <div class="align-center ga-4" :class="total > 1 ? 'd-flex' : 'd-none'">
          <v-pagination
              v-model="pages"
              :length="Math.ceil(total / itemsPerPages)"
              size="small"
              :total-visible="6"
          />
        </div>
      </v-container>
    </template>
  </v-data-table>
</template>

<style lang="scss">
.admin-table {
  border: 1px solid rgb(var(--v-theme-admin-grey-light-2));
  &-show-panel {
    border-left: 1px solid rgb(var(--v-theme-admin-grey-light-2));
    border-right: 1px solid rgb(var(--v-theme-admin-grey-light-2));
  }
  &-search-panel {
    border: 1px solid rgb(var(--v-theme-admin-grey-light-2));
    border-bottom: none;
  }
  thead {
    tr {
      background: rgb(var(--v-theme-admin-grey-dark-2));
      th:first-child {
        border-left: 2px solid transparent;
      }
    }
  }
  .row {
    td:first-child {
      border-left: 2px solid transparent;
    }
    &:hover {
      background: rgb(var(--v-theme-admin-grey-dark-2));
    }
  }
  .row-selected {
    background: rgb(var(--v-theme-admin-grey-dark-2));
    td:first-child {
      border-left: 2px solid rgb(var(--v-theme-admin-primary));
    }
  }
}

.table-select-menu {
  .v-list {
    background: rgb(var(--v-theme-admin-grey-dark-1)) !important;
    box-shadow: none !important;
    color: #fff !important;
    padding: 0px !important;
    border: 1px solid rgb(var(--v-theme-admin-grey-light-2)) !important;
    .v-list-item {
      border-bottom: 1px solid rgb(var(--v-theme-admin-grey-light-2)) !important;
    }
  }
}
</style>
