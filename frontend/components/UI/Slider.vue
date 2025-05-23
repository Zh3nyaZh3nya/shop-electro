<script setup lang="ts">
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Autoplay, EffectCreative, Navigation, Pagination } from 'swiper/modules'
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const {
  slides,
  perView = 1,
  mobilePerView = 1.1,
  overflowHidden = false,
  spaceBetween = 40,
  breakpoints,
  loop,
  pagination,
  sliderId = 'default'
} = defineProps<{
  slides:
      IBannerOnlyImage[] |
      IProductCard[] |
      IBanner[] |
      ICategory[] |
      ICategory['subcategories']
  perView?: number
  mobilePerView?: number
  overflowHidden?: boolean
  spaceBetween?: number,
  loop?: boolean
  pagination?: boolean
  breakpoints?: {
    [width: string]: {
      slidesPerView: number
      spaceBetween: number
    }
  }
  sliderId?: number | string
}>()
</script>

<template>
  <client-only>
    <swiper
        :class="{ overflowHidden: overflowHidden }"
        :slides-per-view="mobilePerView"
        :modules="[Autoplay, EffectCreative, Navigation, Pagination]"
        :pagination="pagination ? {
          el: `.custom-swiper-pagination-${sliderId}`,
          clickable: true,
          renderBullet: (index, className) => {
            const total = slides.length + (loop ? 1 : 0)
            if (index >= total) return ''
            return `<span class='${className}'></span>`
          }
        } : false"
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
        :loop="loop"
        :navigation="{
          nextEl: `.swiper-button-next-${sliderId}`,
          prevEl: `.swiper-button-prev-${sliderId}`,
        }"
        :creative-effect="{
          prev: {
            opacity: 0.3,
          },
          next: {
            translate: ['100%', 0, 0],
          },
        }"
        class="UI-Slider UI-Slider__swiper position-relative w-100"
        :touch-start-prevent-default="false"
        :touch-start-force-prevent-default="false"
        :touch-ratio=".5"
    >
      <swiper-slide
          v-for="(slide, index) in slides"
          :key="slide?.slug"
          class="h-auto d-flex"
      >
        <slot :slide="slide" :index="index" />
      </swiper-slide>

      <v-container
          v-if="slides.length > perView"
          class="UI-Slider__swiper-nav-container d-flex"
      >
        <div class="UI-Slider__swiper-nav w-100">
          <div :class="`swiper-button-prev-${sliderId} UI-Slider__swiper-nav-el UI-Slider__swiper-nav-el-prev`">
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
          <div :class="`swiper-button-next-${sliderId} UI-Slider__swiper-nav-el UI-Slider__swiper-nav-el-next`">
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

      <div :class="`custom-swiper-pagination-${sliderId} custom-swiper-pagination d-flex justify-center mt-4`" />
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
  .custom-swiper-pagination {
    display: flex;
    align-items: center;
    .swiper-pagination-bullet {
      background: transparent;
      border: 1px solid rgb(var(--v-theme-grey));
      opacity: 1;
      &-active {
        background: rgb(var(--v-theme-primary));
        width: 10px;
        height: 10px;
        border: 1px solid transparent;
      }
    }
  }

}
</style>