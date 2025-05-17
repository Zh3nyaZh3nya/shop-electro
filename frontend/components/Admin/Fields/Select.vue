<script setup lang="ts">
import { ref, watch } from 'vue'
import type { BaseItemEnum } from '~/components/Admin/Display/Props'

const props = defineProps<{
  modelValue: {
    category: BaseItemEnum
    subcategory?: BaseItemEnum['subcategories'][number]
  } | null
  items: BaseItemEnum[]
  label?: string
  rules?: ((value: any) => boolean | string)[]
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: { category: BaseItemEnum, subcategory?: BaseItemEnum['subcategories'][number] } | null): void
}>()

const selectRef = ref()
const selected = ref<BaseItemEnum['value'] | null>(
    props.modelValue?.subcategory?.value || props.modelValue?.category?.value || null
)

watch(() => props.modelValue, val => {
  selected.value = val?.subcategory?.value || val?.category?.value || null
})

function handleSelect(value: string) {
  for (const cat of props.items) {
    const sub = cat.subcategories?.find(s => s.value === value)
    if (sub) {
      emit('update:modelValue', { category: cat, subcategory: sub })
      selected.value = sub.value
      selectRef.value?.blur?.()
      return
    }
    if (cat.value === value && (!cat.subcategories || cat.subcategories.length === 0)) {
      emit('update:modelValue', { category: cat })
      selected.value = cat.value
      selectRef.value?.blur?.()
      return
    }
  }
}
</script>

<template>
  <v-select
      ref="selectRef"
      class="text-field-admin"
      rounded="lg"
      :label="label ?? 'Выбрать'"
      :items="items"
      item-title="label"
      item-value="value"
      variant="outlined"
      :rules="rules"
      v-model="selected"
      @update:modelValue="handleSelect"
      :menu-props="{ class: 'select-menu', offset: 10 }"
  >
    <template #selection>
      <span>
        {{
          `${modelValue?.category?.label}: ${modelValue?.subcategory?.label}`
          || 'Выбрать'
        }}
      </span>
    </template>

    <template #item="{ item }">
      <div class="ma-2">
        <p class="text-admin-grey-light-1" style="pointer-events: none">{{ item.raw.label }}</p>
        <ul class="ml-6">
          <li
              v-for="sub in item.raw.subcategories"
              :key="sub.id"
              class="text-body-1 my-1 link-hover-admin cursor-pointer"
              @click.stop="handleSelect(sub.value)"
          >
            {{ sub.label }}
          </li>
        </ul>
      </div>
    </template>
  </v-select>
</template>
