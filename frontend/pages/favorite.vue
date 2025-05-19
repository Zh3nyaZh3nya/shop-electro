<script setup lang="ts">
const { favorites } = storeToRefs(useStore())

const crumbs: IBreadcrumbs[] = [
  {
    title: 'Главная',
    href: '/',
    disabled: false,
  },
  {
    title: 'Избранное',
    href: '/',
    disabled: true,
  }
]
</script>

<template>
  <v-main>
    <section>
      <v-container>
        <UIBreadcrumbs :crumbs="crumbs" />
      </v-container>
      <v-sheet color="grey-light-2" class="py-8">
        <v-container>
          <h1 class="text-h4 text-secondary font-weight-bold">Избранное</h1>
        </v-container>
      </v-sheet>
    </section>
    <section class="my-8" v-if="favorites.length">
      <v-container>
        <v-row>
          <v-col
              v-for="item in favorites"
              cols="12"
              md="4"
          >
            <UICardProduct
                :data="item"
            />
          </v-col>
        </v-row>
      </v-container>
    </section>
    <section v-else class="my-10">
      <v-container class="text-center">
        <p class="text-h6 lh-normal font-weight-bold text-secondary">Вы ещё не добавили в избранное ни одного товара.</p>
        <p class="text-h6 lh-normal font-weight-regular text-secondary">Вы можете выбрать подходящую технику в нашем каталоге.</p>
        <v-btn
            class="mt-4"
            to="/catalog"
            color="primary"
            rounded="lg"
            elevation="0"
            size="large"
        >
          Каталог товаров
        </v-btn>
      </v-container>
    </section>
  </v-main>
</template>

<style scoped lang="scss">

</style>