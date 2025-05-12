<script setup lang="ts">
const { data, is_main } = defineProps<{
  data: IProductCard,
  is_main: boolean
}>()
</script>

<template>
  <v-card
    elevation="1"
    rounded="lg"
  >
    <UISliderImage
      :images="data.preview_images"
    />
  </v-card>
</template>

<style scoped>

</style>