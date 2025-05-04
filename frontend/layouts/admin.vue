<template>
  <v-app class="bg-admin-background admin-panel">
    <AdminHeader />
    <AdminDrawer />
    <v-main class="mt-2">
      <NuxtPage />
    </v-main>
    <AdminNotificationStack />
  </v-app>
</template>