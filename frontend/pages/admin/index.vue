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

definePageMeta({
  layout: 'admin',
})
</script>

<template>
  <section>
    <v-container>
      <h1 class="text-h4 font-weight-medium mb-4">Инфопанель</h1>

      <v-row>
        <v-col cols="6">
          <v-card
              rounded="lg"
              class="bg-admin-grey-dark-1 border-card py-6 px-8"
          >
            <div class="d-flex justify-space-between align-center">
              <div class="d-flex align-center ga-3">
                <div class="pa-4 bg-black rounded-pill d-flex align-center justify-center" style="width: 40px; height: 40px;">A</div>
                <div>
                  <p class="text-body-1" style="line-height: normal">Добро пожаловать</p>
                  <p class="text-subtitle-2 text-admin-grey-light-1" style="line-height: normal">Admin</p>
                </div>
              </div>
              <div>
                <v-btn
                  class="border-card"
                  color="admin-grey-dark-1"
                  elevation="0"
                  rounded="lg"
                  size="large"
                  @click="logout"
                >
                  <div class="d-flex align-center ga-2">
                    <v-icon icon="mdi-exit-to-app" class="rotate-left" color="admin-grey"></v-icon>
                    <p class="text-body-2 font-weight-bold" style="margin-top: 2px">Выход</p>
                  </div>
                </v-btn>
              </div>
            </div>
          </v-card>
        </v-col>
      </v-row>

    </v-container>
  </section>
</template>

<style scoped>

</style>