<script setup lang="ts" generic="T extends object">
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Autoplay, EffectCreative, Navigation, Pagination } from 'swiper/modules'
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const {
  slides,
  perView = 4,
  mobilePerView = 1.1,
  overflowHidden = false,
  spaceBetween = 40,
  breakpoints
} = defineProps<{
  slides: T[]
  perView?: number
  mobilePerView?: number
  overflowHidden?: boolean
  spaceBetween?: number,
  breakpoints?: {
    [width: string]: {
      slidesPerView: number
      spaceBetween: number
    }
  }
}>()
</script>

<template>
  <client-only>
    <swiper
        :class="{ overflowHidden: overflowHidden }"
        :slides-per-view="mobilePerView"
        :modules="[Autoplay, EffectCreative, Navigation, Pagination]"
        :breakpoints="breakpoints ?? {
          '960': {
            slidesPerView: perView,
            spaceBetween: spaceBetween,
          },
          '1920': {
            slidesPerView: perView,
            spaceBetween: spaceBetween,
          },
        }"
        :direction="'horizontal'"
        :space-between="spaceBetween"
        :navigation="{
          nextEl: '.UI-Slider__swiper-nav-el-next',
          prevEl: '.UI-Slider__swiper-nav-el-prev',
        }"
        class="UI-Slider UI-Slider__swiper position-relative"
    >
      <swiper-slide
          v-for="(slide, index) in slides"
          :key="slide.id"
      >
        <slot :slide="slide" :index="index" />
      </swiper-slide>

      <v-container
          v-if="slides.length > perView"
          class="UI-Slider__swiper-nav-container d-flex"
      >
        <div class="UI-Slider__swiper-nav w-100">
          <div class="UI-Slider__swiper-nav-el-prev UI-Slider__swiper-nav-el">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="8"
                height="14"
                viewBox="0 0 8 14"
                fill="none"
            >
              <path
                  d="M1 1L7 7L1 13"
                  stroke="black"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
              />
            </svg>
          </div>
          <div class="UI-Slider__swiper-nav-el-next UI-Slider__swiper-nav-el">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="8"
                height="14"
                viewBox="0 0 8 14"
                fill="none"
            >
              <path
                  d="M1 1L7 7L1 13"
                  stroke="black"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
              />
            </svg>
          </div>
        </div>
      </v-container>
    </swiper>
  </client-only>
</template>

<style lang="scss">
.UI-Slider {
  position: relative;
  &:hover {
    .UI-Slider__swiper-nav {
      opacity: 1;
      visibility: visible;
    }
  }
  &__swiper {
    &.overflowHidden {
      @media (min-width: 960px) {
        overflow: hidden;
        border-radius: 16px;
      }
    }
    &-nav {
      position: relative;
      z-index: 5;
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 100%;
      pointer-events: none;
      opacity: 0;
      visibility: hidden;
      transition: opacity 0.3s ease, visibility 0.3s ease;
      &-container {
        position: absolute;
        top: 0;
        height: 100%;
        pointer-events: none;
      }
      &-el {
        pointer-events: auto;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #fff;
        border-radius: 50px;
        height: 48px;
        width: 48px;
        cursor: pointer;
        transition: background 0.3s;
        &-prev {
          transform: scale(-1, 1);
          left: 0px;
        }
        &-next {
          right: 0px;
        }
        &.swiper-button-disabled {
          cursor: not-allowed;
          opacity: 0.7;
        }
      }
    }

    .swiper-wrapper {
      box-sizing: border-box;
    }
  }
}
</style>