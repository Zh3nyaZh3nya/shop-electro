<script setup lang="ts">
import { ref } from "vue"
import { useLocalePath } from "#i18n"

const localePath = useLocalePath()

const menu = ref([
  {
    title: 'menu_title_1',
    link: '/search/resume',
  },
  {
    title: 'menu_title_2',
    link: '/search/vacancy',
  },
  {
    title: '',
    link: '',
  },
])
</script>

<template>
  <v-toolbar color="transparent" class="py-2">
    <v-container>

    </v-container>
  </v-toolbar>
</template>

<style scoped>

</style>