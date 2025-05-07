<script setup lang="ts">
const catalogOpen = ref<boolean>()
</script>

<template>
  <v-bottom-navigation grow class="d-flex align-center" height="66" tag="aside" style="z-index: 1010">
    <v-btn to="/" class="mobile-menu-btn">
      <div class="d-flex flex-column align-center text-grey bg-transparent link-hover">
        <v-icon icon="mdi-home" size="32" :class="{ 'text-primary': $route.path === '/' }" />
        <span :class="{ 'text-primary': $route.path === '/' }">Главная</span>
      </div>
    </v-btn>

    <v-btn min-width="0" height="100%" class="mobile-menu-btn" @click="catalogOpen = !catalogOpen">
      <div class="d-flex flex-column align-center text-grey link-hover">
        <v-icon icon="mdi-text-search" size="32" :class="{ 'text-primary': catalogOpen }" />
        <span :class="{ 'text-primary': catalogOpen }">Каталог</span>
      </div>
    </v-btn>

    <v-btn to="/" class="mobile-menu-btn">
      <div class="d-flex flex-column align-center text-grey link-hover">
        <v-icon icon="mdi-cart" size="32" :class="{ 'text-primary': catalogOpen }" />
        <span :class="{ 'text-primary': catalogOpen }">0 ₸</span>
      </div>
    </v-btn>
  </v-bottom-navigation>
  <v-navigation-drawer
      v-model="catalogOpen"
      v-if="catalogOpen"
      location="left"
      width="100%"
      style="height: 100%; top: 0; z-index: 1009"
      sticky
  >
    <v-card width="100%">
      <v-list-item title="Каталог" subtitle="Выберите категорию" />
      <v-divider />
      <v-list-item link title="Холодильники" />
      <v-list-item link title="Телевизоры" />
      <v-list-item link title="Стиральные машины" />
    </v-card>
  </v-navigation-drawer>
</template>

<style lang="scss">
.mobile-menu {
  &-btn {
    .v-btn__overlay {
      background: transparent !important;
    }
  }
}
</style>