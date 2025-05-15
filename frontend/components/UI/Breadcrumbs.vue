<script setup lang="ts">
interface IProps {
  crumbs: IBreadcrumbs[]
}

const props = defineProps<IProps>()
</script>

<template>
  <v-breadcrumbs
      :items="crumbs"
      class="px-0 py-3 ga-1 custom-breadcrumbs pt-0"
  >
    <template #divider>
      <svg
          class="h-breadcrumbs__arrow"
          width="6"
          height="8"
          viewBox="0 0 6 8"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
      >
        <path
            d="M1.82812 1.17139L4.47978 3.82304C4.57741 3.92067 4.57741 4.07896 4.47978 4.17659L1.82812 6.82824"
            stroke-width="2"
            stroke-linecap="round"
        />
      </svg>
    </template>
    <template v-slot:item="{ item }">
      <NuxtLink
          :to="item.href"
          :class="[{ 'pointer-events-none text-disabled cursor-default': item.disabled }, { 'cursor-pointer text-black': !item.disabled, }]"
          class="text-decoration-none custom-breadcrumbs-text text-body-2"
      >
        {{ item.title }}
      </NuxtLink>
    </template>
  </v-breadcrumbs>
</template>

<style scoped lang="scss">
.custom-breadcrumbs {
  display: flex;
  flex-wrap: wrap;
  &-text {
    transition: color .3s;
  }
  &-text:hover {
    color: rgb(var(--v-theme-primary)) !important;
  }
}
</style>