<script setup lang="ts">
import { ref, } from "vue";
import { Swiper, SwiperSlide } from "swiper/vue";
import { Thumbs, } from 'swiper/modules'
import "swiper/css";
import "swiper/css/thumbs";

const { images } = defineProps<{
  images: string[]
}>();

const thumbsSwiper = ref(null);
const setThumbsSwiper = (swiper) => {
  thumbsSwiper.value = swiper;
};
</script>

<template>
  <client-only>
    <div class="gallery-wrapper d-flex flex-row-reverse">
      <Swiper
          :modules="[Thumbs]"
          :thumbs="{ swiper: thumbsSwiper }"
          space-between="10"
          class="main-swiper bg-grey-light-2 rounded-lg position-relative w-100"
      >
        <SwiperSlide v-for="(img, i) in images" :key="img" class="d-flex justify-center align-center py-2">
          <div class="mx-2 w-100">
            <v-img
                :src="img"
                max-height="340px"
                max-width="442px"
                width="100%"
                class="rounded-lg"
                cover
            />
          </div>
        </SwiperSlide>
      </Swiper>

      <Swiper
          space-between="15"
          :slides-per-view="5.4"
          watch-slides-progress
          :modules="[Thumbs]"
          @swiper="setThumbsSwiper"
          class="thumbs-swiper mr-4 w-100 position-relative "
          direction="vertical"
      >
        <SwiperSlide v-for="(img, i) in images" :key="img" class="w-100">
          <v-img
              :src="img"
              class="thumb-image bg-grey-light-2"
              width="100%"
              height="100%"
              cover
          />
        </SwiperSlide>

      </Swiper>
    </div>
  </client-only>
</template>

<style lang="scss">
.gallery-wrapper {
  .thumbs-swiper {
    height: 340px;
    max-width: 60px;
    z-index: 1;
    .thumb-image {
      cursor: pointer;
      overflow: visible;
    }
    &-nav {
      height: 100%;
      pointer-events: none;
      overflow: visible;
      &-container {
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        pointer-events: none;
      }
    }
    .swiper-button {
      &-prev {
        position: absolute;
        top: 7px;
        transform: rotate(90deg) ;
        z-index: 5;
        left: 25%;
        pointer-events: auto;
      }
      &-next {
        position: absolute;
        top: 98%;
        z-index: 5;
        pointer-events: auto;
        transform: rotate(90deg) ;
        left: 25%;
      }
      &-prev:after, &-next:after {
        content: '' !important;
      }
    }

  }

}
</style>
