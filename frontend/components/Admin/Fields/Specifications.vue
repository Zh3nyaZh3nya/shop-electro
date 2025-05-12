<script setup lang="ts">
import { ref, watchEffect, watch } from 'vue'
import { rules } from '~/components/Admin/Display/Props'

const props = defineProps<{
  modelValue: {
    title: string
    specification: { title: string; description: string }[]
  }[]
  isOpenPanel: boolean
}>()

const emit = defineEmits(['update:modelValue'])

const panelOpenIndexes = ref<number[]>([])

function removeSpecBlock(index: number) {
  if (props.modelValue.length > 1) {
    emit('update:modelValue', props.modelValue.toSpliced(index, 1))
  }
}

function removeSpecItem(blockIndex: number, itemIndex: number) {
  const block = props.modelValue[blockIndex]
  if (block.specification.length > 1) {
    const updated = [...props.modelValue]
    updated[blockIndex].specification = block.specification.toSpliced(itemIndex, 1)
    emit('update:modelValue', updated)
  }
}

watchEffect(() => {
  const lastBlock = props.modelValue[props.modelValue.length - 1]
  if (lastBlock.title.trim()) {
    emit('update:modelValue', [
      ...props.modelValue,
      { title: '', specification: [{ title: '', description: '' }] }
    ])
  }

  props.modelValue.forEach((block, blockIndex) => {
    const lastSpec = block.specification[block.specification.length - 1]
    if ((lastSpec.title || lastSpec.description).trim()) {
      const updated = [...props.modelValue]
      updated[blockIndex].specification.push({ title: '', description: '' })
      emit('update:modelValue', updated)
    }
  })
})

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
          <p class="text-body-1">Характеристики<label class="text-admin-red text-body-1">*</label></p>
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <v-card color="admin-grey-dark-1" class="pa-4 rounded-b-lg rounded-t-0" elevation="0">
            <div v-for="(block, blockIndex) in modelValue" :key="blockIndex">
              <div class="d-flex align-center justify-space-between mb-2">
                <p class="text-body-1">
                  Заголовок характеристики
                  <label class="text-admin-red" v-if="blockIndex === 0">*</label>
                </p>
                <v-btn
                    icon
                    size="x-small"
                    class="bg-transparent"
                    elevation="0"
                    @click="removeSpecBlock(blockIndex)"
                    :disabled="modelValue.length <= 1 || blockIndex === modelValue.length - 1"
                >
                  <v-icon icon="mdi-close" />
                </v-btn>
              </div>
              <v-text-field
                  v-model="block.title"
                  placeholder="Например: Функции"
                  variant="outlined"
                  class="text-field-admin mb-4"
                  rounded="lg"
                  :rules="[v => blockIndex === modelValue.length - 1 ? true : rules.required(v)]"
              />

              <div
                  v-for="(spec, specIndex) in block.specification"
                  :key="specIndex"
                  class="d-flex ga-4 align-start mb-4"
              >
                <v-text-field
                    v-model="spec.title"
                    label="Характеристика"
                    placeholder="Стирка с паром"
                    variant="outlined"
                    class="text-field-admin"
                    rounded="lg"
                    :rules="[
                      v => {
                        const isLast = specIndex === block.specification.length - 1
                        const isEmpty = !(v || '').trim()
                        return isLast && isEmpty ? true : rules.required(v)
                      }
                    ]"
                    style="flex: 1"
                />
                <v-text-field
                    v-model="spec.description"
                    label="Текст характеристики"
                    placeholder="Да"
                    variant="outlined"
                    class="text-field-admin"
                    rounded="lg"
                    :rules="[
                      v => {
                        const isLast = specIndex === block.specification.length - 1
                        const isEmpty = !(v || '').trim()
                        return isLast && isEmpty ? true : rules.required(v)
                      }
                    ]"
                    style="flex: 1"
                />
                <v-btn
                    icon
                    size="x-small"
                    class="bg-transparent"
                    elevation="0"
                    :disabled="block.specification.length <= 1"
                    @click="removeSpecItem(blockIndex, specIndex)"
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