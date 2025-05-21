<script setup lang="ts">
import { storeToRefs } from "pinia";
import { Ref } from "vue";

const store = useStore()

const { categories } = storeToRefs(store) as {
  categories: Ref<ICategory[]>
}

const { cities } = defineProps<{
  cities: Cities[]
}>()

const catalogOpen = ref<boolean>(false)
const catalogSubcategoriesOpen = ref<boolean>(false)
const selectCategory = ref(null)
const isCatalogActive = ref<boolean>(false)
const menu = ref<boolean>(false)
const menuSub = ref<boolean>(false)
const selectItemMenu = ref<IMenu['menu']>([])
const menuData: IMenu[] = [
  {
    title: 'Покупателям',
    menu: [
      {
        title: 'Оплата и доставка',
        link: '/terms/payment-and-delivery'
      },
      {
        title: 'Сервис и поддержка',
        link: '/terms/support'
      },
      {
        title: 'Гарантия',
        link: '/terms/warranty'
      },
      {
        title: 'Контакты',
        link: '/terms/contacts'
      },
    ]
  },
  {
    title: 'Магазины',
    menu: [
      {
        title: 'Все акции',
        link: '/content/promo'
      },
      {
        title: 'Поврежденная упаковка',
        link: ''
      },
    ]
  },
  {
    title: 'Избранное',
    link: '/favorite'
  },
  {
    title: 'Контакты',
    link: '/terms/contacts'
  }
]

function handleCatalogToggle() {
  catalogOpen.value = !catalogOpen.value
  if (catalogSubcategoriesOpen.value) catalogSubcategoriesOpen.value = false
}

watch(catalogOpen, (val) => {
  if (!val) {
    isCatalogActive.value = false
  } else {
    nextTick(() => {
      isCatalogActive.value = true
    })
  }
})
</script>

<template>
  <v-bottom-navigation grow class="d-flex align-center" height="66" tag="aside" style="z-index: 1011">
    <v-btn to="/" class="mobile-menu-btn">
      <div class="d-flex flex-column align-center text-grey bg-transparent link-hover">
        <v-icon icon="mdi-home" size="32" :class="{ 'text-primary': $route.path === '/' }" />
        <span :class="{ 'text-primary': $route.path === '/' }">Главная</span>
      </div>
    </v-btn>

    <v-btn min-width="0" height="100%" class="mobile-menu-btn" @click="handleCatalogToggle">
      <div class="d-flex flex-column align-center text-grey link-hover">
        <v-icon icon="mdi-text-search" size="32" :class="{ 'text-primary': isCatalogActive }" />
        <span :class="{ 'text-primary': isCatalogActive }">Каталог</span>
      </div>
    </v-btn>

    <v-btn to="/cart" class="mobile-menu-btn">
      <div class="d-flex flex-column align-center text-grey link-hover">
        <v-icon icon="mdi-cart" size="32" :class="{ 'text-primary': $route.path.includes('/cart') }" />
        <span :class="{ 'text-primary': $route.path.includes('/cart') }">Корзина</span>
      </div>
    </v-btn>

    <v-btn @click="menu = !menu" class="mobile-menu-btn">
      <div class="d-flex flex-column align-center text-grey link-hover">
        <v-icon icon="mdi-menu" size="32" :class="{ 'text-primary': menu }" />
        <span :class="{ 'text-primary': menu }">Меню</span>
      </div>
    </v-btn>

  </v-bottom-navigation>
  <!-- каталог -->
  <UIDrawer v-model="catalogOpen">
    <template #default>
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
                  @click="() => { catalogSubcategoriesOpen = true; selectCategory = category }"
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
    </template>
  </UIDrawer>
  <!-- подкаталог -->
  <UIDrawer v-model="catalogSubcategoriesOpen">
    <template #default>
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
                  @click="() => { catalogSubcategoriesOpen = false; catalogOpen = false }"
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
    </template>
  </UIDrawer>
  <!-- меню  -->
  <UIDrawer v-model="menu">
    <template #default>
      <v-container>
        <ul>
          <li
              v-for="item in menuData"
              :key="item.title"
              class="text-body-1 font-weight-medium text-uppercase mb-2"
          >
            <div class="d-flex flex-column" v-if="item.menu" @click="() => { menuSub = true; selectItemMenu = item }">
              <div class="d-flex justify-space-between align-center">
                <p>{{ item.title }}</p>
                <v-icon icon="mdi-chevron-right" size="20" color="grey" />
              </div>
            </div>
            <nuxt-link :to="item.link" v-else @click="menu = false">{{ item.title }}</nuxt-link>
            <v-divider class="my-1 mt-2"></v-divider>
          </li>
        </ul>
      </v-container>
    </template>
  </UIDrawer>
  <!-- подменю  -->
  <UIDrawer v-model="menuSub">
    <template #default>
      <v-container>
        <ul>
          <li
              v-for="item in selectItemMenu.menu"
              :key="item.title"
              class="text-body-1 font-weight-medium text-uppercase mb-2"
          >
            <nuxt-link :to="item.link" @click="() => {menu = false; menuSub = false}">{{ item.title }}</nuxt-link>
            <v-divider class="my-1 mt-2"></v-divider>
          </li>
        </ul>
      </v-container>
    </template>
  </UIDrawer>
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