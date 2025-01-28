<script setup lang="ts">
import { useStore } from "~/stores";
import { useI18n } from "vue-i18n";

const store = useStore()
const { locale } = useI18n()

watch(() => locale.value, (newLocale) => {
  store.updateStateLocale(newLocale);
}, { immediate: true });
</script>

<template>
  <v-app>
    <Header />
    <NuxtPage />
  </v-app>
</template>

<style scoped>

</style>