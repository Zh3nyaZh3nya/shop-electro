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
</script>

<template>
  <AdminFieldsHeader
    :is-edit="isEdit"
    :title="label"
    @remove="removeItem"
  />
  <v-form
    ref="formRef"
    @submit.prevent="submitForm"
  >
    <AdminFieldsImageOrVideoGallery
        v-if="isImage"
        v-model="previewUrl"
        label="Галерея превью"
        :required="true"
        :multiple="true"
        accept="image/jpeg, image/png, image/webp"
    />

    <AdminFieldsMainBlock
      v-model:title="label"
      v-model:active="active"
      v-model:for-main-page="forMainPage"
      :is_for_main_page="is_for_main_page"
      :is_description="false"
    >
      <template #beforeSwitches>
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
      </template>
    </AdminFieldsMainBlock>

    <AdminFieldsFormActions />
  </v-form>
</template>

<style scoped>

</style>