<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()

const props = defineProps<{
  submitLabel?: string
  cancelTo?: { name: string; params?: Record<string, any> }
}>()
</script>

<template>
  <div class="d-flex ga-3 align-center mt-4">
    <v-btn
        elevation="0"
        color="admin-primary"
        class="text-body-1 font-weight-bold text-white"
        rounded="lg"
        size="large"
        type="submit"
    >
      {{ submitLabel ?? 'Сохранить' }}
    </v-btn>
    <v-btn
        elevation="0"
        color="admin-grey-dark-1"
        class="text-body-1 font-weight-bold border-card"
        rounded="lg"
        size="large"
        :to="cancelTo ?? { name: 'admin-page', params: { page: route.params.page } }"
    >
      Отмена
    </v-btn>
  </div>
</template>
