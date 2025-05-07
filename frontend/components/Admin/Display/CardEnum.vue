<script setup lang="ts">
import { ref } from "vue"
import { rules } from './Props'
import { slugify } from "~/utils/slugify";
import type { BaseItemEnum, DisplayProps, BaseEmitFn } from "./Props";

const {
  action,
  item: itemProps,
  last_id,
  isImage,
  is_for_main_page,
  is_subcategory
} = defineProps<
    DisplayProps<BaseItemEnum>
>()

const emit = defineEmits<BaseEmitFn<BaseItemEnum>>()

const formRef = ref()
const isEdit = action === 'edit'
const itemData: BaseItemEnum = itemProps ?? {
  id: last_id ?? 1,
  key: '',
  value: '',
  label: '',
  active: true,
  for_main_page: true,
  ...(isImage ? { image: null } : {}),
  ...(is_for_main_page ? { for_main_page: true } : {}),
  ...(is_subcategory ? {
    subcategories: [
      {
        id: last_id ?? 1,
        key: '',
        value: '',
        label: '',
        active: true
      },
    ],
  } : {}),
}

const label = ref<string>(isEdit ? itemData.label : '')
const key = computed(() => label.value)
const value = computed(() => label.value)
const fileImage = ref<File | null>(null)
const previewUrl = ref<string | null>(isEdit && typeof itemData.image === 'string' ? itemData.image : null)
const forMainPage = ref<boolean>(isEdit ? itemData.for_main_page ?? true : true)
const active = ref<boolean>(itemData.active)
const subcategories = ref<NonNullable<BaseItemEnum['subcategories']>>(
    isEdit && Array.isArray(itemProps?.subcategories)
        ? [...itemProps.subcategories]
        : [
          {
            id: Date.now(),
            key: '',
            value: '',
            label: '',
            active: true,
          },
        ]
)

function removeSubcategory(index: number) {
  if (index > 0) subcategories.value.splice(index, 1)
}

async function submitForm() {
  const { valid } = await formRef?.value.validate()
  if (!valid) return

  let file = fileImage.value

  if (file instanceof File && isImage) {
    const ext = file.name.split('.').pop() || 'webp'
    const baseName = slugify(label.value || 'image')
    const safeName = `${baseName}-${Date.now()}.${ext}`
    file = new File([file], safeName, { type: file.type })
  }

  emit('updateData', {
    id: itemData.id,
    key: slugify(key.value).toUpperCase(),
    value: slugify(value.value).toLowerCase(),
    label: label.value,
    active: active.value,
    ...(isImage && file ? { image: file } : {}),
    ...(is_for_main_page ? { for_main_page: forMainPage.value } : {}),
    ...(is_subcategory ? {
      subcategories: subcategories.value
          .filter((s) => s.label?.trim())
          .map((s) => ({
            ...s,
            key: slugify(s.label).toUpperCase(),
            value: slugify(s.label).toLowerCase(),
          })),
    } : {})
  })
}



function removeItem() {
  emit('remove', {
    id: itemData.id
  })
}

watchEffect(() => {
  const last = subcategories.value[subcategories.value.length - 1]
  if (last.label?.trim() && !subcategories.value.find(s => s.label === '')) {
    subcategories.value.push({
      id: Date.now() + Math.random(),
      key: '',
      value: '',
      label: '',
      active: true
    })
  }
})

watch(fileImage, (newFile) => {
  if (newFile instanceof File) {
    previewUrl.value = URL.createObjectURL(newFile)
  } else {
    previewUrl.value = null
  }
})
</script>

<template>
  <div class="d-flex justify-space-between align-center mb-6">
    <h1 class="text-h4 font-weight-bold" v-if="action === 'edit'">
      Редактирование
      {{ label }}
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
    <div class="w-100 mb-2" v-if="isImage">
      <p class="mb-2 text-body-1">Изображение<label class="text-admin-red text-body-1">*</label></p>
      <v-file-input
          v-model="fileImage"
          variant="outlined"
          :prepend-icon="''"
          placeholder="Перетащите сюда файл или выберите"
          :rules="[
            ...(isEdit && typeof itemData.image === 'string' ? [] : [rules.required, rules.imageOnly])
          ]"
          accept="image/jpeg, image/png, image/webp"
          rounded="lg"
          class="text-field-admin"
      />
    </div>

    <div class="d-flex justify-center  rounded-lg bg-admin-grey-dark-1" :class="{'pa-4 border-card mb-6': isEdit ? previewUrl : fileImage }">
      <v-img
          v-if="previewUrl"
          :src="previewUrl"
          max-width="200"
          cover
      />
    </div>

    <v-sheet elevation="0" rounded="lg" class="pa-6" color="admin-grey-dark-1">
      <div>
        <p class="mb-2 text-body-1">Заголовок<label class="text-admin-red text-body-1">*</label></p>
        <v-text-field
            v-model="label"
            variant="outlined"
            class="text-field-admin"
            rounded="lg"
            color="admin-primary"
            :rules="[rules.required]"
        >
        </v-text-field>
      </div>

      <div v-if="is_subcategory">
        <p class="mb-2 text-body-1">Подкатегории<label class="text-admin-red text-body-1">*</label></p>
        <div v-for="(subcategory, idx) in subcategories" :key="subcategory.id" class="mb-3 d-flex ga-2 align-center">
          <v-text-field
              v-model="subcategory.label"
              variant="outlined"
              class="text-field-admin"
              rounded="lg"
              color="admin-primary"
              :rules="idx === 0 ? [rules.required] : []"
              :hide-details="idx !== 0 || Boolean(subcategories.length)"
              placeholder="Название подкатегории"
          />
          <v-btn
              v-if="idx > 0"
              icon
              size="small"
              color="transparent"
              elevation="0"
              @click="removeSubcategory(idx)"
              :disabled="idx === subcategories.length - 1"
          >
            <v-icon icon="mdi-close" />
          </v-btn>
        </div>
      </div>

      <div class="d-flex align-center ga-4" v-if="is_for_main_page">
        <v-switch
          v-model="forMainPage"
          color="admin-primary"
          :hide-details="true"
        >

        </v-switch>
        <p class="text-body-1">Закрепить для главной страницы</p>
      </div>

      <div class="d-flex align-center ga-4">
        <v-switch
          v-model="active"
          color="admin-primary"
          :hide-details="true"
        >

        </v-switch>
        <p class="text-body-1">Активность</p>
      </div>

    </v-sheet>

    <div class="d-flex ga-3 align-center mt-4">
      <v-btn
          elevation="0"
          color="admin-primary"
          class="text-body-1 font-weight-bold text-white"
          rounded="lg"
          size="large"
          type="submit"
      >
        Сохранить
      </v-btn>
      <v-btn
          elevation="0"
          color="admin-grey-dark-1"
          class="text-body-1 font-weight-bold border-card"
          rounded="lg"
          size="large"
          :to="{
            name: 'admin-page',
            params: { page: $route.params.page },
          }"
      >
        Отмена
      </v-btn>
    </div>
  </v-form>
</template>

<style scoped>

</style>