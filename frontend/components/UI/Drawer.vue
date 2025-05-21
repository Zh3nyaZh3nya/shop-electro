<script setup lang="ts">
const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

const drawer = computed({
  get: () => props.modelValue,
  set: (val: boolean) => emit('update:modelValue', val),
})
</script>

<template>
  <v-navigation-drawer
      v-model="drawer"
      :temporary="true"
      location="left"
      :style="[drawer ? '' : 'transform: translateX(-100%) !important']"
      style="height: 100vh; top: 0; width: 100%; z-index: 1010; "
      sticky
      class="scrollable-drawer"
  >
    <v-sheet width="100%" height="100%" color="grey-light-2" class="mb-16">
      <div class="d-flex justify-space-between align-center pa-3">
        <v-btn
            color="transparent"
            elevation="0"
            @click="drawer = !drawer"
            min-width="0"
            class="px-0"
        >
          <v-icon icon="mdi-chevron-left" size="32" color="grey" />
        </v-btn>
        <div>
          <p class="text-h6 text-secondary font-weight-medium">SHOP-AUDIO</p>
        </div>
        <div>
        </div>
      </div>
      <v-divider></v-divider>

      <slot></slot>
    </v-sheet>
  </v-navigation-drawer>
</template>

<style scoped lang="scss">

</style>