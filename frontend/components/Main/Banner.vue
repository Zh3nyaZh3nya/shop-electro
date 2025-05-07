<script setup lang="ts">
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Navigation, Autoplay, EffectCreative } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/effect-creative'

const { slides } = defineProps<{
  slides: IBanner[]
}>()
</script>

<template>
  <client-only>
    <swiper
        :loop="true"
        :slides-per-view="1"
        :direction="'horizontal'"
        class="banner position-relative"
        :effect="'creative'"
        :navigation="{
          nextEl: '.banner-nav-el-next',
          prevEl: '.banner-nav-el-prev',
        }"
        :modules="[Navigation, EffectCreative]"
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
            <video
                :src="slide.video"
                muted
                autoplay
                playsinline
                loop
                style="width: 100%; height: 100%;"
            ></video>
          </template>
          <template v-if="slide.image">
            <v-img
                :src="slide.image"
                width="100%"
                height="100%"
            />
          </template>
          <v-container class="banner-container mt-8">
            <p class="text-h4 text-white text-uppercase lh-normal mb-2" style="max-width: 500px">{{ slide.title }}</p>
            <p class="text-white mb-2" :class="[index === 0 ? 'text-h4 font-weight-bold' : 'text-h6 font-weight-regular']">{{ slide.description }}</p>
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
          class="banner-nav-container d-flex justify-end"
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

    </swiper>
  </client-only>
</template>

<style lang="scss">
.banner {
  position: relative;
  &-container {
    position: absolute;
    left: 0;
  }
  &-nav {
    &-container {
      position: absolute;
      right: 0;
      bottom: 30px;
      z-index: 3;
      pointer-events: none;
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
}
</style>