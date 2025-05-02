<script setup lang="ts">
const { crumbs } = defineProps<{
  crumbs: {
    title: string
    disabled: boolean
    href: string
  }[]
}>()
</script>


<template>
  <v-breadcrumbs
      :items="crumbs"
      class="px-0 py-3 font-weight-medium ga-1 custom-breadcrumbs"
  >
    <template #divider>
      <v-icon>mdi-chevron-right</v-icon>
    </template>
    <template v-slot:item="{ item }">
      <NuxtLink
          :to="'/admin/'+item.href"
          :class="[{ 'pointer-events-none cursor-default': item.disabled }, { 'custom-breadcrumbs-text': !item.disabled, }]"
          class="text-decoration-none text-admin-grey"
      >
        {{ item.title }}
      </NuxtLink>
    </template>
  </v-breadcrumbs>
</template>

<style lang="scss">
.custom-breadcrumbs {
  display: flex;
  flex-wrap: wrap;
  &-text {
    transition: color .3s;
    &:hover {
      color: #fff !important;
    }
  }
  .v-breadcrumbs-divider {
    color: rgb(var(--v-theme-admin-grey));
    padding: 0;
    margin-bottom: 2px;
  }
}
</style>