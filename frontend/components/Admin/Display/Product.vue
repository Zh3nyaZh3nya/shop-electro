<script setup lang="ts">
import { ref } from "vue";
import { slugify } from "~/utils/slugify";
import { rules } from "~/components/Admin/Display/Props";
import { processFiles } from "~/utils/processFile";
import omit from "lodash-es/omit";
import type { BaseEmitFn, BaseItemProduct, DisplayProps, BaseItemEnum } from "~/components/Admin/Display/Props";

const {
  action,
  item: itemProps,
  last_id,
  is_for_main_page,
  enums
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
  category: { id: '', key: '', value: '', label: '', active: false },
  subcategory: null,
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
  installment: false,
  reviews: [],
  ...(is_for_main_page ? { for_main_page: true } : {}),
}

const previewImages = ref<(File | string)[]>(isEdit ? itemData.preview_images : [])
const images = ref<(File | string)[]>(isEdit ? itemData.images : [])
const title = ref<string>(isEdit ? itemData.title : '')
const description = ref<string>(isEdit ? itemData.description : '')
const discount = ref<boolean>(isEdit ? itemData.discount : false)
const discount_percent = ref<number | null>(isEdit ? itemData.discount_percent : null)
const price = ref<number | null>(isEdit ? itemData.price : null)
const rating = ref<number>(isEdit ? itemData.rating : 0)
const delivery = ref<boolean>(isEdit ? itemData.delivery : true)
const active = ref<boolean>(isEdit ? itemData.active : true)
const count = ref<number | null>(isEdit ? itemData.count : null)
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
const installment = ref<BaseItemProduct['installment']>(isEdit ? itemData.installment : true)
const forMainPage = ref<boolean>(false)
const selectCategory = ref<{
  category: BaseItemEnum | null
  subcategory?: BaseItemEnum['subcategories'] | null
}>({
  category: isEdit ? itemData.category : null,
  subcategory: isEdit ? itemData.subcategory : null,
})
const empty = ref()

async function submitForm() {
  const { valid } = await formRef.value?.validate?.() ?? { valid: true }
  if (
      !previewImages.value.length ||
      !images.value.length ||
      !specifications.value.length
  ) {
    empty.value = true
    return
  }

  if (!valid) {
    return
  }

  const processedPreviewImages = processFiles(previewImages.value, 'preview')
  const processedImages = processFiles(images.value, 'image')

  const rawCategory = selectCategory.value?.category || null
  const rawSubcategory = selectCategory.value?.subcategory || null

  const finalCategory = rawCategory ? omit(rawCategory, ['subcategories']) : null

  const payload: BaseItemProduct = {
    id: itemData.id,
    preview_images: processedPreviewImages as (File | string)[],
    images: processedImages as (File | string)[],
    title: title.value,
    slug: slugify(title.value),
    description: description.value,
    discount: discount.value,
    discount_percent: discount_percent.value || 0,
    price: price.value || 0,
    rating: rating.value,
    delivery: delivery.value,
    count: count.value || 0,
    category: finalCategory,
    subcategory: rawSubcategory,
    specifications: specifications.value
      .map(block => ({
        title: block.title.trim(),
        specification: block.specification.filter(
            s => s.title.trim() || s.description.trim()
        )
      }))
      .filter(block =>
          block.title.trim() || block.specification.length > 0
      ),
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
    v-if="title"
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
                    type="number"
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
                    v-model="count"
                    variant="outlined"
                    class="text-field-admin"
                    rounded="lg"
                    type="number"
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
                      type="number"
                      :rules="[
                        v => discount ? rules.required(v) : true,
                        v => discount && (v < 1 || v > 100) ? 'от 1 до 100' : true
                      ]"
                      width="118px"
                      :disabled="!discount"
                  />
                  <p class="text-h6 mt-1" :class="[!discount ? 'text-admin-grey' : '']">%</p>
                </div>

              </div>
            </div>
            <div style="max-width: 100px; width: 100%;">
              <p class="mb-2 text-body-1">Доставка</p>
              <div class="d-flex ga-4">
                <v-checkbox
                    v-model="delivery"
                    color="admin-primary"
                />
              </div>
            </div>
            <div style="max-width: 100px; width: 100%;">
              <p class="mb-2 text-body-1">Рассрочка</p>
              <div class="d-flex ga-4">
                <v-checkbox
                    v-model="installment"
                    color="admin-primary"
                />
              </div>
            </div>
          </div>
          <div>
            <p class="mb-4 text-body-1">Категория<label class="text-admin-red text-body-1">*</label></p>
            <AdminFieldsSelect
                v-model="selectCategory"
                label="Категории"
                :items="enums"
                :rules="[rules.required]"
            />
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
        :is-open-panel="empty"
    />

    <AdminFieldsImageOrVideoGallery
        v-if="isImage"
        v-model="images"
        label="Галерея изображений"
        :required="true"
        :multiple="true"
        accept="image/jpeg, image/png, image/webp"
        :is-open-panel="empty"
    />

    <AdminFieldsSpecifications
        v-if="specifications.length"
        v-model="specifications"
        :is-open-panel="empty"
    />

    <AdminFieldsFormActions />
  </v-form>
</template>

<style scoped>

</style>