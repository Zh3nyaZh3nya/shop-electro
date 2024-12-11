<script setup lang="ts">
import { ref } from "vue"
import { useI18n } from 'vue-i18n'
import { useRouter, useRoute } from 'vue-router'
import { useLocalePath } from "#i18n"

interface IMenu {
  title: string,
  link: string
}

const { locale, locales, t } = useI18n()
const localePath = useLocalePath()
const router = useRouter()
const route = useRoute()

const menu = ref<IMenu[]>([
  {
    title: 'menu_title_1',
    link: '/',
  },
  {
    title: 'menu_title_2',
    link: '/',
  },
  {
    title: 'menu_title_3',
    link: '/',
  },
  {
    title: 'menu_title_4',
    link: '/',
  },
  {
    title: 'menu_title_5',
    link: '/',
  },
])
const cities = ref<string[]>([t('almaty'), t('astana')])
const city = ref<string>(t('almaty'))

watch(() => locale.value, () => {
  const path = localePath(route.path)
  router.push(path)
})
</script>

<template>
  <v-app-bar color="white" class="py-2 header" elevation="0" height="208">
    <v-container class="header-top">
      <v-row>
        <v-col cols="12" md="3" class="d-flex align-center text-body-2">
          <v-select
            v-model="locale"
            :items="locales"
            item-title="name"
            item-value="code"
            variant="solo"
            max-width="90px"
            :hide-details="true"
            class="select-lang"
        ></v-select>
          <v-select
              v-model="city"
              :items="cities"
              variant="solo"
              class="select-cities"
              max-width="150px"
              :hide-details="true"
              prepend-inner-icon="mdi-map-marker-outline"
              menu-icon="mdi-chevron-down"

          >
          </v-select>
        </v-col>
        <v-col cols="12" md="6" class="d-flex align-center">
          <ul class="d-flex align-center ga-6 text-body-2">
            <li v-for="item in menu" :key="item.title">
              <nuxt-link :to="localePath(item.link)">{{ $t(item.title) }}</nuxt-link>
            </li>
          </ul>
        </v-col>
        <v-col cols="12" md="3" class="d-flex align-center justify-end text-body-2">
          <a type="number" class="cursor-pointer">8 (707) 916 92 50 (с 10:00 до 22:00)</a>
        </v-col>
      </v-row>

    </v-container>
    <v-container class="header-bot">
      <v-row>
        <v-col cols="12" md="3">
          <v-card rounded="lg" height="64" class="pa-4 d-flex justify-space-between align-center" elevation="0" color="primary">
            <v-img src="/img.png" max-width="56" cover />
            <v-btn variant="outlined" class="bg-primary text-none text-body-1 d-flex align-center">
              {{ $t('catalog') }}
              <v-icon icon="mdi-chevron-down" style="margin-top: 2px" size="18"></v-icon>
            </v-btn>
          </v-card>
        </v-col>
        <v-col cols="12" md="9" class="d-flex align-center justify-end">
          <div class="d-flex ga-4">
            <v-btn class="text-caption custom-hover-btn" height="60" stacked>
              <v-icon icon="mdi-heart-outline" class="mb-1"></v-icon>
              {{ $t('favourite') }}
            </v-btn>
            <v-btn class="text-caption custom-hover-btn" height="60" stacked>
              <v-icon icon="mdi-cart-variant" class="mb-1"></v-icon>
              {{ $t('cart') }}
            </v-btn>
            <v-btn class="text-caption custom-hover-btn" height="60" stacked>
              <v-icon icon="mdi-account-circle-outline" class="mb-1"></v-icon>
              {{ $t('enter') }}
            </v-btn>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </v-app-bar>
</template>

<style lang="scss">
.header {
  .v-toolbar__content {
    display: flex;
    flex-direction: column;
    height: 100% !important;
  }
  .v-field--variant-solo, .v-field--variant-solo-filled {
    box-shadow: none;
  }
  .v-select__selection-text {
    font-size: 14px !important;
    text-align: center;
  }
  .v-field__input {
    display: flex;
    justify-content: end;
  }
  .select-lang, .select-cities {
    .v-field {
      background: transparent;
    }
  }
}
.custom-hover-btn:hover {
  background: rgb(var(--v-theme-primary));
  color: #fff;
}
</style>