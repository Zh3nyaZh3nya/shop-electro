<script setup lang="ts">
const props = defineProps<{
  title: string
  isEdit: boolean
}>()

const emit = defineEmits<{
  (e: 'remove'): void
}>()
</script>

<template>
  <div class="d-flex justify-space-between align-center mb-6">
    <h1 class="text-h4 font-weight-bold">
      {{ isEdit ? 'Редактирование' : 'Создание' }}
      <template v-if="isEdit">
        {{ title }}
      </template>
    </h1>
    <v-btn
        v-if="isEdit"
        color="admin-error"
        rounded="lg"
        size="large"
        class="text-body-1 font-weight-bold"
        elevation="0"
        @click="emit('remove')"
    >
      Удалить
    </v-btn>
  </div>
</template>
