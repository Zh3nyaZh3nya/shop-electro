<script setup lang="ts">
import { Swiper, SwiperSlide } from 'swiper/vue';

const { slides } = defineProps<{
  slides: {

  }
}>()
</script>

<template>
  <swiper>
    <swiper-slide
      v-for="slide in slides"
      :key="slide"
    >

    </swiper-slide>
  </swiper>
</template>

<style scoped>

</style>