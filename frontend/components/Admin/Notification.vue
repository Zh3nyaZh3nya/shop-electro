<script setup lang="ts">
defineProps<{
  title: string
  message: string
  type: 'success' | 'error' | 'warning' | 'info'
}>()

defineEmits<{
  (e: 'close'): void
}>()
</script>

<template>
  <v-alert
      :type="type"
      :title="title"
      elevation="0"
      class="mb-2 border-card bg-admin-grey-dark-1 d-flex justify-space-between pb-4"
      rounded="lg"
      height="56px"
      min-height="56px"
      min-width="300px"
      closable
      variant="outlined"
  >
    <template #prepend>
      <div class="d-flex align-center ga-2">
        <v-icon
            icon="mdi-check-circle-outline"
            size="24px"
        />
        <p class="text-body-2 text-white">{{ title }}</p>
      </div>
    </template>
    <template #close>
      <div
        class="d-flex align-center cursor-pointer"
        @click="$emit('close')"
        style="padding-top: 1px"
      >
        <v-icon icon="mdi-close" size="20px" color="admin-grey-light-2">

        </v-icon>
      </div>
    </template>
    <template #title>
    </template>
  </v-alert>
</template>

