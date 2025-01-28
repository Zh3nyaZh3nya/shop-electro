<script setup lang="ts">
import { Swiper, SwiperSlide } from 'swiper/vue';
import 'swiper/css';
import type { ITopBlock } from "~/types";

interface IProps {
  cards: ITopBlock[]
}

const props = defineProps<IProps>()
</script>

<template>
  <v-row class="main__top__blocks-card">
    <v-col cols="12" md="3">
      <v-card rounded="lg" class="main__top__blocks-card-first d-flex flex-column justify-space-between pa-4" elevation="0" height="206">
        <div>
          <h2 class="mb-1 text-h5 text-secondary">{{ $t('cabinet') }}</h2>
          <h3 class="text-caption text-grey">{{ $t('main_block_1')}}</h3>
        </div>
        <div class="d-flex ga-4">
          <v-btn class="main__top__blocks-card-first-btn text-body-2" rounded="lg" elevation="0">{{ $t('enter') }}</v-btn>
          <v-btn class="main__top__blocks-card-first-btn text-body-2" rounded="lg" elevation="0">{{ $t('my_orders')}}</v-btn>
        </div>
      </v-card>
    </v-col>
    <v-col cols="12" md="9">
      <swiper
          slides-per-view="4.4"
          direction="horizontal"
          space-between="20"
          :style="{ 'height': '206px' }"
      >
        <swiper-slide
            v-for="card in cards"
            :key="card.id"
        >
          <v-card
              rounded="lg"
              :color="card.background"
              class="main__top__blocks-card pa-4"
              elevation="0"
              height="174"
              :to="card.link"
          >
            <h2 class="mb-1 text-h6 text-secondary">{{ card.title }}</h2>
            <h3 class="text-caption text-secondary">{{ card.subtitle }}</h3>
          </v-card>
        </swiper-slide>
      </swiper>
    </v-col>
  </v-row>
</template>

<style lang="scss">
.main__top__blocks-card {
  &-first {
    background: #fff7da url('/main/background-top-1.webp') no-repeat bottom right;
    &-btn {
      border: 1px solid #d9d9d9;
    }
  }
}
</style>