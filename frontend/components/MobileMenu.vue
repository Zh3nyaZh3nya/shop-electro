<script setup lang="ts">
import { storeToRefs } from "pinia";
import { Ref } from "vue";

const store = useStore()

const catalogOpen = ref<boolean>()
const catalogSubcategoriesOpen = ref<boolean>()
const selectCategory = ref(null)

const { categories } = storeToRefs(store) as {
  categories: Ref<ICategory[]>
}
</script>

<template>
  <v-bottom-navigation grow class="d-flex align-center" height="66" tag="aside" style="z-index: 1011">
    <v-btn to="/" class="mobile-menu-btn">
      <div class="d-flex flex-column align-center text-grey bg-transparent link-hover">
        <v-icon icon="mdi-home" size="32" :class="{ 'text-primary': $route.path === '/' }" />
        <span :class="{ 'text-primary': $route.path === '/' }">Главная</span>
      </div>
    </v-btn>

    <v-btn min-width="0" height="100%" class="mobile-menu-btn" @click="() => {catalogOpen = !catalogOpen; if(catalogSubcategoriesOpen) catalogSubcategoriesOpen = false}">
      <div class="d-flex flex-column align-center text-grey link-hover">
        <v-icon icon="mdi-text-search" size="32" :class="{ 'text-primary': catalogOpen }" />
        <span :class="{ 'text-primary': catalogOpen }">Каталог</span>
      </div>
    </v-btn>

    <v-btn to="/cart" class="mobile-menu-btn">
      <div class="d-flex flex-column align-center text-grey link-hover">
        <v-icon icon="mdi-cart" size="32" :class="{ 'text-primary': $route.path.includes('/cart') }" />
        <span :class="{ 'text-primary': $route.path.includes('/cart') }">Корзина</span>
      </div>
    </v-btn>

  </v-bottom-navigation>
  <v-navigation-drawer
      v-model="catalogOpen"
      :temporary="true"
      location="left"
      :style="[catalogOpen ? '' : 'transform: translateX(-100%) !important']"
      style="height: 100vh; top: 0; width: 100%; z-index: 1010; "
      sticky
      class="scrollable-drawer"
  >
    <v-sheet width="100%" color="grey-light-2" class="mb-16">
      <div class="d-flex justify-space-between align-center pa-3">
        <v-btn
            color="transparent"
            elevation="0"
            @click="catalogOpen = !catalogOpen"
            min-width="0"
            class="px-0"
        >
          <v-icon icon="mdi-chevron-left" size="32" color="grey" />
        </v-btn>
        <div>
          <p class="text-h6 text-secondary font-weight-medium">SHOP-AUDIO</p>
        </div>
        <div>
        </div>
      </div>
      <v-divider></v-divider>
      <div v-if="categories">
        <v-container>
          <p class="text-body-1 text-uppercase text-secondary mb-4">Каталог</p>
          <v-row>
            <v-col
                v-for="category in categories"
                :key="category.id"
                cols="6"
            >
              <v-card
                  rounded="lg"
                  color="white"
                  class="pa-4 h-100 link-hover cursor-pointer"
                  @click="() => { catalogSubcategoriesOpen = !catalogSubcategoriesOpen; selectCategory = category }"
              >
                <v-img :src="category.image" class="mb-4" />
                <div class="d-flex justify-center text-center">
                  <p class="lh-normal text-body-1">
                    {{ category?.label }}
                    <v-icon icon="mdi-chevron-right" size="18" />
                  </p>
                </div>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </div>
    </v-sheet>
  </v-navigation-drawer>
  <v-navigation-drawer
      v-model="catalogSubcategoriesOpen"
      :temporary="true"
      location="left"
      :style="[catalogSubcategoriesOpen ? '' : 'transform: translateX(-100%) !important']"
      style="height: 100vh; top: 0; width: 100%; z-index: 1010"
      sticky
      class="scrollable-drawer"
      color="grey-light-2"
  >
    <v-sheet width="100%" color="grey-light-2" class="mb-16">
      <div class="d-flex justify-space-between align-center pa-3">
        <v-btn
            color="transparent"
            elevation="0"
            @click="catalogSubcategoriesOpen = !catalogSubcategoriesOpen"
            min-width="0"
            class="px-0"
        >
          <v-icon icon="mdi-chevron-left" size="32" color="grey" />
        </v-btn>
        <div>
          <p class="text-h6 text-secondary font-weight-medium">SHOP-AUDIO</p>
        </div>
        <div>
        </div>
      </div>
      <v-divider></v-divider>
      <div v-if="selectCategory">
        <v-container>
          <p class="text-body-1 text-uppercase text-secondary mb-4">{{ selectCategory.label }}</p>
          <v-row>
            <v-col
                v-for="category in selectCategory.subcategories"
                :key="category.id"
                cols="6"
            >
              <v-card
                  rounded="lg"
                  color="white"
                  width="100%"
                  class="pa-4 h-100 link-hover cursor-pointer d-flex align-center justify-center"
                  :to="`/catalog/${selectCategory.value}/${category.value}`"
                  @click="() => {catalogSubcategoriesOpen = !catalogSubcategoriesOpen; catalogOpen = !catalogOpen}"
              >
                <div class="d-flex justify-center align-center text-center">
                  <p class="lh-normal text-body-1 d-flex align-center ga-1">
                    <label >{{ category?.label }}</label>
                    <v-icon icon="mdi-chevron-right" size="20" />
                  </p>
                </div>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </div>
    </v-sheet>
  </v-navigation-drawer>
</template>

<style lang="scss">
.scrollable-drawer {
  overflow-y: auto;
}
.mobile-menu {
  &-btn {
    .v-btn__overlay {
      background: transparent !important;
    }
  }
}
</style>