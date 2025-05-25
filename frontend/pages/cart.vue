<script setup lang="ts">
import { pluralize } from "~/utils/pluralize";

const { cart, order } = storeToRefs(useStore())
const { makeOrder } = useStore()

const crumbs: IBreadcrumbs[] = [
  {
    title: 'Главная',
    href: '/',
    disabled: false,
  },
  {
    title: 'Корзина',
    href: '/',
    disabled: true,
  }
]

</script>

<template>
  <v-main class="bg-grey-light-4 cart">
    <section>
      <v-container>
        <UIBreadcrumbs :crumbs="crumbs" />
        <h1 class="text-h4 text-secondary font-weight-bold">Корзина</h1>
      </v-container>
    </section>
    <section v-if="cart.length">
      <v-container>
        <v-sheet
            rounded="lg"
            class="pa-10"
            elevation="0"
        >
          <v-card color="grey-light-4" elevation="0" class="pa-4 mb-8" rounded="lg">
            <p class="text-body-1 text-secondary">Обратите внимание. Доставка в день оформления заказа осуществляется, если заказ подтвержден до 12:00. Пожалуйста, дождитесь звонка для подтверждения заказа.</p>
          </v-card>
          <v-row>
            <v-col
                v-for="(item, index) in cart"
                cols="12"
            >
              <UICardCart
                  :data="item"
              />

              <v-divider v-if="index !== cart.length - 1" class="mt-6 mb-2"></v-divider>
            </v-col>
          </v-row>
        </v-sheet>
      </v-container>
      <v-container>
        <v-sheet
            rounded="lg"
            class="pa-10"
            elevation="0"
        >
          <div class="d-flex flex-column ga-1">
            <div class="d-flex justify-space-between">
              <p class="text-body-1 text-secondary font-weight-regular">{{ cart.length }} {{ pluralize(cart.length, ['товар', 'товара', 'товаров']) }} на сумму</p>
              <p class="text-body-1 text-secondary font-weight-medium">{{ cart.reduce((acc, i) => { return acc += (i.price * i.count_cart) }, 0).toLocaleString('ru-RU') }} ₸</p>
            </div>
            <div class="d-flex justify-space-between">
              <p class="text-body-1 text-secondary font-weight-regular">
                Скидка на {{ cart.filter(i => i.discount).length }} {{ pluralize(cart.filter(i => i.discount).length, ['товар', 'товара', 'товаров']) }}
              </p>
              <p class="text-body-1 text-secondary font-weight-medium">
                - {{
                  Math.floor(
                      cart.filter(i => i.discount)
                          .reduce((acc, i) => {
                            return acc += ((i.price / i.discount_percent) * i.count_cart)
                          }, 0)).toLocaleString('ru-RU')
                }} ₸
              </p>
            </div>
            <div class="d-flex justify-space-between">
              <p class="text-body-1 text-secondary font-weight-regular">Доставка</p>
              <p class="text-body-1 text-secondary font-weight-medium">Бесплатно</p>
            </div>
          </div>
          <v-divider class="my-4" />
          <div class="d-flex justify-space-between">
            <p class="text-h6 text-secondary font-weight-medium">Итого</p>
            <p class="text-h6 text-secondary font-weight-medium">
              {{
                (
                    cart.reduce((acc, i) => { return (acc += i.price * i.count_cart) }, 0)
                    -
                    Math.floor(
                        cart.filter(i => i.discount)
                            .reduce((acc, i) => {
                              return acc += ((i.price / i.discount_percent) * i.count_cart)
                            }, 0)
                    )
                ).toLocaleString('ru-RU')
              }} ₸</p>
          </div>

          <div class="d-flex justify-end mt-4">
            <v-btn
                @click="makeOrder"
                color="primary"
                elevation="0"
                size="large"
            >
              Оформить заказ
            </v-btn>
          </div>
        </v-sheet>
      </v-container>
    </section>
    <section v-else-if="order">
      <v-container>
        <v-container>
          <v-sheet
              rounded="lg"
              class="pa-10 text-h6 text-center text-secondary"
              elevation="0"
          >
            <p class="text-h5 font-weight-medium mb-2">Спасибо за заказ!</p>
            <p class="font-weight-regular lh-normal">Мы получили ваш заказ и уже начали его обработку. В ближайшее время наш менеджер свяжется с вами для подтверждения деталей.</p>
            <p class="font-weight-regular lh-normal">Пожалуйста, не отключайте телефон — мы хотим доставить ваш заказ как можно скорее.</p>
            <v-btn
                @click="order = !order"
                class="mt-8"
                color="primary"
                size="large"
                elevation="0"
                rounded="lg"
            >
              Перейти в корзину
            </v-btn>
          </v-sheet>
        </v-container>
      </v-container>
    </section>
    <section v-else>
      <v-container>
        <v-sheet
            color="white"
            rounded="lg"
            class="pa-16 text-center"
        >
          <p class="text-h5 font-weight-bold text-secondary mb-4">В корзине нет товаров</p>
          <p class="mb-4">Вы можете выбрать подходящую технику в нашем каталоге</p>
          <v-btn
              color="primary"
              rounded="lg"
              to="/catalog"
              size="large"
              elevation="0"
          >
            Каталог товаров
          </v-btn>
        </v-sheet>
      </v-container>
    </section>
  </v-main>
</template>

<style lang="scss">
</style>