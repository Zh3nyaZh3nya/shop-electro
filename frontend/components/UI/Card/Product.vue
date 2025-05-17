<script setup lang="ts">
const { data, is_main } = defineProps<{
  data: IProductCard,
  is_main?: boolean
}>()
</script>

<template>
  <v-card
    elevation="1"
    rounded="lg"
    class="pa-2 card-product h-100 w-100 position-relative d-flex flex-column align-start justify-start"
    v-if="data"
  >
    <v-chip
        rounded="lg"
        v-if="data.installment"
        elevation="0"
        color="dark-primary"
        variant="outlined"
        class="text-caption text-uppercase font-weight-medium mb-4"
    >
      Рассрочка
    </v-chip>
    <div v-else style="height: 105px"></div>
    <UISliderImage
      :images="data.preview_images"
      :is_main="is_main"
    />
    <div class="d-flex flex-column h-100 mt-4 px-2">
      <div>
        <p class="text-caption text-grey mb-2">{{ data?.reviews?.length }} отзывов</p>
        <nuxt-link :to="`/catalog/${data?.category?.value}/${data?.subcategory?.value}/${data.slug}`" class="link-hover">
          <p class="text-body-1 font-weight-medium mb-2">{{ data.title }}</p>
        </nuxt-link>
      </div>

      <div v-if="!data.discount" class="mt-auto">
        <p class="text-h5 font-weight-bold">{{ data?.price?.toLocaleString('ru-RU') }} ₸</p>
      </div>
      <div v-else class="mt-auto">
        <div class="text-body-2 d-flex ga-2">
          <p class="text-line">{{ data?.price?.toLocaleString('ru-RU') }} ₸</p>
          <label class="bg-red px-1 rounded text-caption">-{{ data.discount_percent }}%</label>
        </div>
        <p class="text-h5 font-weight-bold text-red">{{ Math.floor(data.price - (data.price / data.discount_percent)).toLocaleString('ru-RU') }} ₸</p>
      </div>
    </div>

    <div class="d-flex align-center ga-2 mt-4 w-100">
      <v-btn
        rounded="lg"
        color="primary"
        elevation="0"
        class="flex-grow-1"
        size="large"
      >
        В корзину
      </v-btn>
      <v-btn
        rounded="lg"
        color="grey-light-2"
        elevation="0"
        size="large"
      >
        <v-icon icon="mdi-heart-plus" color="grey-dark-1">

        </v-icon>
      </v-btn>
    </div>

  </v-card>
</template>

<style lang="scss">
.card-product {
  .v-chip {
    padding: 8px 8px;
  }
}
</style>