<script setup lang="ts">
import { useNotificationStore } from '~/stores/notifications'

const store = useNotificationStore()
</script>

<template>
  <div class="notification-stack">
    <transition-group name="slide-fade" tag="div">
      <AdminNotification
          v-for="note in store.list"
          :key="note.id"
          v-bind="note"
          @close="store.remove(note.id)"
      />
    </transition-group>
  </div>
</template>

<style scoped>
.notification-stack {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
  max-width: 400px;
}

.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease;
}
.slide-fade-enter-from {
  opacity: 0;
  transform: translateY(-20px);
}
.slide-fade-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>
