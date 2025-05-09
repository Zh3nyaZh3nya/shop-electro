<script setup lang="ts">
import { ref, watch } from "vue";
import { slugify } from "~/utils/slugify";
import { rules } from "~/components/Admin/Display/Props";
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

const editorRef = ref()
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
const previewImagesPreview = ref<string[]>([])
const imagesPreview = ref<string[]>([])
const title = ref<string>(isEdit ? itemData.title : '')
const description = ref<string>(isEdit ? itemData.description : '')
const discount = ref<boolean>(isEdit ? itemData.discount : false)
const discount_percent = ref<number>(isEdit ? itemData.discount_percent : 0)
const price = ref<number>(isEdit ? itemData.price : 0)
const rating = ref<number>(isEdit ? itemData.rating : 0)
const delivery = ref<boolean>(isEdit ? itemData.delivery : true)
const count = ref<number>(isEdit ? itemData.count : 0)
const specifications = ref<BaseItemProduct['specifications']>(isEdit ? itemData.specifications : [])
const installment = ref<BaseItemProduct['installment']>(isEdit ? itemData.installment : {})
const forMainPage = ref<boolean>(false)

async function submitForm() {
  const { valid } = await formRef.value?.validate?.() ?? { valid: true }
  if (!valid) return

  function processFiles(files: (File | string)[], prefix: string): (File | string)[] {
    return files.map((file) => {
      if (typeof file === 'string') return file

      const ext = file.name.split('.').pop() || 'webp'
      const baseName = slugify(file.name.split('.').slice(0, -1).join('-')) || prefix
      const safeName = `${baseName}-${Date.now()}.${ext}`

      return new File([file], safeName, { type: file.type })
    })
  }

  const processedPreviewImages = processFiles(previewImages.value, 'preview')
  const processedImages = processFiles(images.value, 'image')

  const payload: BaseItemProduct = {
    id: itemData.id,
    preview_images: processedPreviewImages,
    images: processedImages,
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
    ...(is_for_main_page ? { for_main_page: forMainPage.value } : {})
  }

  emit('updateData', payload)
}

function removeItem() {
  emit('remove', {
    id: itemData.id
  })
}

function handlePreviewImagesChange(files: File[] | File | null) {
  const newFiles: (File | string)[] =
      files instanceof File
          ? [files]
          : Array.isArray(files)
              ? files
              : []

  const existingFiles = previewImages.value.filter(f =>
      typeof f === 'string' ||
      !newFiles.some(nf =>
          nf instanceof File &&
          f instanceof File &&
          nf.name === f.name &&
          nf.size === f.size &&
          nf.type === f.type
      )
  )

  previewImages.value = [...existingFiles, ...newFiles]

  const previews = newFiles
      .filter(f => f instanceof File)
      .map(f => URL.createObjectURL(f as File))

  previewImagesPreview.value = [...previewImagesPreview.value, ...previews]
}

function removePreviewImage(index: number) {
  previewImages.value.splice(index, 1)
  previewImagesPreview.value.splice(index, 1)
}

function handleImagesChange(files: File[] | File | null) {
  const newFiles: (File | string)[] =
      files instanceof File
          ? [files]
          : Array.isArray(files)
              ? files
              : []

  const existingFiles = images.value.filter(f =>
      typeof f === 'string' ||
      !newFiles.some(nf =>
          nf instanceof File &&
          f instanceof File &&
          nf.name === f.name &&
          nf.size === f.size &&
          nf.type === f.type
      )
  )

  images.value = [...existingFiles, ...newFiles]

  const previews = newFiles
      .filter(f => f instanceof File)
      .map(f => URL.createObjectURL(f as File))

  imagesPreview.value = [...imagesPreview.value, ...previews]
}

function removeImage(index: number) {
  images.value.splice(index, 1)
  imagesPreview.value.splice(index, 1)
}
</script>

<template>
  <div class="d-flex justify-space-between align-center mb-6">
    <h1 class="text-h4 font-weight-bold" v-if="action === 'edit'">
      Редактирование
      {{ title }}
    </h1>
    <h1 v-else>Создание</h1>
    <v-btn
        v-if="action === 'edit'"
        color="admin-error"
        rounded="lg"
        size="large"
        class="text-body-1 font-weight-bold"
        elevation="0"
        @click="removeItem"
    >
      Удалить
    </v-btn>
  </div>
  <v-form
    ref="formRef"
    @submit.prevent="submitForm"
  >
    <div class="mb-4">
      <v-card color="admin-grey-dark-1" class="pa-4" rounded="lg" elevation="0">
        <div>
          <p class="mb-2 text-body-1">Заголовок<label class="text-admin-red text-body-1">*</label></p>
          <v-text-field
              v-model="title"
              variant="outlined"
              class="text-field-admin"
              rounded="lg"
              color="admin-primary"
              :rules="[rules.required]"
          >
          </v-text-field>
        </div>

        <div class="mb-4">
          <AdminEditor
              ref="editorRef"
              v-model="description"
              :rules="[rules.required]"
          />
        </div>

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
      </v-card>
    </div>

    <div class="mb-4">
      <v-expansion-panels color="admin-grey-dark-1" elevation="0">
        <v-expansion-panel color="admin-grey-dark-1" rounded="lg" elevation="0">
          <v-expansion-panel-title>
            <p class="text-body-1">Галерея превью<label class="text-admin-red text-body-1">*</label></p>
          </v-expansion-panel-title>
          <v-expansion-panel-text>
            <v-card color="admin-grey-dark-1" class="pa-4 rounded-b-lg rounded-t-0" elevation="0">
              <div class="w-100 mb-2">
                <p class="mb-2 text-body-1">Превью карточки<label class="text-admin-red text-body-1">*</label></p>
                <v-file-input
                    v-model="previewImages"
                    @update:modelValue="handlePreviewImagesChange"
                    multiple
                    accept="image/jpeg, image/png, image/webp"
                    placeholder="Перетащите сюда файл или выберите"
                    :prepend-icon="''"
                    variant="outlined"
                    class="text-field-admin"
                    rounded="lg"
                    :rules="[value => {
            if (typeof value === 'string') return true
            const files = Array.isArray(value) ? value : [value]
            const isValid = files.every(file => file instanceof File && ['image/jpeg', 'image/png', 'image/webp'].includes(file.type))
            return isValid || 'Допустимы только изображения JPG, PNG, WEBP'
          }]"
                />
              </div>

              <div
                  class="d-flex justify-center flex-wrap rounded-lg bg-admin-grey-dark-1 ga-4"
                  :class="{
          'pa-4 border-card mb-6': (isEdit && previewImagesPreview.length) || (!isEdit && previewImages.length)
        }"
              >
                <div
                    v-for="(src, idx) in previewImagesPreview"
                    :key="src"
                    class="position-relative my-4"
                >
                  <v-img
                      :src="src"
                      width="300px"
                      height="100%"
                      cover
                      class="rounded"
                  />
                  <v-btn
                      icon
                      size="x-small"
                      class="position-absolute bg-transparent"
                      elevation="0"
                      style="top: 4px; right: 4px;"
                      @click="removePreviewImage(idx)"
                  >
                    <v-icon icon="mdi-close" />
                  </v-btn>
                </div>
              </div>
            </v-card>

          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>
    </div>

    <div class="mb-4">
      <v-expansion-panels color="admin-grey-dark-1" elevation="0">
        <v-expansion-panel color="admin-grey-dark-1" rounded="lg" elevation="0">
          <v-expansion-panel-title>
            <p class="text-body-1">Галерея изображений<label class="text-admin-red text-body-1">*</label></p>
          </v-expansion-panel-title>
          <v-expansion-panel-text>
            <v-card color="admin-grey-dark-1" class="pa-4 rounded-b-lg rounded-t-0" elevation="0">
              <div class="w-100 mb-2">
                <p class="mb-2 text-body-1">Галерея товара<label class="text-admin-red text-body-1">*</label></p>
                <v-file-input
                    v-model="images"
                    @update:modelValue="handleImagesChange"
                    multiple
                    accept="image/jpeg, image/png, image/webp"
                    placeholder="Перетащите сюда файл или выберите"
                    :prepend-icon="''"
                    variant="outlined"
                    class="text-field-admin"
                    rounded="lg"
                    :rules="[value => {
              if (typeof value === 'string') return true
              const files = Array.isArray(value) ? value : [value]
              const isValid = files.every(file => file instanceof File && ['image/jpeg', 'image/png', 'image/webp'].includes(file.type))
              return isValid || 'Допустимы только изображения JPG, PNG, WEBP'
            }]"
                />
              </div>

              <div
                  class="d-flex justify-center flex-wrap rounded-lg bg-admin-grey-dark-1 ga-4"
                  :class="{
            'pa-4 border-card mb-6': (isEdit && imagesPreview.length) || (!isEdit && images.length)
          }"
              >
                <div
                    v-for="(src, idx) in imagesPreview"
                    :key="src"
                    class="position-relative my-4"
                >
                  <v-img
                      :src="src"
                      width="300px"
                      height="100%"
                      cover
                      class="rounded"
                  />
                  <v-btn
                      icon
                      size="x-small"
                      class="position-absolute bg-transparent"
                      elevation="0"
                      style="top: 4px; right: 4px;"
                      @click="removeImage(idx)"
                  >
                    <v-icon icon="mdi-close" />
                  </v-btn>
                </div>
              </div>
            </v-card>
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>
    </div>

  </v-form>
</template>

<style scoped>

</style>