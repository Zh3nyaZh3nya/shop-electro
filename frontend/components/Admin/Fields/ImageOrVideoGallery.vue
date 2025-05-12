<script setup lang="ts">
import { ref, watch, computed } from 'vue'

const props = defineProps<{
  modelValue: (File | string)[] | File | string
  label?: string
  required?: boolean
  multiple?: boolean
  accept?: string
  isEdit?: boolean
  isOpenPanel: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: (File | string)[] | File | string): void
}>()

const localFiles = ref<(File | string)[]>([])
const dummyInput = ref<File[] | File | null>(null)

const panelOpenIndexes = ref<number[]>([])

function handleFileInput(newInput: File[] | File | null) {
  const files: File[] = newInput instanceof File ? [newInput] :
      Array.isArray(newInput) ? newInput : []

  const newFiles = files.filter(file =>
      !localFiles.value.some(existing =>
          existing instanceof File &&
          file.name === existing.name &&
          file.size === existing.size &&
          file.type === existing.type
      )
  )

  if (!newFiles.length) return

  const updated = props.multiple ? [...localFiles.value, ...newFiles] : [newFiles[0]]
  localFiles.value = updated
  emit('update:modelValue', props.multiple ? updated : updated[0])
}

function removeFile(index: number) {
  localFiles.value.splice(index, 1)
  if (localFiles.value.length === 0) dummyInput.value = null
  emit('update:modelValue', localFiles.value)
}

function isFileLike(f: unknown): f is File {
  return typeof f === 'object' && f !== null && 'name' in f && 'size' in f && 'type' in f
}

function getObjectUrl(file: File | string): string {
  return typeof file === 'string' ? file : URL.createObjectURL(file)
}

const inputRules = computed(() => {
  if (!props.required || localFiles.value.length > 0) return []

  return [
    (value: File[] | File | string | (File | string)[]) => {
      const files = Array.isArray(value) ? value : [value].filter(Boolean)

      if (!files.length) return 'Файл обязателен'

      const allowedTypes = props.accept?.split(',').map(t => t.trim()) ?? []

      const isValidFormat = files.every((f) => {
        if (typeof f === 'string') return true
        if (f && typeof f === 'object' && 'type' in f) {
          return allowedTypes.includes((f as File).type)
        }
        return false
      })

      if (!isValidFormat) return `Разрешены только: ${allowedTypes.join(', ')}`
      return true
    }
  ]
})

watch(() => props.modelValue, (val) => {
  if (val == null) {
    localFiles.value = []
  } else if (Array.isArray(val)) {
    localFiles.value = val
  } else {
    localFiles.value = [val]
  }

  dummyInput.value = null
}, { immediate: true })

watch(() => props.isOpenPanel, (val) => {
  if (val) {
    panelOpenIndexes.value = [0]
  } else {
    panelOpenIndexes.value = []
  }
}, { immediate: true })
</script>

<template>
  <div class="mb-4">
    <v-expansion-panels
        color="admin-grey-dark-1"
        elevation="0"
        v-model="panelOpenIndexes"
    >
      <v-expansion-panel color="admin-grey-dark-1" rounded="lg" elevation="0">
        <v-expansion-panel-title>
          <p class="text-body-1">
            {{ label }}
            <label v-if="required" class="text-admin-red text-body-1">*</label>
          </p>
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <v-card color="admin-grey-dark-1" class="pa-4 rounded-b-lg rounded-t-0" elevation="0">
            <v-file-input
                v-model="dummyInput"
                :multiple="multiple"
                :accept="accept"
                placeholder="Перетащите сюда файл или выберите"
                :prepend-icon="''"
                variant="outlined"
                class="text-field-admin"
                rounded="lg"
                :rules="inputRules"
                @update:modelValue="handleFileInput"
            />

            <div
                v-if="localFiles.length"
                class="d-flex justify-center flex-wrap rounded-lg bg-admin-grey-dark-1 ga-4"
                :class="{ 'pa-4 border-card mb-6': localFiles.length > 0 }"
            >
              <div
                  v-for="(file, idx) in localFiles"
                  :key="typeof file === 'string' ? file : file.name + file.size"
                  class="position-relative my-4"
              >
                <template v-if="typeof file === 'string'">
                  <v-img
                      v-if="/\.(jpe?g|png|webp)$/i.test(file)"
                      :src="file"
                      width="300px"
                      height="100%"
                      cover
                      class="rounded"
                  />
                  <video
                      v-else-if="/\.(mp4|webm|ogg)$/i.test(file)"
                      :src="file"
                      controls
                      width="300"
                      height="100%"
                      class="rounded"
                  />
                </template>

                <template v-else-if="isFileLike(file)">
                  <v-img
                      v-if="file.type.startsWith('image/')"
                      :src="getObjectUrl(file)"
                      width="300px"
                      height="100%"
                      cover
                      class="rounded"
                  />
                  <video
                      v-else-if="file.type.startsWith('video/')"
                      :src="getObjectUrl(file)"
                      controls
                      width="300"
                      class="rounded"
                  />
                </template>

                <v-btn
                    icon
                    size="x-small"
                    class="position-absolute bg-transparent"
                    elevation="0"
                    style="top: 4px; right: 4px;"
                    @click="removeFile(idx)"
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
</template>
