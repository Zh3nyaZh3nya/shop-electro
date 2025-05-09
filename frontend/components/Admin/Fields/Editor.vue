<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'

const { modelValue, rules } = defineProps<{
  modelValue: string
  rules?: ((v: string) => true | string)[]
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const html = ref(modelValue)
const editorRef = ref<HTMLDivElement>()
const isFocused = ref(false)
const errorMessages = ref<string[]>([])

function format(command: string, value: string | null = null) {
  document.execCommand(command, false, value)
  updateActiveCommands()
}

function validate() {
  const rawHtml = html.value ?? ''
  const cleaned = rawHtml
      .replace(/<[^/>][^>]*><br><\/[^>]+>/gi, '')
      .replace(/<[^>]+>/g, '')
      .trim()

  if (!rules?.length) return true

  const errors = rules
      .map(rule => rule(cleaned))
      .filter(result => result !== true) as string[]

  errorMessages.value = errors
  return errors.length === 0
}

function handleInput(e: Event) {
  html.value = (e.target as HTMLElement).innerHTML
  emit('update:modelValue', html.value)
  updateActiveCommands()
}

function updateActiveCommands() {
  const commands = ['bold', 'italic', 'underline', 'insertUnorderedList', 'formatBlock']
  activeCommands.value = commands.filter(cmd => {
    if (cmd === 'formatBlock') {
      return document.queryCommandValue('formatBlock') === 'h1'
    }
    return document.queryCommandState(cmd)
  })
}

const activeCommands = ref<string[]>([])

onMounted(() => {
  if (editorRef.value) {
    editorRef.value.innerHTML = html.value

    editorRef.value.addEventListener('focus', () => {
      isFocused.value = true
    })

    editorRef.value.addEventListener('blur', () => {
      isFocused.value = false
      validate()
    })

    editorRef.value.addEventListener('mouseup', updateActiveCommands)
    editorRef.value.addEventListener('keyup', updateActiveCommands)
  }
})

watch(() => modelValue, () => {
  validate()
})

watch(() => modelValue, (newVal) => {
  if (newVal !== html.value) {
    html.value = newVal
    if (editorRef.value) {
      editorRef.value.innerHTML = newVal
    }
  }
})

defineExpose({ validate })
</script>

<template>
  <p class="mb-2 text-body-1">Описание<label class="text-admin-red text-body-1">*</label></p>
  <v-card elevation="0" color="transparent">
    <v-toolbar
        density="compact"
        class="editor-header rounded-t-lg"
        color="admin-grey-dark-2"
        :class="{ 'editor-header--focused': isFocused, 'editor-header--error': errorMessages.length }"
    >
      <v-btn
          icon
          :color="activeCommands.includes('bold') ? 'admin-primary' : undefined"
          @click="format('bold')"
      ><v-icon>mdi-format-bold</v-icon></v-btn>

      <v-btn
          icon
          :color="activeCommands.includes('italic') ? 'admin-primary' : undefined"
          @click="format('italic')"
      ><v-icon>mdi-format-italic</v-icon></v-btn>

      <v-btn
          icon
          :color="activeCommands.includes('underline') ? 'admin-primary' : undefined"
          @click="format('underline')"
      ><v-icon>mdi-format-underline</v-icon></v-btn>
    </v-toolbar>

    <div
        ref="editorRef"
        class="wysiwyg pa-4 rounded-b-lg"
        :class="{ 'wysiwyg-error': errorMessages.length }"
        contenteditable
        @input="handleInput"
        style="min-height: 200px; max-height: 1000px"
    />

    <v-messages
        v-if="errorMessages.length"
        :messages="errorMessages"
        class="mt-2 text-error ml-4"
        active
    />
  </v-card>
</template>


<style lang="scss">
.wysiwyg {
  border: 1px solid rgb(var(--v-theme-admin-grey-light-2));
  border-top: none;
  margin-top: -2px;
  &-error {
    border: 1px solid rgb(var(--v-theme-error))
  }
}
.wysiwyg:focus {
  border: 1px solid rgb(var(--v-theme-admin-primary));
  outline: none;
}

.editor-header {
  border: 1px solid rgb(var(--v-theme-admin-grey-light-2));
  border-bottom: none;
  border-radius: 6px 6px 0 0;
  &--focused {
    border: 1px solid rgb(var(--v-theme-admin-primary)) !important;
    border-bottom: none !important;
  }
  &--error {
    border: 1px solid rgb(var(--v-theme-error));
    border-bottom: none;
  }
}

</style>
