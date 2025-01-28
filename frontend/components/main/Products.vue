<script setup lang="ts">
import type { IProduct } from "~/types";

interface IProps {
  cards: IProduct[]
}

const props = defineProps<IProps>()
</script>

<template>
  <v-card
    rounded="lg"
    elevation="2"
    class="main__products-card"
    v-for="card in cards"
    :key="card.id"
  >

  </v-card>
</template>

<style scoped>

</style>