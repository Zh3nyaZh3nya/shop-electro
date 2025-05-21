<script setup lang="ts">
import { ref } from "vue"
import { useDisplay } from "vuetify";

const { mdAndUp } = useDisplay()
const { favorites, cart } = storeToRefs(useStore())
const route = useRoute()

const { cities } = defineProps<{
  cities: Cities[]
}>()

const selectCity = ref<Cities>(cities[0])
const isScrolledPastBanner = ref(false)
const menu: IMenu[] = [
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
]
const rule = computed(() => {
  const path = route.path.replace(/\/$/, '')
  const isHome = path === ''
  const isTelevizoryMain = path === '/televizory' || (route.params.category === 'televizory' && !route.params.slug)
  const isSupport = path === '/terms/support'

  return isHome || isTelevizoryMain || isSupport
})


function changeCity(value: Cities) {
  selectCity.value = value
}

const handleScroll = () => {
  isScrolledPastBanner.value = window.scrollY > 1
}

onMounted(() => {
  handleScroll()
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <v-app-bar
      color="white"
      class="header d-flex flex-column"
      elevation="0"
      :height="mdAndUp ? !isScrolledPastBanner ? 154 : 76 : 80"
      :class="[
         (!isScrolledPastBanner ? 'bg-transparent' : 'bg-white')
      ]"
      style="z-index: 1009"
  >
    <v-container :class="!isScrolledPastBanner ? 'pb-0' : ''">
      <v-row>
        <v-col cols="12" class="d-flex align-center justify-space-between" v-if="!isScrolledPastBanner">
          <div class="d-flex align-center ga-4" :class="{ 'w-100': !mdAndUp }">
            <nuxt-link to="/">
              <v-img
                  :src="rule
                    ? (!isScrolledPastBanner ? '/logo-white.png' : '/logo.png')
                    : '/logo.png'"
                  width="60px"
                  height="100%"
                  cover
                  class="logo"
              />
            </nuxt-link>
            <v-menu :close-on-content-click="false" offset="88">
              <template #activator="{ props }">
                <v-btn
                    class="bg-dark-primary"
                    size="large"
                    rounded="lg"
                    v-if="mdAndUp"
                    v-bind="props"
                >
                  <div class="d-flex align-center ga-2 text-body-1 text-uppercase">
                    <v-icon icon="mdi-format-list-bulleted" />
                    <p>Каталог</p>
                  </div>
                </v-btn>
              </template>

              <HeaderCategories />
            </v-menu>
            <HeaderSearch />
          </div>
          <div class="d-flex align-center ga-4" v-if="mdAndUp">
            <div v-if="cities && cities.length">
              <v-menu>
                <template #activator="{ props }">
                  <v-btn
                      v-bind="props"
                      variant="text"
                  >
                    <div class="d-flex align-center text-caption text-light-primary ga-1 font-weight-medium">
                      <v-icon icon="mdi-map-marker-outline" size="14px"/>
                      <p>{{ selectCity.label || 'Алматы' }}</p>
                    </div>
                  </v-btn>
                </template>
                <v-card
                    rounded="lg"
                    color="white"
                    class="pa-4"
                >
                  <p class="text-body-1 font-weight-bold mb-2">
                    Выберите город
                  </p>
                  <p v-for="city in cities" :key="city.id" @click="changeCity(city)" class="cursor-pointer link-hover text-body-1 mb-1">
                    {{ city.label }}
                  </p>
                </v-card>
              </v-menu>
            </div>
            <v-divider
                :vertical="true"
                :color="rule ? 'white' : 'black'"
                :thickness="2"
            />
            <div>
              <nuxt-link
                  to="/terms/payment-and-delivery"
                  class="d-flex align-center ga-2 link-hover cursor-pointer text-caption"
                  :class="rule ? 'text-white' : 'text-black'"
              >
                <v-icon icon="mdi-truck-delivery-outline" />
                Бесплатная доставка по Казахстану
              </nuxt-link>
            </div>
            <v-divider
                :vertical="true"
                :color="rule ? 'white' : 'black'"
                :thickness="2"
            />
            <div>
              <a
                  href="tel:87079169250"
                  class="link-hover text-caption font-weight-bold"
                  :class="rule ? 'text-white' : 'text-black'"
              >
                8 (707) 916 92 50
              </a>
            </div>
          </div>
        </v-col>
        <v-col cols="12" class="d-flex align-center justify-space-between" v-if="mdAndUp">
          <div class="d-flex align-center ga-4">
            <div class="d-flex align-center ga-4" :class="{ 'w-100': !mdAndUp }" v-if="isScrolledPastBanner">
              <nuxt-link to="/">
                <v-img
                    :src="!isScrolledPastBanner ? '/logo-white.png' : `/logo.png`"
                    width="60px"
                    height="100%"
                    cover
                    class="logo"
                />
              </nuxt-link>
              <v-menu :close-on-content-click="false" offset="18">
                <template #activator="{ props }">
                  <v-btn
                      class="bg-dark-primary"
                      size="large"
                      rounded="lg"
                      v-if="mdAndUp"
                      v-bind="props"
                  >
                    <div class="d-flex align-center ga-2 text-body-1 text-uppercase">
                      <v-icon icon="mdi-format-list-bulleted" />
                      <p>Каталог</p>
                    </div>
                  </v-btn>
                </template>

                <HeaderCategories />
              </v-menu>

            </div>
            <div
              v-for="item in menu"
              :key="item.title"
            >
              <v-menu :close-on-content-click="false" :offset="28">
                <template #activator="{ props, isActive }">
                  <div
                      v-bind="props"
                      class="text-body-2 text-uppercase link-hover d-flex align-center ga-1 header-link"
                      :class="[
                          isActive ? 'text-primary header-link-menu-active' :
                          rule ? !isScrolledPastBanner ? 'text-white' : 'text-black' : 'text-black'
                      ]"
                  >
                    <p>{{ item.title }}</p>
                    <v-icon icon="mdi-chevron-down" size="18px" />
                  </div>
                </template>
                <v-card
                    class="pa-4 d-flex flex-column ga-3"
                    rounded="lg"
                >
                  <nuxt-link
                      v-for="link in item.menu"
                      :key="link.link"
                      :to="link.link"
                      class="link-hover text-body-2 text-uppercase cursor-pointer"
                  >
                    {{ link.title }}
                  </nuxt-link>
                </v-card>
              </v-menu>
            </div>
          </div>
          <div class="d-flex align-center ga-4">
            <div>
              <nuxt-link to="/favorite" class="header-favorite link-hover cursor-pointer">
                <v-icon
                    icon="mdi-heart"
                    size="32px"
                    :color="rule ? !isScrolledPastBanner ? 'grey' : 'grey' : 'grey'"
                />
                <div class="header-favorite-count-bg">
                  <p class="header-favorite-count text-caption">{{ favorites.length }}</p>
                </div>
              </nuxt-link>
            </div>
            <div>
              <v-btn
                class="bg-primary"
                size="large"
                rounded="lg"
                to="/cart"
              >
                <div class="d-flex align-center ga-2">
                  <v-icon icon="mdi-cart" size="24px" />
                  <p class="text-body-2">
                    {{
                      cart.reduce((acc, i: IProductCard) => {
                        return acc += i.price
                      }, 0).toLocaleString('ru-RU')
                    }} ₸
                  </p>
                </div>
              </v-btn>
            </div>
          </div>

        </v-col>
        <v-col cols="12" class="d-flex align-center justify-space-between" v-if="!mdAndUp && isScrolledPastBanner">
          <div class="d-flex align-center ga-4" :class="{ 'w-100': !mdAndUp }">
            <nuxt-link to="/">
              <v-img
                  :src="!isScrolledPastBanner ? '/logo-white.png' : `/logo.png`"
                  width="60px"
                  height="100%"
                  cover
                  class="logo"
              />
            </nuxt-link>
            <HeaderSearch />
          </div>
        </v-col>
      </v-row>
      <v-divider
          :color="rule ? !isScrolledPastBanner ? 'white' : 'black' : 'black'"
          class="mt-4"
          v-if="!isScrolledPastBanner"
      />
    </v-container>
  </v-app-bar>
</template>

<style lang="scss">
.header {
  transition: height 0.3s ease, background-color 0.3s ease;
  &-link {
    .v-icon {
      transition: transform 0.3s ease;
    }

    &-menu-active {
      .v-icon {
        transform: rotate(180deg);
      }
    }
  }
  .text-field-header {
    color: #fff;
    .v-field__overlay {
      background: #1b1d22;
    }
  }
  &-favorite, &-favorite-cart {
    position: relative;
    z-index: 1;
    &-count-bg {
      position: absolute;
      right: 1px;
      bottom: -7px;
      z-index: 2;
      background: transparent;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    &-count {
      background: rgb(var(--v-theme-primary));
      color: #fff;
      border-radius: 50px;
      width: 18px;
      height: 18px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
}
</style>