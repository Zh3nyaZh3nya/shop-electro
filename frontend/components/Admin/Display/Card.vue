<script setup lang="ts">
import { ref } from "vue";
import { rules } from "~/components/Admin/Display/Props"
import { slugify } from "~/utils/slugify";
import { processFileWithFlags } from '~/utils/processFile'
import type { BaseEmitFn, BaseItem, DisplayProps } from "~/components/Admin/Display/Props";

const {
  action,
  item: itemProps,
  last_id,
  is_video,
  isImage,
  is_for_main_page,
  is_link
} = defineProps<
    DisplayProps<BaseItem>
>()

const emit = defineEmits<BaseEmitFn<BaseItem>>()

const formRef = ref()
const isEdit = action === 'edit'
const itemData: BaseItem = itemProps ?? {
  id: last_id ?? 1,
  title: '',
  slug: '',
  description: '',
  active: true,
  ...(is_for_main_page ? { for_main_page: false } : {}),
  ...(is_link ? { link: '', link_external: false, link_text: '' } : {}),
  ...(isImage  ? { image: '' } : {}),
  ...(is_video ? { video: '' } : {}),
}

const title = ref<string>(isEdit ? itemData.title : '')
const description = ref<string>(isEdit ? itemData.description : '')
const link = ref<string>(isEdit ? itemData.link ?? '' : '')
const linkText = ref<string>(isEdit ? itemData.link_text ?? '' : '')
const linkVideo = ref<string>(isEdit ? itemData.link_video ?? '' : '')
const linkExternal = ref<boolean>(isEdit ? itemData.link_external ?? false : false)
const active = ref<boolean>(isEdit ? itemData.active : true)
const forMainPage = ref<boolean>(isEdit ? itemData.for_main_page ?? false : false)
const fileImageOrVideo = ref<File | string | null>(isEdit ? (itemData.image || itemData.video) ?? '' : null)

async function submitForm() {
  const { valid } = await formRef?.value.validate()
  if (!valid) return

  const { processedFile, clearImage, clearVideo } = processFileWithFlags(
      fileImageOrVideo.value,
      title.value,
      isImage
  )

  emit('updateData', {
    id: itemData.id,
    title: title.value,
    slug: slugify(title.value),
    description: description.value,
    active: active.value,
    ...(
        processedFile
            ? processedFile.type.startsWith('video/')
                ? { video: processedFile }
                : { image: processedFile }
            : {}
    ),
    ...(clearImage ? { image: null } : {}),
    ...(clearVideo ? { video: null } : {}),
    ...(is_video && linkVideo ? { link_video: linkVideo.value } : {}),
    ...(is_for_main_page ? { for_main_page: forMainPage.value } : {}),
    ...(is_link ? { link: link.value, link_external: linkExternal.value, link_text: linkText.value } : {}),

  })
}

function removeItem() {
  emit('remove', {
    id: itemData.id
  })
}
</script>

<template>
  <AdminFieldsHeader
    :is-edit="isEdit"
    :title="title"
    @remove="removeItem"
  />
  <v-form
      ref="formRef"
      @submit.prevent="submitForm"
  >
    <AdminFieldsImageOrVideoGallery
        v-if="isImage || is_video"
        v-model="fileImageOrVideo"
        :label="isImage && is_video ? 'Изображения или видео' : isImage ? 'Изображение' : is_video ? 'Видео' : ''"
        :required="true"
        :multiple="false"
        :is-edit="isEdit"
        :accept="
          isImage && is_video ?
            'image/jpeg,image/png,image/webp,video/mp4,video/webm,video/ogg' :
              isImage ?
                'image/jpeg,image/png,image/webp' :
                  is_video ?
                    'video/mp4,video/webm,video/ogg' : ''
        "
    />

    <AdminFieldsMainBlock
      v-model:title="title"
      v-model:description="description"
      v-model:active="active"
      v-model:for-main-page="forMainPage"
      :is_for_main_page="is_for_main_page"
    >
      <template #default>
        <div class="d-flex justify-space-between w-100 ga-4">
          <div class="w-100">
            <p class="mb-2 text-body-1">Ссылка<label class="text-admin-red text-body-1">*</label></p>
            <v-text-field
                v-model="link"
                variant="outlined"
                color="admin-primary"
                placeholder="https://..."
                class="text-field-admin"
                rounded="lg"
                :rules="[() => linkText.length ? rules.required(link) : true]"
            />
          </div>
          <div class="w-100">
            <p class="mb-2 text-body-1">Текст ссылки<label class="text-admin-red text-body-1">*</label></p>
            <v-text-field
                v-model="linkText"
                variant="outlined"
                color="admin-primary"
                placeholder="Открыть"
                class="text-field-admin"
                rounded="lg"
                :rules="[() => link.length ? rules.required(linkText) : true]"
            />
          </div>
          <div class="w-50">
            <p class="mb-2 text-body-1">Ссылка сторонняя?</p>
            <v-checkbox
                v-model="linkExternal"
                :hide-details="true"
                color="admin-primary"
            >
              <template #label>
                <span class="text-body-1 d-inline-block ml-2">Да</span>
              </template>
            </v-checkbox>
          </div>
        </div>
      </template>
    </AdminFieldsMainBlock>

    <AdminFieldsFormActions />
  </v-form>
</template>

<style scoped>

</style>