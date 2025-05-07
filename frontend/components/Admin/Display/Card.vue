<script setup lang="ts">
import { ref } from "vue";
import { rules } from "~/components/Admin/Display/Props"
import type { BaseEmitFn, BaseItem, DisplayProps } from "~/components/Admin/Display/Props";
import {slugify} from "~/utils/slugify";

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
const editorRef = ref()
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
const fileImageOrVideo = ref<File | null>(null)
const previewUrl = ref<string | null>(
    isEdit && typeof itemData.image === 'string'
        ? itemData.image
        : isEdit && typeof itemData.video === 'string'
            ? itemData.video
            : null
)

async function submitForm() {
  const { valid } = await formRef?.value.validate()
  if (!valid) return

  let uploadFileImage = fileImageOrVideo.value
  let processedFile: File | null = null

  if (uploadFileImage instanceof File) {
    const ext = uploadFileImage.name.split('.').pop()?.toLowerCase() || (isImage ? 'webp' : 'mp4')
    const baseName = slugify(title.value || (isImage ? 'image' : 'video'))
    const safeName = `${baseName}-${Date.now()}.${ext}`
    processedFile = new File([uploadFileImage], safeName, { type: uploadFileImage.type })
  }

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

watch(fileImageOrVideo, (newFile) => {
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
    <v-card class="bg-admin-grey-dark-1 pa-4" rounded="lg">
      <div class="w-100 mb-2" v-if="isImage">
        <p class="mb-2 text-body-1">
          {{ isImage && is_video
            ? 'Изображение или Видео'
            : isImage
                ? 'Изображение'
                : is_video
                    ? 'Видео'
                    : ''
          }}<label class="text-admin-red text-body-1">*</label>
        </p>
        <v-file-input
            v-model="fileImageOrVideo"
            variant="outlined"
            :prepend-icon="''"
            placeholder="Перетащите сюда файл или выберите"
            :rules="[
              () => {
                if (fileImageOrVideo || linkVideo || previewUrl) return true
                return 'Загрузите файл или укажите ссылку'
              },
              ...(isImage && is_video
                ? [rules.imageOrVideoOnly]
                : isImage
                  ? [rules.imageOnly]
                  : is_video
                    ? [rules.videoOnly]
                    : [])
            ]"
            :accept="[
              isImage && is_video
                ? 'image/jpeg,image/png,image/webp,video/mp4,video/webm,video/ogg'
                : isImage
                  ? 'image/jpeg,image/png,image/webp'
                  : is_video
                    ? 'video/mp4,video/webm,video/ogg'
                    : ''
            ]"
            rounded="lg"
            class="text-field-admin"
        />
      </div>

      <div class="w-100 mb-2 d-flex justify-space-between ga-4" v-if="is_video">
        <div class="w-100">
          <p class="mb-2 text-body-1">Ссылка на видео<label class="text-admin-red text-body-1">*</label></p>
          <v-text-field
              v-model="linkVideo"
              variant="outlined"
              placeholder="http://..."
              :disabled="Boolean(fileImageOrVideo)"
              color="admin-primary"
              width="100%"
              :rules="[
                () => {
                  if (fileImageOrVideo || linkVideo || previewUrl) return true
                  return 'Укажите ссылку или загрузите видео'
                }
              ]"
              rounded="lg"
              class="text-field-admin"
          />
        </div>
      </div>

      <p class="mt-4 mb-2 text-body-1" v-if="previewUrl">Превью</p>
      <div class="d-flex justify-center border-card rounded-lg pa-4" v-if="previewUrl">
        <template v-if="fileImageOrVideo">
          <v-img
              v-if="fileImageOrVideo.type?.startsWith('image/') || /\.(jpe?g|png|webp)$/i.test(fileImageOrVideo.name)"
              :src="previewUrl"
              max-width="300"
              max-height="200"
              class="rounded-lg"
              cover
          />
          <video
              v-else-if="fileImageOrVideo.type?.startsWith('video/') || /\.(mp4|webm|ogg)$/i.test(fileImageOrVideo.name)"
              :src="previewUrl"
              controls
              style="height: 300px; width: 100%; border-radius: 8px;"
          />
        </template>
        <template v-else>
          <v-img
              v-if="/\.(jpe?g|png|webp)$/i.test(previewUrl)"
              :src="previewUrl"
              max-width="300"
              max-height="200"
              class="rounded-lg"
              cover
          />
          <video
              v-else-if="/\.(mp4|webm|ogg)$/i.test(previewUrl)"
              :src="previewUrl"
              controls
              style="height: 300px; width: 100%; border-radius: 8px;"
          />
        </template>
      </div>

    </v-card>

    <v-sheet elevation="0" rounded="lg" class="pa-6" color="admin-grey-dark-1 mt-4">
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

      <div class="d-flex justify-space-between w-100 ga-4">
        <div class="w-100">
          <p class="mb-2 text-body-1">Ссылка</p>
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
          <p class="mb-2 text-body-1">Текст ссылки</p>
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

      <div class="d-flex align-center ga-4" v-if="is_for_main_page">
        <v-switch
            v-model="forMainPage"
            color="admin-primary"
            :hide-details="true"
        />
        <p class="text-body-1">Закрепить для главной страницы</p>
      </div>

      <div class="d-flex align-center ga-4">
        <v-switch
            v-model="active"
            color="admin-primary"
            :hide-details="true"
        />
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