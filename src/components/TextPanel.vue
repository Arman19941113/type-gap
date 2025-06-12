<script setup lang="ts">
import { computed, defineExpose, ref } from 'vue';

const props = defineProps<{
  modelValue: string
  title: string
  placeholder?: string
  isOutput?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'paste'): void
  (e: 'copy'): void
  (e: 'clear'): void
  (e: 'scroll', event: Event): void
}>()

const charCount = computed(() => props.modelValue.length)

const onInput = (event: Event) => {
  emit('update:modelValue', (event.target as HTMLTextAreaElement).value)
}

const elementRef = ref<HTMLElement | null>(null)
defineExpose({ elementRef })
</script>

<template>
  <div class="bg-white rounded-lg shadow-md p-6">
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-xl font-semibold text-gray-800">{{ title }}</h2>
      <div class="flex gap-2">
        <template v-if="isOutput">
          <button
            @click="$emit('copy')"
            :disabled="!modelValue"
            class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            📄 复制
          </button>
        </template>
        <template v-else>
          <button
            @click="$emit('paste')"
            class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
          >
            📋 粘贴
          </button>
          <button
            @click="$emit('clear')"
            class="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm"
          >
            🗑️ 清空
          </button>
        </template>
      </div>
    </div>

    <div
      v-if="isOutput"
      ref="elementRef"
      @scroll="$emit('scroll', $event)"
      class="w-full h-96 p-4 border border-gray-300 rounded-lg bg-gray-50 overflow-y-auto whitespace-pre-wrap"
    >
      <span v-if="modelValue" class="text-gray-800">{{ modelValue }}</span>
      <span v-else class="text-gray-400">处理结果将显示在这里...</span>
    </div>
    <textarea
      v-else
      ref="elementRef"
      :value="modelValue"
      @input="onInput"
      @scroll="$emit('scroll', $event)"
      :placeholder="placeholder"
      class="w-full h-96 p-4 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
    ></textarea>

    <div class="mt-2 text-sm text-gray-500">
      字符数：{{ charCount }}
    </div>
  </div>
</template> 
