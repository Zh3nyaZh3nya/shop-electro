<script setup lang="ts">
import { ref, watch } from 'vue'
import debounce from 'lodash-es/debounce'
import { rules } from '~/components/Admin/Display/Props'

const props = withDefaults(defineProps<{
  title: string
  description?: string
  is_description: boolean
  active: boolean
  is_for_main_page?: boolean
  forMainPage?: boolean
}>(), {
  description: '',
  is_description: true,
  is_for_main_page: false,
  forMainPage: false
})

const emit = defineEmits<{
  (e: 'update:title', value: string): void
  (e: 'update:description', value: string): void
  (e: 'update:active', value: boolean): void
  (e: 'update:forMainPage', value: boolean): void
}>()

const editRef = ref()

const localTitle = ref(props.title)
const localDescription = ref(props.description)
const active = ref(props.active)
const forMainPage = ref(props.forMainPage ?? false)

const emitTitleDebounced = debounce((val: string) => {
  emit('update:title', val)
}, 300)

const emitDescriptionDebounced = debounce((val: string) => {
  emit('update:description', val)
}, 300)

watch(localTitle, (val) => emitTitleDebounced(val))
watch(localDescription, (val) => emitDescriptionDebounced(val))
watch(active, (val) => emit('update:active', val))
watch(forMainPage, (val) => emit('update:forMainPage', val))
</script>

<template>
  <v-card color="admin-grey-dark-1" class="pa-4 mb-4" rounded="lg" elevation="0">
    <div class="mb-4">
      <p class="mb-2 text-body-1">Заголовок<label class="text-admin-red text-body-1">*</label></p>
      <v-text-field
          v-model="localTitle"
          variant="outlined"
          class="text-field-admin"
          rounded="lg"
          color="admin-primary"
          :rules="[rules.required]"
      />
    </div>

    <div class="mb-4" v-if="is_description">
      <AdminFieldsEditor
          ref="editRef"
          v-model="localDescription"
          :rules="[rules.required]"
      />
    </div>

    <slot name="beforeSwitches"></slot>

    <div class="d-flex ga-8">
      <div class="d-flex align-center ga-4 mb-4" v-if="is_for_main_page">
        <v-switch
            v-model="forMainPage"
            color="admin-primary"
            :hide-details="true"
        />
        <p class="text-body-1">Закрепить для главной страницы</p>
      </div>

      <div class="d-flex align-center ga-4 mb-4">
        <v-switch
            v-model="active"
            color="admin-primary"
            :hide-details="true"
        />
        <p class="text-body-1">Активность</p>
      </div>
    </div>

    <slot />
  </v-card>
</template>
