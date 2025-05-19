<script setup lang="ts">
import { ref, watch } from 'vue'
const { favorites } = storeToRefs(useStore())
const { addProduct, removeProduct, updateCountProduct } = useStore()

const count = ref<number>(1)
const countStr = ref('1')

const { data } = defineProps<{
  data: IProductCard,
}>()

watch(count, (val) => {
  countStr.value = String(val)
})

function validateCount() {
  const num = parseInt(countStr.value)
  if (isNaN(num) || num < 1) {
    count.value = 1
  } else {
    count.value = num
  }
  updateCountProduct(count.value, data.id)
}

function decrement() {
  if (count.value > 1) {
    count.value--
    updateCountProduct(count.value, data.id)
  }
}

function increment() {
  count.value++
  updateCountProduct(count.value, data.id)
}
</script>

<template>
  <v-card class="d-flex justify-space-between v-card-not-shadow align-center">
    <div class="d-flex ga-3">
      <div>
        <v-img :src="data.preview_images[0]" width="110" height="90" />
      </div>
      <div class="d-flex flex-column justify-space-between">
        <p class="text-uppercase text-body-2 text-secondary font-weight-medium" style="max-width: 250px">{{ data.title }}</p>
        <div class="d-flex align-center ga-4">
          <v-btn
              variant="text"
              min-width="0"
              class="px-0"
              @click="removeProduct('cart', data.id)"
          >
            <div class="d-flex align-center ga-2 text-grey text-body-2">
              <v-icon icon="mdi-trash-can-outline" />
              <p>Удалить из корзины</p>
            </div>
          </v-btn>
          <v-btn
              v-if="!favorites.find(p => p.id === data.id)"
              variant="text"
              min-width="0"
              class="px-0"
              @click="addProduct('favorite', data)"
          >
            <div class="d-flex align-center ga-2 text-grey text-body-2">
              <v-icon icon="mdi-heart" />
              <p>В избранное</p>
            </div>
          </v-btn>
          <v-btn
              v-else
              variant="text"
              min-width="0"
              class="px-0"
              @click="removeProduct('favorite', data.id)"
          >
            <div class="d-flex align-center ga-2 text-primary text-body-2">
              <v-icon icon="mdi-heart-broken" />
              <p>В избранном</p>
            </div>
          </v-btn>
        </div>
      </div>
      <div class="d-flex align-center ml-4">
        <div class="d-flex flex-column ga-2">
          <div class="d-flex align-center ga-2">
            <v-btn elevation="0" @click="decrement">
              <v-icon icon="mdi-minus" />
            </v-btn>

            <v-text-field
                type="number"
                min="1"
                variant="outlined"
                :hide-details="true"
                v-model="countStr"
                class="text-field-count"
                min-width="0"
                width="80"
                @blur="validateCount"
            />

            <v-btn elevation="0" @click="increment">
              <v-icon icon="mdi-plus" />
            </v-btn>
          </div>
          <p class="text-center" :class="count > 1 ? 'opacity-100' : 'opacity-0'">{{ data?.price?.toLocaleString('ru-RU') }} ₸/шт</p>

        </div>
      </div>
    </div>
    <div>
      <div v-if="data.discount" class="text-end">
        <p class="text-h6 text-red font-weight-bold">{{ Math.floor((data.price - (data.price / data.discount_percent)) * data.count_cart).toLocaleString('ru-RU') }} ₸</p>
        <div class="text-body-2 d-flex ga-2">
          <p class="text-line text-grey">{{ (data.price * data.count_cart).toLocaleString('ru-RU') }} ₸</p>
          <label class="bg-red px-1 rounded text-caption">-{{ data.discount_percent }}%</label>
        </div>
      </div>
      <div v-else>
        <p class="text-h6 text-secondary font-weight-bold">{{ (data.price * data.count_cart).toLocaleString('ru-RU') }} ₸</p>
      </div>
    </div>
  </v-card>
</template>

<style scoped lang="scss">

</style>