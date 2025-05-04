<script setup lang="ts">
import { ref } from "vue"
import { rules } from './Props'
import { slugify } from "~/utils/slugify";
import type { BaseItemEnum, DisplayProps, BaseEmitFn } from "./Props";

const { action, item: itemProps, last_id, isImage, is_for_main_page } = defineProps<
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
  for_main_page: true,
  ...(isImage ? { image: null } : {})
}

const label = ref<string>(isEdit ? itemData.label : '')
const key = computed(() => label.value.toUpperCase())
const value = computed(() => label.value.toLowerCase())
const image = ref<File | string | null>(isEdit ? itemData.image : null)
const previewUrl = ref<string | null>(null)
const forMainPage = ref<boolean>(isEdit ? itemData.for_main_page : true)

async function submitForm() {
  const { valid } = await formRef?.value.validate()
  if (!valid) return

  let file = image.value

  if (file instanceof File && isImage) {
    const ext = file.name.split('.').pop() || 'webp'
    const baseName = slugify(label.value || 'image')
    const safeName = `${baseName}-${Date.now()}.${ext}`
    file = new File([file], safeName, { type: file.type })
  }

  emit('updateData', {
    id: itemData.id,
    key: key.value,
    value: value.value,
    label: label.value,
    ...(isImage && file ? { image: file } : {}),
    ...(is_for_main_page ? { for_main_page: forMainPage.value } : {})

  })
}

function removeItem() {
  emit('remove', {
    id: itemData.id
  })
}

watch(image, (newFile) => {
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
    <div class="w-100 mb-2">
      <p class="mb-2 text-body-1">Изображение<label class="text-admin-red text-body-1">*</label></p>
      <v-file-input
          v-model="image"
          variant="outlined"
          :prepend-icon="false"
          placeholder="Перетащите сюда файл или выберите"
          :rules="[
            ...(isEdit && typeof image === 'string' ? [] : [rules.required, rules.imageOnly]),
          ]"
          accept="image/jpeg, image/png, image/webp"
          rounded="lg"
      />
    </div>

    <div class="d-flex justify-center  rounded-lg bg-admin-grey-dark-1" :class="{'pa-4 border-card mb-6': isEdit ? image : previewUrl }">
      <v-img
          v-if="previewUrl || (isEdit && typeof image === 'string')"
          :src="previewUrl || image"
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
            color="primary"
            :rules="[rules.required]"
        >
        </v-text-field>
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