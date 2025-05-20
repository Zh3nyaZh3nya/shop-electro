<script setup lang="ts">
const banner: IBanner[] = [
  {
    id: 1,
    title: 'Сервис и поддержка',
    slug: '',
    image: '/bg-support.png',
  }
]

const crumbs: IBreadcrumbs[] = [
  {
    title: 'Главная',
    href: '/',
    disabled: false,
  },
  {
    title: 'Сервис и поддержка',
    href: '/',
    disabled: true,
  }
]

const infoBlocks: { title: string, icon: string, link: string }[] = [
  {
    title: 'Монтаж и настройка',
    icon: 'mdi-cogs',
    link: '/',
  },
  {
    title: 'Найти сервисный центр',
    icon: 'mdi-map-marker-outline',
    link: '/',
  }
]
</script>

<template>
  <v-main class="pt-0">
    <section id="mainBanner">
      <UIBanner :slides="banner" />
    </section>
    <section>
      <v-container>
        <UIBreadcrumbs :crumbs="crumbs" />
      </v-container>
    </section>
    <section>
      <v-container>
        <v-row>
          <v-col
              cols="12"
              md="6"
          >
            <v-card
                rounded="lg"
                color="grey-light-4"
                class="pa-4 d-flex flex-column align-start v-card-not-shadow"
                elevation="0"
                height="100%"
            >
              <div class="pa-3 rounded-lg bg-primary mb-2">
                <v-icon icon="mdi-account-hard-hat-outline" size="28" />
              </div>
              <p class="text-h6 font-weight-medium mb-2 lh-normal">Сервисное обслуживание и ремонт</p>
              <div class="d-flex align-center ga-4 mb-2">
                <a href="tel:77272333333" class="link-hover text-body-1">+7 727 233 33 33</a>
                <p class="text-body-2 text-grey">08:00 - 22:00</p>
              </div>
              <div class="d-flex align-center ga-2">
                <a href="tel:3210" class="link-hover text-body-1">32-10</a>
                <p class="text-body-1">(для звонка с мобильного телефона)</p>
              </div>
            </v-card>
          </v-col>
          <v-col
              cols="12"
              md="6"
          >
            <v-card
                rounded="lg"
                color="grey-light-4"
                class="pa-4 d-flex flex-column align-start v-card-not-shadow"
                elevation="0"
                height="100%"
            >
              <div class="pa-3 rounded-lg bg-primary mb-2">
                <v-icon icon="mdi-headset" size="28" />
              </div>
              <p class="text-h6 font-weight-medium mb-2 lh-normal">Служба поддержки</p>
              <a href="tel:88000700129" class="link-hover text-body-1">8 800 070 01 29</a>
              <p class="text-body-2 text-grey">Казахстан, 09:00 - 20:00</p>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </section>
    <section>
      <v-container>
        <v-divider class="my-6 mt-2"></v-divider>
        <v-row>
          <v-col
              cols="12"
              md="7"
              class="d-flex flex-column justify-center"
          >
            <p class="text-h5 text-secondary font-weight-bold mb-2 lh-normal">Полезная информация</p>
            <p class="text-body-1 text-secondary font-weight-regular mb-4">Вся актуальная информация о вашей технике. Обновите драйверы и ПО, ознакомьтесь с инструкцией, будьте в курсе условий гарантийного обслуживания.</p>
            <v-row align-content="start" justify="start" class="flex-0-1">
              <v-col
                  v-for="item in infoBlocks"
                  :key="item.icon"
                  cols="12"
                  sm="5"
              >
                  <v-card
                      class="pa-4 card-hover-shadow card-hover-shadow d-flex flex-column align-start"
                      color="grey-light-4"
                      max-width="331px"
                      rounded="lg"
                  >
                    <div class="bg-primary pa-3 rounded-lg mb-4">
                      <v-icon :icon="item.icon" />
                    </div>
                    <p class="text-h6 lh-normal mb-2">{{ item.title }}</p>
                    <div class="d-flex align-center ga-1">
                      <p class="text-body-1 text-primary">Подробнее</p>
                      <v-icon icon="mdi-arrow-right" size="16" color="primary" class="card-hover-shadow-arrow" />
                    </div>
                  </v-card>
              </v-col>
            </v-row>
          </v-col>
          <v-col
              cols="12"
              md="5"
          >
            <v-img src="/support-img.png" height="100%" width="100%" />
          </v-col>
        </v-row>
      </v-container>
    </section>
  </v-main>

</template>

<style scoped lang="scss">

</style>