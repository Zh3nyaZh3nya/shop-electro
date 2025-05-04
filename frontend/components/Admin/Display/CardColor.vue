<script setup lang="ts">
import type { BaseItem, DisplayProps } from '~/components/Admin/Display/Props'

const { action, item: itemProps, last_id } = defineProps<
    DisplayProps<BaseItem & { color: string }>
>()

const emit = defineEmits<{
  (e: 'updateData', value: {
    id: string | number
    title: string
    description: string
    active: boolean
    color: string
  }): void
  (e: 'remove', value: { id: string | number }): void
}>()


const formRef = ref()
const editorRef = ref()
const isEdit = action === 'edit'
const itemData: {
  id: string | number
  title: string
  description: string
  active: boolean
  color: string
} = itemProps ?? {
  id: last_id ?? 1,
  title: '',
  description: '',
  active: false,
  color: ''
}

const title = ref<string>(isEdit ? itemData.title ?? '' : '')
const active = ref<boolean>(isEdit ? itemData.active : true)
const color = ref<string>(isEdit ? itemData.color : '')
const description = ref<string>(isEdit ? itemData.description : '')
const rules = {
  required: (v: any) => !!v || 'Обязательно',
}

async function submitForm() {
  const { valid } = await formRef?.value.validate()
  const editorValid = await editorRef.value?.validate?.()

  if(!valid || !editorValid) {
    return
  }

  emit('updateData', {
    id: itemData.id,
    title: title.value,
    description: description.value,
    active: active.value,
    color: color.value,
  })
}

async function removeItem() {
  emit('remove', {
    id: itemData.id
  })
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
    <v-sheet elevation="0" rounded="lg" class="pa-6" color="admin-grey-dark-1">
      <div class="mb-2 d-flex justify-space-between ga-4">
        <div class="w-100">
          <p class="mb-2 text-body-1">Заголовок<label class="text-admin-red text-body-1">*</label></p>
          <div class="d-flex align-center ga-4">
            <v-text-field
                v-model="title"
                variant="outlined"
                class="text-field-admin"
                width="100%"
                max-width="100%"
                color="primary"
                :rules="[rules.required]"
            />
          </div>
        </div>
        <div style="max-width: 200px; width: 100%">
          <v-menu :close-on-content-click="false">
            <template v-slot:activator="{ props }">
              <div>
                <p class="mb-2 text-body-1">Цвет фона<label class="text-admin-red text-body-1">*</label></p>
                <v-text-field
                    v-model="color"
                    color="primary"
                    v-bind="props"
                    variant="outlined"
                    class="text-field-admin"
                    max-width="200px"
                    placeholder="#fffffff"
                    :readonly="true"
                    :rules="[rules.required]"
                />
              </div>
            </template>
            <v-card
                elevation="0"
                rounded="lg"
                color="admin-grey-dark-1"
            >
              <v-color-picker
                  color="admin-grey-dark-1"
                  v-model="color"
                  :modes="['hex']"
                  class="admin-color-picker"
              />
            </v-card>
          </v-menu>
        </div>
      </div>
      <div class="mb-2">
        <AdminEditor
            ref="editorRef"
            v-model="description"
            :rules="[rules.required]"
        />
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