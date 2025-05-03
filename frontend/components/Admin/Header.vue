<script setup lang="ts">
import { useApi } from "~/composables/useApi";

async function logout() {
  try {
    const { status } = await useApi('/admin/logout', { method: 'POST' })

    if(status.value === 'success') {
      navigateTo('/admin/login')
    }
  } catch (e) {
    console.log(e)
  }
}
</script>

<template>
  <v-app-bar color="admin-grey-dark-1" elevation="0">
    <div class="d-flex justify-space-between align-center w-100 px-7">
      <div>
        <nuxt-link to="/admin" class="text-h6 font-weight-bold">
          Shop Audio
        </nuxt-link>
      </div>
      <div>
        <v-menu :offset="10" width="200px">
          <template v-slot:activator="{ props }">
            <v-btn
                color="primary"
                v-bind="props"
                class="bg-black"
                rounded="pill"
                min-width="0"
                width="32px"
                height="32px"
            >
              A
            </v-btn>
          </template>
          <v-card
            rounded="lg"
            class="bg-admin-grey-dark-1 border-card"
          >
            <div class="pa-2 d-flex align-center ga-2">
              <v-icon icon="mdi-account-circle" color="admin-grey" />
              <span class="text-body-2">Admin</span>
            </div>
            <v-divider></v-divider>
            <div class="pa-2 d-flex align-center ga-2 cursor-pointer" @click="logout">
              <v-icon icon="mdi-exit-to-app" color="admin-grey" class="rotate-left" />
              <span class="text-body-2">Выйти</span>
            </div>
          </v-card>
        </v-menu>
      </div>
    </div>
  </v-app-bar>
</template>

<style scoped>

</style>