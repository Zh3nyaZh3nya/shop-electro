<script setup lang="ts">
import { useLocalePath } from "#i18n";
import type {ICategory} from "~/types";

const localePath = useLocalePath()

interface IProps {
  cards: ICategory[]
}

const props = defineProps<IProps>()
</script>

<template>
  <v-row class="main__offer-row">
    <v-col
        v-for="block in cards"
        :key="block.id"
        cols="12"
        sm="6"
        md="3"
    >
      <h3 class="text-h5 mb-2">{{ $t(block.category) }}</h3>
      <div class="d-flex">
<!--        <div class="main__offer-image bg-white rounded-lg elevation-1 pa-4">-->
<!--          <v-img :src="block.image" width="78" height="78"  />-->
<!--        </div>-->
        <div class="d-flex flex-column" >
          <nuxt-link
              v-for="link in block.sub_categories"
              :key="link"
              :to="localePath(`/catalog/${link}`)"
              class="d-block"
          >
            <span class="text-caption">{{ $t(`subcategory.${link}`) }}</span>
          </nuxt-link>
        </div>
      </div>
    </v-col>
  </v-row>
</template>

<style scoped>

</style>