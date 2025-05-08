<script setup lang="ts">
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Navigation, EffectCreative, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/effect-creative'
import 'swiper/css/pagination';

const { slides } = defineProps<{
  slides: IBanner[] | IBannerOnlyImage[]
}>()
</script>

<template>
  <client-only>
    <swiper
        :loop="true"
        :slides-per-view="1"
        :direction="'horizontal'"
        class="banner position-relative"
        :pagination="{
          el: '.banner-pagination',
          clickable: true
        }"
        :effect="'creative'"
        :navigation="{
          nextEl: '.banner-nav-el-next',
          prevEl: '.banner-nav-el-prev',
        }"
        :modules="[Navigation, EffectCreative, Pagination]"
        :creative-effect="{
          prev: {
            shadow: false,
            translate: ['-20%', 0, -1],
          },
          next: {
            translate: ['100%', 0, 0],
          },
        }"
    >
      <swiper-slide
          v-for="(slide, index) in slides"
          :key="slide.id"
      >
        <div class="position-relative d-flex justify-center align-center">
          <template v-if="slide.video">
            <div class="banner-video-wrapper">
              <video
                  :src="slide.video"
                  muted
                  autoplay
                  playsinline
                  loop
                  class="banner-video"
              ></video>
            </div>
          </template>
          <template v-if="slide.image">
            <v-img
                :src="slide.image"
                aspect-ratio="16/9"
                class="banner-image"
                cover
            />
          </template>
          <v-container class="banner-container d-flex flex-column justify-center align-center text-center text-sm-start d-sm-block mt-8">
            <p class="text-h6 text-sm-h4 text-white text-uppercase lh-normal mb-2" style="max-width: 500px">{{ slide.title }}</p>
            <div v-html="slide.description" class="text-white text-body-1 text-sm-h6 lh-normal mb-4" style="max-width: 350px"></div>
            <v-btn
                v-if="slide.link"
                :to="slide.link"
                color="primary"
                elevation="0"
                size="large"
                class="text-body-2 font-weight-bold"
                rounded="lg"
            >
              {{ slide.link_text }}
            </v-btn>
          </v-container>
        </div>

      </swiper-slide>

      <v-container
          v-if="slides.length > 1"
          class="banner-nav-container d-none d-sm-flex justify-end mx-auto"
      >
        <div class="banner-nav d-flex align-center ga-3">
          <div class="banner-nav-el-prev banner-nav-el">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="12"
                height="16"
                viewBox="0 0 8 14"
                fill="none"
            >
              <path
                  d="M1 1L7 7L1 13"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
              />
            </svg>
          </div>
          <div class="banner-nav-el-next banner-nav-el">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="12"
                height="16"
                viewBox="0 0 8 14"
                fill="none"
            >
              <path
                  d="M1 1L7 7L1 13"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
              />
            </svg>
          </div>
        </div>
      </v-container>
      <div class="banner-pagination-container d-flex justify-center w-100 mb-6 d-sm-none">
        <div class="banner-pagination d-flex justify-center align-center ga-6" />
      </div>

    </swiper>
  </client-only>
</template>

<style lang="scss">
.banner {
  position: relative;
  &-video-wrapper {
    position: relative;
    width: 100%;
    overflow: hidden;
    height: 100%;
    aspect-ratio: 16/9;
    min-height: 322px;
    max-height: 500px;
    @media (min-width: 0px) {
      min-height: 400px;
    }
    @media (min-width: 767px) {
      min-height: 480px;
    }
  }
  &-video {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  &-image {
    width: 100%;
    height: 100%;
    max-height: 500px;
    min-height: 322px;
    @media (min-width: 0px) {
      min-height: 400px;
    }
    @media (min-width: 767px) {
      min-height: 480px;
    }
    @media (min-width: 900px) {
      min-height: 500px;
    }
  }
  &-container {
    position: absolute;
    margin: 0 auto;
    padding-left: 32px;
  }
  &-nav {
    position: absolute;
    bottom: 70px;
    z-index: 3;
    &-container {
      pointer-events: none;
      width: 100%;
    }
    &-el {
      border-radius: 50px;
      border: 2px solid #fff;
      color: white; // начальный цвет
      width: 48px;
      height: 48px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: border .3s, color .3s;
      pointer-events: auto;
      &:hover {
        border: 2px solid rgb(var(--v-theme-primary));
        color: rgb(var(--v-theme-primary));
      }
      &-prev {
        transform: scaleX(-1);
      }
    }
  }
  &-pagination {
    &-container {
      position: absolute;
      bottom: 0;
      z-index: 3;
    }
    .swiper-pagination-bullet {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      border: 1px solid rgb(var(--v-theme-grey));
      background: transparent;
      opacity: 1;
      position: relative;
      z-index: 1;

      &-active {
        background: rgb(var(--v-theme-grey));
        z-index: 2;

        &::after {
          content: "";
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 24px;
          height: 24px;
          border-radius: 50%;
          border: 2px solid rgb(var(--v-theme-primary));
          background: transparent;
          z-index: -1;
        }
      }
    }
  }
}
</style>