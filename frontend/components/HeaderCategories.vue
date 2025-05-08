<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useStore } from '~/stores/store'
import type { Ref } from "vue";

const store = useStore()
const { categories } = storeToRefs(store) as {
  categories: Ref<ICategory[]>
}

const activeCategory = ref<Required<ICategory> | null>(
    categories.value.length ? categories.value[0] : null
)
</script>

<template>
  <v-sheet color="white" class="d-flex" rounded="0">
    <v-card class="px-10 py-12" color="white" elevation="0" min-width="300px">
      <ul>
        <li
            v-for="category in categories"
            :key="category.id"
            class="w-100 py-4 text-body-2 font-weight-bold text-uppercase link-hover cursor-pointer"
            :class="{ 'text-primary': category.id === activeCategory?.id }"
            @mouseenter="activeCategory = category"
        >
          <nuxt-link :to="`/categories/${category.value}`">
            {{ category.label }}
          </nuxt-link>
        </li>
      </ul>
      <v-divider class="mt-4 mb-6"></v-divider>
      <div>
        <nuxt-link class="d-flex align-center ga-2 link-hover cursor-pointer text-caption text-black">
          <v-icon icon="mdi-truck-delivery-outline" color="light-primary" />
          Бесплатная доставка по Казахстану
        </nuxt-link>
      </div>
    </v-card>
    <v-card
        class="pa-12 d-flex flex-column justify-space-between align-stretch"
        elevation="0"
        color="grey-light"
        v-if="activeCategory?.subcategories?.length"
        max-width="650px"
        min-width="450px"
        width="100%"
    >
      <div>
        <ul>
          <li
              v-for="sub in activeCategory.subcategories"
              :key="sub.id"
              class="py-2 text-body-1 link-hover cursor-pointer"
          >
            <nuxt-link :to="`/categories/${sub.value}`" class="d-inline-block" style="max-width: 200px">
              {{ sub.label }}
            </nuxt-link>
          </li>
        </ul>
      </div>

      <nuxt-link class="position-relative">
        <v-img src="/category-image.webp" max-width="100%" height="130px" cover rounded="lg" />
        <div class="image-container">
          <p class="text-h6 text-uppercase lh-normal text-white mb-2">Весеннее<br/> обновление дома</p>
          <p class="text-white text-body-2">
            Скидки на технику до 50%
            <v-icon icon="mdi-chevron-right" />
          </p>
        </div>
      </nuxt-link>
    </v-card>
  </v-sheet>
</template>

<style scoped lang="scss">
.image-container {
  position: absolute;
  top: 15px;
  left: 15px;
}
</style>