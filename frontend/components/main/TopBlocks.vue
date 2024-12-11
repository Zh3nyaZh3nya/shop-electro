<script setup lang="ts">
import { ref } from "vue"
import { Swiper, SwiperSlide } from 'swiper/vue';
import { useI18n } from "vue-i18n";
import 'swiper/css';

const { t } = useI18n()

const blocks = ref([
  {
    id: 1,
    title: t('main_block_title_1'),
    subtitle: t('main_block_subtitle_1'),
    background: '#e0d2ff',
  },
  {
    id: 2,
    title: t('main_block_title_2'),
    subtitle: t('main_block_subtitle_2'),
    background: '#ffd0d0',
  },
  {
    id: 3,
    title: t('main_block_title_3'),
    subtitle: t('main_block_subtitle_3'),
    background: '#cdeaff',
  },
  {
    id: 4,
    title: t('main_block_title_4'),
    subtitle: t('main_block_subtitle_4'),
    background: '#e0d2ff',
  },
  {
    id: 5,
    title: t('main_block_title_5'),
    subtitle: t('main_block_subtitle_5'),
    background: '#ffd0d0',
  },
  {
    id: 6,
    title: t('main_block_title_6'),
    subtitle: t('main_block_subtitle_6'),
    background: '#cdeaff',
  },
  {
    id: 7,
    title: t('main_block_title_7'),
    subtitle: t('main_block_subtitle_7'),
    background: '#ffd0d0',
  },
])
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
          slides-per-view="5.4"
          direction="horizontal"
          space-between="20"
          :style="{ 'height': '206px' }"
      >
        <swiper-slide
            v-for="block in blocks"
            :key="block.id"
        >
          <v-card rounded="lg" :color="block.background" class="main__top__blocks-card pa-4" elevation="0" height="174">
            <h2 class="mb-1 text-h5 text-secondary">{{ block.title }}</h2>
            <h3 class="text-caption text-secondary">{{ block.subtitle }}</h3>
          </v-card>
        </swiper-slide>
      </swiper>
    </v-col>
  </v-row>
</template>

<style lang="scss">
.main-top__blocks-card {
  &-first {
    background: #fff7da url('/main/background-top-1.webp') no-repeat bottom right;
    &-btn {
      border: 1px solid #d9d9d9;
    }
  }
}
</style>