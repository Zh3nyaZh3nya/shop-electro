<script setup lang="ts">
import { ref } from "vue"
import { useI18n } from "vue-i18n";
import { useLocalePath } from "#i18n";

const { t } = useI18n()
const localePath = useLocalePath()

const blocks = ref([
  {
    id: 1,
    title: t('offer_title_1'),
    image: '/main/offer-1.png',
    links: [
      {
        id: 1,
        title: t('offer_link_1'),
        link: ''
      }
    ]
  },
  {
    id: 2,
    title: t('offer_title_2'),
    image: '/main/offer-2.png',
    links: [
      {
        id: 1,
        title: t('offer_link_2'),
        link: ''
      }
    ]
  },
  {
    id: 3,
    title: t('offer_title_3'),
    image: '/main/offer-3.png',
    links: [
      {
        id: 1,
        title: t('offer_link_3'),
        link: ''
      }
    ]
  },
  {
    id: 4,
    title: t('offer_title_4'),
    image: '/main/offer-4.png',
    links: [
      {
        id: 1,
        title: t('offer_link_4'),
        link: ''
      }
    ]
  },
])
</script>

<template>
  <v-row class="main__offer-row">
    <v-col
        v-for="block in blocks"
        :key="block.id"
        cols="12"
        sm="6"
        md="3"
    >
      <h3 class="text-h5 mb-2">{{ block.title }}</h3>
      <div class="d-flex">
        <div class="main__offer-image bg-white rounded-lg elevation-1 pa-4">
          <v-img :src="block.image" width="78" height="78"  />
        </div>
        <div class="d-flex flex-column ml-2" v-for="link in block.links" :key="link.id" >
          <nuxt-link :to="localePath(`/catalog/${link.link}`)">
            <span class="text-caption">{{ link.title }}</span>
          </nuxt-link>
        </div>
      </div>
    </v-col>
  </v-row>
</template>

<style scoped>

</style>