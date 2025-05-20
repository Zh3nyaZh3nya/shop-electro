<script setup lang="ts">
const crumbs: IBreadcrumbs[] = [
  {
    title: 'Главная',
    href: '/',
    disabled: false,
  },
  {
    title: 'Покупка и Доставка',
    href: '/',
    disabled: true,
  }
]

const infoBlocks: { icon: string, title: string }[] = [
  {
    icon: 'mdi-truck-fast',
    title: 'Доставка прямо до двери',
  },
  {
    icon: 'mdi-file-document-check-outline',
    title: 'Расширенная гарантия от производителя',
  },
  {
    icon: 'mdi-percent-outline',
    title: 'Выгода при покупке'
  }
]

const methodsPay: { images: string[], title: string, description: string }[] = [
  {
    images: ['/payment-and-delivery/visa-svgrepo-com.svg', '/payment-and-delivery/mastercard.svg',],
    title: 'Картой онлайн',
    description: 'Оплачивайте свои заказы на сайте картой онлайн\n'
  },
  {
    images: ['/payment-and-delivery/kaspi.svg'],
    title: 'Kaspi QR',
    description: 'Удобный и безопасный сервис, с помощью которого можно оплачивать покупки в мобильном приложении.'
  },
  {
    images: ['/payment-and-delivery/img.png'],
    title: 'Рассрочка без переплат',
    description: 'Покупайте сейчас — платите потом! Без первого взноса и переплат.',
  }
]
</script>

<template>
  <v-main>
    <section>
      <v-container>
        <UIBreadcrumbs :crumbs="crumbs" />
      </v-container>
    </section>
    <section>
      <v-container class="text-center d-flex flex-column align-center">
        <h1 class="text-h4 text-secondary font-weight-bold mb-4">Бесплатно доставим по Кзахастану*</h1>
      </v-container>
    </section>
    <section>
      <v-container>
        <v-row justify="center">
          <v-col
              v-for="(item, i) in infoBlocks"
              :key="item.icon"
              cols="12"
              sm="3"
              lg="2"
              class="d-flex justify-center"
          >
            <v-sheet
                rounded="lg"
                color="grey-light-2"
                class="pa-4 d-flex flex-column align-center ga-2"
                max-width="234px"
                width="100%"
                height="100%"
            >
              <v-icon :icon="item.icon" size="35px" color="primary" />
              <p class="text-body-1 text-secondary text-center lh-normal font-weight-medium">{{ item.title }}</p>
            </v-sheet>
          </v-col>
        </v-row>
      </v-container>
    </section>
    <section>
      <v-container>
        <p class="text-h4 font-weight-bold text-secondary text-center mb-4">Способы оплаты</p>
        <v-row justify="center">
          <v-col
              v-for="(item, i) in methodsPay"
              :key="item.title"
              cols="12"
              sm="6"
          >
            <v-card
                height="100%"
                min-height="252px"
                class="pa-8 v-card-not-shadow border-card d-flex flex-md-row flex-column align-center align-md-start ga-4"
                rounded="lg"
                color="white"
            >
              <div class="d-flex flex-column align-start h-100">
                <div v-for="img in item.images" :key="img" class="py-4 px-12 border-card-img rounded-lg mb-2 h-100 d-flex justify-center align-center">
                  <v-img :src="img" width="100px" height="100px" />
                </div>
              </div>
              <div>
                <p class="text-h4 text-secondary font-weight-bold">{{ item.title }}</p>
                <p class="text-h6 text-secondary font-weight-regular lh-normal">{{ item.description }}</p>
              </div>
            </v-card>
          </v-col>
        </v-row>
        <div class="my-12">
          <p class="text-body-1 text-secondary font-weight-medium mb-3">Ценообразование, снижение и корректировка цен</p>
          <p class="text-body-2 text-secondary font-weight-regular mb-3">При изменении цен на сайте стоимость товаров в корзине автоматически корректируется. Пользователь получает соответствующее уведомление. SHOP-AUDIO оставляет за собой право в любое время изменять цены на продукты, предлагаемые в официальном магазине, и исправлять допущенные по неосторожности ошибки в ценах. В случае ошибки в цене SHOP-AUDIO извещает об этом покупателя и определяет, намерен или нет покупатель совершить покупку по скорректированной цене. В случае отказа покупателя от совершения покупки по скорректированной цене SHOP-AUDIO аннулирует заказ по просьбе покупателя и возвращает уплаченную сумму.</p>
          <p class="text-body-2 text-secondary font-weight-regular">* При наличии технической возможности и / или транспортной доступности населенного пункта.</p>
        </div>
      </v-container>
    </section>
  </v-main>
</template>

<style lang="scss">
.border-card {
  border: 1px solid #d7dde3;
  &-img {
    border: 1px solid #f4f4f4;
  }
}
</style>