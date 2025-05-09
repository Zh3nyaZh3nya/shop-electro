<script setup lang="ts">
import { ref } from "vue";
import { slugify } from "~/utils/slugify";
import { rules } from "~/components/Admin/Display/Props";
import { processFiles } from "~/utils/processFile";
import type { BaseEmitFn, BaseItemProduct, DisplayProps } from "~/components/Admin/Display/Props";

const {
  action,
  item: itemProps,
  last_id,
  is_for_main_page,
} = defineProps<
    DisplayProps<BaseItemProduct>
>()

const emit = defineEmits<BaseEmitFn<BaseItemProduct>>()

const formRef = ref()
const isEdit = action === 'edit'
const itemData: BaseItemProduct = itemProps ?? {
  id: last_id ?? 1,
  preview_images: [],
  images: [],
  title: '',
  slug: '',
  description: '',
  discount: false,
  discount_percent: 0,
  price: 0,
  rating: 0,
  delivery: true,
  count: 0,
  active: true,
  specifications: [
    {
      title: '',
      specification: [
        {
          title: '',
          description: '',
        }
      ]
    }
  ],
  installment: {
    active: false,
    periods: ['']
  },
  reviews: [],
  ...(is_for_main_page ? { for_main_page: true } : {}),
}

const previewImages = ref<(File | string)[]>(isEdit ? itemData.preview_images : [])
const images = ref<(File | string)[]>(isEdit ? itemData.images : [])
const title = ref<string>(isEdit ? itemData.title : '')
const description = ref<string>(isEdit ? itemData.description : '')
const discount = ref<boolean>(isEdit ? itemData.discount : false)
const discount_percent = ref<number>(isEdit ? itemData.discount_percent : 0)
const price = ref<number>(isEdit ? itemData.price : 0)
const rating = ref<number>(isEdit ? itemData.rating : 0)
const delivery = ref<boolean>(isEdit ? itemData.delivery : true)
const active = ref<boolean>(isEdit ? itemData.active : true)
const count = ref<number>(isEdit ? itemData.count : 0)
const specifications = ref<BaseItemProduct['specifications']>(isEdit ? itemData.specifications : [
  {
    title: '',
    specification: [
      {
        title: '',
        description: ''
      }
    ]
  }
])
const installment = ref<BaseItemProduct['installment']>(isEdit ? itemData.installment : [])
const forMainPage = ref<boolean>(false)

async function submitForm() {
  const { valid } = await formRef.value?.validate?.() ?? { valid: true }
  if (!valid) return

  const processedPreviewImages = processFiles(previewImages.value, 'preview')
  const processedImages = processFiles(images.value, 'image')

  const payload: BaseItemProduct = {
    id: itemData.id,
    preview_images: processedPreviewImages as (File | string)[],
    images: processedImages as (File | string)[],
    title: title.value,
    slug: slugify(title.value),
    description: description.value,
    discount: discount.value,
    discount_percent: discount_percent.value,
    price: price.value,
    rating: rating.value,
    delivery: delivery.value,
    count: count.value,
    specifications: specifications.value,
    installment: installment.value,
    reviews: itemData.reviews ?? [],
    active: active.value,
    ...(is_for_main_page ? { for_main_page: forMainPage.value } : {})
  }

  emit('updateData', payload)
}

function removeItem() {
  emit('remove', {
    id: itemData.id
  })
}
</script>

<template>
  <AdminFieldsHeader
    :title="title"
    :is-edit="isEdit"
    @remove="removeItem"
  />
  <v-form
    ref="formRef"
    @submit.prevent="submitForm"
  >
    <AdminFieldsMainBlock
        v-model:title="title"
        v-model:description="description"
        v-model:active="active"
        v-model:forMainPage="forMainPage"
        :is_for_main_page="is_for_main_page"
      >
        <template #default>
          <div class="d-flex align-center flex-wrap ga-4">
            <div style="max-width: 200px; width: 100%;">
              <p class="mb-2 text-body-1">Цена<label class="text-admin-red text-body-1">*</label></p>
              <div class="d-flex ga-4">
                <v-text-field
                    v-model="price"
                    variant="outlined"
                    class="text-field-admin"
                    rounded="lg"
                    color="admin-primary"
                    :rules="[rules.required]"
                    width="100%"
                />
                <p class="text-h6 mt-1">₸</p>
              </div>
            </div>
            <div style="max-width: 200px; width: 100%;">
              <p class="mb-2 text-body-1">Количество<label class="text-admin-red text-body-1">*</label></p>
              <div class="d-flex ga-4">
                <v-text-field
                    v-model="price"
                    variant="outlined"
                    class="text-field-admin"
                    rounded="lg"
                    color="admin-primary"
                    :rules="[rules.required]"
                    width="100%"
                    max-width="150px"
                />
                <p class="text-body-2 mt-3">/ шт</p>
              </div>
            </div>
            <div style="max-width: 200px; width: 100%;">
              <p class="mb-2 text-body-1">Скидка<label class="text-admin-red text-body-1" v-if="discount">*</label></p>
              <div class="d-flex ga-6">
                <v-checkbox
                    v-model="discount"
                    color="admin-primary"
                />
                <div class="d-flex ga-2">
                  <v-text-field
                      v-model="discount_percent"
                      variant="outlined"
                      class="text-field-admin"
                      rounded="lg"
                      color="admin-primary"
                      :rules="[
                        (v) => discount ? rules.required(v) : true
                      ]"
                      width="118px"
                      :disabled="!discount"
                  />
                  <p class="text-h6 mt-1" :class="[!discount ? 'text-admin-grey' : '']">%</p>
                </div>

              </div>
            </div>
            <div style="max-width: 200px; width: 100%;">
              <p class="mb-2 text-body-1">Доставка</p>
              <div class="d-flex ga-4">
                <v-checkbox
                    v-model="delivery"
                    color="admin-primary"
                />
              </div>
            </div>

          </div>
        </template>
      </AdminFieldsMainBlock>

    <AdminFieldsImageOrVideoGallery
        v-if="isImage"
        v-model="previewImages"
        label="Галерея превью"
        :required="true"
        :multiple="true"
        accept="image/jpeg, image/png, image/webp"
    />

    <AdminFieldsImageOrVideoGallery
        v-if="isImage"
        v-model="images"
        label="Галерея изображений"
        :required="true"
        :multiple="true"
        accept="image/jpeg, image/png, image/webp"
    />

    <AdminFieldsSpecifications v-model="specifications" />

    <AdminFieldsFormActions />
  </v-form>
</template>

<style scoped>

</style>