<script setup lang="ts">
const menuFirst: { title: string, link: string }[] = [
  {
    title: 'Оплата и доставка',
    link: '/'
  },
  {
    title: 'Вопросы и ответы',
    link: '/'
  },
  {
    title: 'Рассрочка',
    link: '/'
  },
]
const menuSecond: { title: string, link: string }[] = [
  {
    title: 'Монтаж и настройка',
    link: '/'
  },
  {
    title: 'Контакты',
    link: '/'
  },
  {
    title: 'Гарантия',
    link: '/'
  },
]
</script>

<template>
  <v-footer class="d-flex flex-column pt-0 px-0" color="grey-light-4">
    <v-divider class="w-100"></v-divider>
    <v-container class="px-10 pt-10 py-16 py-md-10 ">
      <v-row>
        <v-col
            sm="2"
            md="1"
            lg="1"
            class="d-none d-sm-block"
        >
          <nuxt-link to="/">
            <v-img src="/logo.png" height="80px" />
          </nuxt-link>
        </v-col>
        <v-col
            sm="10"
            md="11"
            lg="4"
        >
          <div class="d-flex justify-sm-space-between align-sm-center align-lg-start flex-column flex-sm-row flex-lg-column">
            <div class="d-flex flex-column flex-sm-row ga-0 ga-sm-8">
              <div class="d-flex flex-column">
                <ul>
                  <li
                      v-for="link in menuFirst"
                      :key="link.title"
                      class="text-h6 mb-2 font-weight-regular"
                  >
                    <nuxt-link :to="link.link" class="text-secondary link-hover">
                      {{ link.title }}
                    </nuxt-link>
                  </li>
                </ul>
              </div>
              <div class="d-flex flex-column">
                <ul>
                  <li
                      v-for="link in menuSecond"
                      :key="link.title"
                      class="text-h6 mb-2 font-weight-regular"
                  >
                    <nuxt-link :to="link.link" class="text-secondary link-hover">
                      {{ link.title }}
                    </nuxt-link>
                  </li>
                </ul>
              </div>
            </div>
            <div class="d-flex ga-4 mt-4">
              <a href="https://t.me/Zh3nya_qwe" target="blank" rel="noreferrer noopener" class="d-flex align-center justify-center icon-social tg">
                <svg width="24px" height="24px" viewBox="0 0 48 48" id="Layer_2" data-name="Layer 2" xmlns="http://www.w3.org/2000/svg" fill="#fff">
                  <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                  <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                  <g id="SVGRepo_iconCarrier">
                    <path class="cls-1" d="M40.83,8.48c1.14,0,2,1,1.54,2.86l-5.58,26.3c-.39,1.87-1.52,2.32-3.08,1.45L20.4,29.26a.4.4,0,0,1,0-.65L35.77,14.73c.7-.62-.15-.92-1.07-.36L15.41,26.54a.46.46,0,0,1-.4.05L6.82,24C5,23.47,5,22.22,7.23,21.33L40,8.69a2.16,2.16,0,0,1,.83-.21Z">
                    </path>
                  </g>
                </svg>
              </a>
              <a href="https://www.instagram.com/evg3niy_s0s0viashv1l1/" target="blank" rel="noreferrer noopener" class="d-flex align-center justify-center icon-social insta">
                <v-icon icon="mdi-instagram" size="20px" color="white" />
              </a>
            </div>
          </div>

        </v-col>
        <v-col
            lg="3"
        >
          <v-sheet
            elevation="0"
            rounded="lg"
            color="white"
            class="pa-7 h-100 h-lg-auto"
          >
            <div class="text-dark-primary-2 font-weight-medium lh-normal text-body-1 mb-5">
              <p>Остались вопросы?</p>
              <p>Позвоните или напишите нам</p>
            </div>
            <div>
              <p class="text-grey text-body-2">по всему Казахстану</p>
              <a href="tel:87079169250" class="link-hover">8 707 916 92 50</a>
              <p class="text-body-2">с 09:00 - до 20:00</p>
              <a href="mailto:evgeniq.golovkin@gmail.com" class="text-primary">evgeniq.golovkin@gmail.com</a>
            </div>
          </v-sheet>
        </v-col>
        <v-col
            lg="4"
        >
          <v-sheet
            rounded="lg"
            class="pa-7 footer-info-sheet"
            color="transparent"
          >
            <p class="mb-6 text-body-1 font-weight-medium">Сервисное обслуживание и ремонт</p>

            <div class="mb-4">
              <p class="text-body-2 text-grey">Суюнбая 263/12, Алматы</p>
              <a href="tel:87079169250" class="text-body-1 font-weight-medium text-secondary">+7 707 916 92 50</a>
            </div>

            <div class="mb-4">
              <p class="text-body-2 text-grey">Сервис-маг, Алматы</p>
              <a href="tel:32-10" class="text-body-1 font-weight-medium text-secondary">32-10 (для звонка с мобильного телефона)</a>
            </div>

            <div class="mb-4">
              <p class="text-body-2 text-grey">ТОО РСС Алатау (цифровая техника и ТВ), Алматы</p>
              <a href="tel:87272220000" class="text-body-1 font-weight-medium text-secondary">+7 727 222-00-00</a>
            </div>

            <nuxt-link to="/" class="text-body-1 text-primary">
              Сервисное обслуживание
              <v-icon icon="mdi-chevron-right" size="18" />
            </nuxt-link>
          </v-sheet>
        </v-col>
      </v-row>
    </v-container>
  </v-footer>
</template>

<style lang="scss">
.footer-info-sheet {
  border: 1px solid #d7dde3;
}

.icon-social.insta {
  background: #afbbc6;
  width: 40px;
  height: 40px;
  position: relative;
  overflow: hidden;
  border-radius: 50px;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at 30% 107%,#fdf497 0,#fdf497 5%,#fd5949 45%,#d6249f 60%,#285aeb 90%);
    opacity: 0;
    transition: opacity 0.35s ease;
    z-index: 1;
  }

  &:hover::after {
    opacity: 1;
  }

  > * {
    position: relative;
    z-index: 2;
  }
}

.icon-social.tg {
  background: #afbbc6;
  width: 40px;
  height: 40px;
  position: relative;
  overflow: hidden;
  border-radius: 50px;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: rgb(24,163,230);
    opacity: 0;
    transition: opacity 0.35s ease;
    z-index: 1;
  }

  &:hover::after {
    opacity: 1;
  }

  > * {
    position: relative;
    z-index: 2;
  }
}
</style>