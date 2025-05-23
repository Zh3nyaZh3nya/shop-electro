<script setup lang="ts">
import { ref } from "vue";
import { slugify } from "~/utils/slugify";
import { processFiles } from "~/utils/processFile";
import type { BaseEmitFn, News, DisplayProps } from "~/components/Admin/Display/Props";

const {
  action,
  item: itemProps,
  last_id,
  is_for_main_page,
} = defineProps<
    DisplayProps<News>
>()

const emit = defineEmits<BaseEmitFn<News>>()

const formRef = ref()
const isEdit = action === 'edit'
const itemData: News = itemProps ?? {
  id: last_id ?? 1,
  image: '',
  title: '',
  slug: '',
  description: '',
  active: true,
  ...(is_for_main_page ? { for_main_page: true } : {}),
}

const image = ref<(File | string)[]>(isEdit ? itemData.image : '')
const title = ref<string>(isEdit ? itemData.title : '')
const description = ref<string>(isEdit ? itemData.description : '')
const active = ref<boolean>(isEdit ? itemData.active : true)
const forMainPage = ref<boolean>(false)

const empty = ref()

async function submitForm() {
  const { valid } = await formRef.value?.validate?.() ?? { valid: true }
  console.log(0)
  if (
      !Array.isArray(image.value)
          ? !image.value
          : !image.value.length
  ) {
    empty.value = true
    return
  }

  console.log(1)
  if (!valid) {
    return
  }

  console.log(2)
  const processedImage = processFiles(image.value, 'image')

  const payload: News = {
    id: itemData.id,
    image: processedImage as (File | string)[],
    title: title.value,
    slug: slugify(title.value),
    description: description.value,
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
    <AdminFieldsImageOrVideoGallery
        v-if="isImage"
        v-model="image"
        label="Изображение"
        :required="true"
        :multiple="false"
        accept="image/jpeg, image/png, image/webp"
        :is-open-panel="empty"
    />

    <AdminFieldsMainBlock
        v-if="action === 'edit' ? title : true"
        v-model:title="title"
        v-model:description="description"
        v-model:active="active"
        v-model:forMainPage="forMainPage"
        :is_for_main_page="is_for_main_page"
    />

    <AdminFieldsFormActions />
  </v-form>
</template>

<style scoped>

</style>