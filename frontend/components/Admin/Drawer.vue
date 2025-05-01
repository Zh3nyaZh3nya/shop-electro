<script setup lang="ts">
const menu: {
  title: string
  icon?: string
  link?: string
  list?: {
    title: string
    icon: string
    link: string
  }[]
}[] = [
  {
    icon: 'mdi-home-outline',
    title: 'Инфопанель',
    link: '/admin/',
  },
  {
    title: 'Главная страница',
    list: [
      {
        title: 'Предложения',
        icon: 'mdi-offer',
        link: '/admin/offers'
      }
    ]
  },
]

const expandedPanels = ref(
    menu.map((item, index) => item.list ? index : null).filter(i => i !== null)
)
</script>

<template>
  <v-navigation-drawer
    color="admin-background"
    class="px-4 py-6 drawer-admin"
  >
    <ul>
      <li v-for="item in menu" :key="item.link">
        <template v-if="!item.list">
          <nuxt-link
              :to="item.link"
              class="d-flex align-center ga-2 text-body-2 font-weight-bold mb-2"
              exact-active-class="text-admin-primary"
          >
            <v-icon :icon="item.icon" :color="$route.path === item.link ? 'admin-primary' : 'admin-grey-light-1'" size="24px" />
            <span>{{ item.title }}</span>
          </nuxt-link>

        </template>
        <template v-else>
          <v-expansion-panels class="bg-transparent my-6" v-model="expandedPanels[0]" multiple>
            <v-expansion-panel class="bg-transparent">
              <v-expansion-panel-title min-width="0" min-height="0" class="px-2 py-2 text-admin-grey-light-1">
                <span class="text-body-1 ">{{ item.title }}</span>
              </v-expansion-panel-title>

              <v-expansion-panel-text class="px-0">
                <nuxt-link
                    v-for="link in item.list"
                    :key="link.title"
                    :to="link.link"
                    class="d-flex align-center ga-2 text-body-2 font-weight-bold"
                    exact-active-class="text-admin-primary"
                >
                  <v-icon
                      :icon="link.icon"
                      :color="$route.path === link.link ? 'admin-primary' : 'admin-grey-light-1'"
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