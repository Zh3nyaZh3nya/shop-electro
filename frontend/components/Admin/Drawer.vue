<script setup lang="ts">
import { useAdminMenu } from "~/composables/useAdminMenu";

const { menu } = useAdminMenu()

const expandedPanelsMap = ref<Record<string, number[]>>({})

menu.forEach((item) => {
  if ('list' in item) {
    expandedPanelsMap.value[item.title] = [0]
  }
})
</script>

<template>
  <v-navigation-drawer
    color="admin-background"
    class="pl-4 pr-1 py-6 drawer-admin"
  >
    <ul>
      <li v-for="item in menu" :key="item.title">
        <template v-if="!('list' in item)">
          <nuxt-link
              :to="
                item.type.includes( 'index') ?
                '/admin' :
                {
                  name: 'admin-page',
                  params: { page: item.link },
                  query: {
                    type: item?.type || 'card',
                    title: item.title
                  }
                }"
              class="d-flex align-center ga-2 text-body-2 font-weight-bold mb-2"
              :class="[
                'd-flex align-center ga-2 text-body-2 font-weight-bold mb-2',
                (
                  $route.path === '/admin' && item.type.includes('index') ||
                  $route.path === '/admin/' + item.link ||
                  $route.path.startsWith('/admin/' + item.link + '/')
                ) ? 'text-admin-primary router-link-active' : ''
              ]"
          >
            <v-icon
                :icon="item.icon"
                :color="(
                  $route.path === '/admin' && item.type.includes('index') ||
                  $route.path === '/admin/' + item.link ||
                  $route.path.startsWith('/admin/' + item.link + '/')
                ) ? 'admin-primary' : 'admin-grey-light-1'"
                size="24px"
            />

            <span>{{ item.title }}</span>
          </nuxt-link>

        </template>
        <template v-else>
          <v-expansion-panels
              class="bg-transparent my-6"
              multiple
              elevation="0"
              v-model="expandedPanelsMap[item.title]"
          >
            <v-expansion-panel class="bg-transparent">
              <v-expansion-panel-title min-width="0" min-height="0" class="px-2 py-2 text-admin-grey-light-1">
                <span class="text-body-2 font-weight-bold">{{ item.title }}</span>
              </v-expansion-panel-title>

              <v-expansion-panel-text class="px-0">
                <nuxt-link
                    v-for="link in item.list"
                    :key="link.title"
                    :to="
                      link.type.includes('index') ?
                      '/admin' :
                      {
                        name: 'admin-page',
                        params: { page: link.link },
                        query: {
                          type: link?.type || 'card',
                          title: link.title
                        }
                      }"
                    class="d-flex align-center ga-2 text-body-2 font-weight-bold mb-2"
                    :class="[
                      'd-flex align-center ga-2 text-body-2 font-weight-bold mb-2',
                      (
                        $route.path === '/admin' && link.type.includes('index') ||
                        $route.path === '/admin/' + link.link ||
                        $route.path.startsWith('/admin/' + link.link + '/')
                      ) ? 'text-admin-primary router-link-active' : ''
                    ]"
                >
                  <v-icon
                      :icon="link.icon"
                      :color="(
                        $route.path === '/admin' && link.type.includes('index') ||
                        $route.path === '/admin/' + link.link ||
                        $route.path.startsWith('/admin/' + link.link + '/')
                      ) ? 'admin-primary' : 'admin-grey-light-1'"
                      size="24px"
                  />
                  <p>
                    {{ link.title }}
                  </p>
                </nuxt-link>

              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>
        </template>
      </li>
    </ul>
  </v-navigation-drawer>
</template>

<style lang="scss">
.drawer-admin {
  a {
    padding: 8px;
    border-radius: 8px;
  }
  a:hover {
    background-color: hsl(0deg 0% 100% / 5%);
  }
  .router-link-active {
    background-color: hsl(0deg 0% 100% / 5%);
  }
  .v-expansion-panel-text__wrapper {
    padding: 4px 0px;
  }
}

</style>