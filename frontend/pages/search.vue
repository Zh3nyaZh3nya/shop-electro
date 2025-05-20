<script setup lang="ts">
import { useAsyncData } from "#app";
import { useApi } from "~/composables/useApi";
import { pluralize } from "~/utils/pluralize";

const route = useRoute()

const crumbs: IBreadcrumbs[] = [
  {
    title: 'Главная',
    href: '/',
    disabled: false,
  },
  {
    title: 'Поиск',
    href: '/',
    disabled: true,
  }
]

const query = computed(() => route.query.q)

const { data: searchData, pending: searchDataPending } = await useAsyncData(
    `search-data-${query.value}`,
    async () => {
      const { data: dataFetch } = await useApi<{ data: IProductCard[] }>(
          `/catalog/search?search=${query.value}`
      )
      return dataFetch?.value?.data
    },
    {
      watch: [query]
    }
)
</script>

<template>
  <v-main>
    <template v-if="searchDataPending">
      <v-container class="py-16 text-center">
        <v-progress-circular indeterminate color="primary" size="48" />
      </v-container>
    </template>
    <template v-if="searchData && searchData.length">
      <section>
        <v-container>
          <UIBreadcrumbs :crumbs="crumbs" />
          <h1>
            По запросу
            <label class="text-primary">«{{ route.query.q }}»</label>
            найдено {{ searchData.length }}
            {{ pluralize(searchData.length, ['товар', 'товара', 'товаров']) }}
          </h1>
        </v-container>
      </section>
      <section>
        <v-container>
          <v-row>
            <v-col
                v-for="item in searchData"
                :key="item.id"
                cols="12"
                md="4"
                lg="3"
            >
              <UICardProduct :data="item" />
            </v-col>
          </v-row>
        </v-container>
      </section>
    </template>
    <template v-else>
      <section>
        <v-container>
          <h1>
            По запросу
            <label class="text-primary">«{{ route.query.q }}»</label>
            ничего не найдено. Попробуйте еще раз, воспользуйтесь каталогом или посмотрите наши новинки
          </h1>
        </v-container>
      </section>
    </template>
  </v-main>
</template>

<style scoped lang="scss">

</style>