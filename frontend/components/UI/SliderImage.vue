<script setup lang="ts">
import { ref } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Navigation, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'

const { images, is_main } = defineProps<{
  images: string[]
  is_main?: boolean
}>()

const swiperRef = ref<any>(null)
const swiperInstance = ref<any>(null)
const activeIndex = ref(0)

function scrollTo(index: number) {
  if (swiperInstance.value) {
    swiperInstance.value.slideTo(index)
  }
}
</script>

<template>
  <div class="card-swiper-wrapper position-relative w-100">
    <swiper
        ref="swiperRef"
        :slides-per-view="1"
        :space-between="0"
        :modules="[Navigation, Pagination]"
        :speed="500"
        grab-cursor
        pagination
        :allow-touch-move="false"
        :simulate-touch="false"
        :mousewheel="false"
        class="card-swiper-images w-100"
        @swiper="swiperInstance = $event"
        @slideChange="activeIndex = swiperInstance.activeIndex"
    >
      <swiper-slide
          v-for="(slide, index) in images"
          :key="slide"
          class="custom-slide d-block w-100"
      >
        <v-img
          :src="slide"
          :height="is_main ? '180px' : '200px'"
          width="100%"
        />
      </swiper-slide>
    </swiper>

    <div class="card-swiper-images-pagination" v-if="images.length > 1">
      <div
          v-for="(slide, index) in images"
          :key="'pag-' + index"
          class="pagination-item-wrapper cursor-default"
          @mouseenter="scrollTo(index)"
      >
        <div
            class="pagination-item"
            :class="{ active: activeIndex === index }"
        >
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.card-swiper-wrapper {
  max-width: 100%;

  .card-swiper-images {
    position: relative;
  }
  .swiper-pagination {
    display: none !important;
  }
  .card-swiper-images-pagination {
    display: flex;
    justify-content: center;
    align-items: flex-end;
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 2;
    height: 100%;

    .pagination-item-wrapper {
      display: flex;
      align-items: flex-end;
      justify-content: center;
      cursor: pointer;
      height: 100%;
      width: 20px;
      margin-bottom: -15px;
    }

    .pagination-item {
      background: rgb(var(--v-theme-grey));
      width: 4px;
      height: 4px;
      border-radius: 50%;
      transition: all 0.2s ease;
      margin-bottom: 1px;
      &.active {
        width: 6px;
        height: 6px;
        background: rgb(var(--v-theme-primary));
        margin-bottom: 0px;
      }
    }
  }
}
</style>
