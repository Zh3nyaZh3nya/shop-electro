<script setup lang="ts">

const store = useStore()
</script>

<template>
  <v-main class="main">
    <section class="main__top mb-5 mb-md-15">
      <v-container>
        <MainTopBlocks :cards="store.GET_MAIN_BLOCKS" />
      </v-container>
    </section>
    <section class="main__offers">
      <v-container>
        <MainOffers :cards="store.GET_MAIN_CATEGORY" />
      </v-container>
    </section>
    <section class="main__products">
      <v-container>

      </v-container>
    </section>
  </v-main>
</template>

<style scoped>

</style>