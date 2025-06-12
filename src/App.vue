<script setup lang="ts">
import { computed, ref } from 'vue'
import ReloadPWA from './components/ReloadPWA.vue'
import TextPanel from './components/TextPanel.vue'
import Toast from './components/Toast.vue'
import { useScrollSync } from './composables/useScrollSync'
import { useTextProcessor } from './composables/useTextProcessor'

const toast = ref<InstanceType<typeof Toast> | null>(null)
const inputText = ref('')
const { processedText } = useTextProcessor(inputText)

const triggerToast = (message: string) => {
  toast.value?.show(message)
}

// 处理文本：在中文和英文以及数字之间添加空格
// 文本处理逻辑已移至 useTextProcessor.ts

// 粘贴功能
const handlePaste = async () => {
  try {
    const text = await navigator.clipboard.readText()
    inputText.value = text
    triggerToast('已粘贴内容')
  } catch (err) {
    triggerToast('粘贴失败，请手动输入')
  }
}

// 复制功能
const handleCopy = async () => {
  if (!processedText.value) {
    triggerToast('没有可复制的内容')
    return
  }
  
  try {
    await navigator.clipboard.writeText(processedText.value)
    triggerToast('已复制到剪贴板')
  } catch (err) {
    triggerToast('复制失败')
  }
}

// 清空输入
const clearInput = () => {
  inputText.value = ''
}

const inputPanel = ref<InstanceType<typeof TextPanel> | null>(null)
const outputPanel = ref<InstanceType<typeof TextPanel> | null>(null)

const inputTextArea = computed(() => inputPanel.value?.elementRef)
const outputDiv = computed(() => outputPanel.value?.elementRef)

const { handleScroll } = useScrollSync(inputTextArea, outputDiv)
</script>

<template>
  <ReloadPWA />
  <Toast ref="toast" />
  <div class="min-h-screen bg-gray-50 py-8 px-4">
    <div class="max-w-6xl mx-auto">
      <!-- 标题 -->
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-gray-800 mb-2">TypeGap: 文字排版工具</h1>
        <p class="text-gray-600">自动在中文和英文、数字之间添加空格</p>
      </div>
      
      <!-- 主要内容区域 -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- 输入区域 -->
        <TextPanel
          ref="inputPanel"
          v-model="inputText"
          title="输入内容"
          placeholder="请输入需要处理的文本，或点击粘贴按钮..."
          @paste="handlePaste"
          @clear="clearInput"
          @scroll="handleScroll"
        />
        
        <!-- 输出区域 -->
        <TextPanel
          ref="outputPanel"
          :model-value="processedText"
          title="处理结果"
          is-output
          @copy="handleCopy"
          @scroll="handleScroll"
        />
      </div>
      
      <!-- 使用说明 -->
      <div class="mt-8 bg-white rounded-lg shadow-md p-6">
        <h3 class="text-lg font-semibold text-gray-800 mb-3">使用说明</h3>
        <div class="text-gray-600 space-y-2">
          <p>• 本工具会自动在中文和英文、数字之间添加空格，提升文本可读性</p>
          <p>• 点击"粘贴"按钮可以直接粘贴剪贴板内容</p>
          <p>• 点击"复制"按钮可以将处理结果复制到剪贴板</p>
          <p>• 支持实时预览处理结果</p>
        </div>
        
        <div class="mt-4 p-4 bg-blue-50 rounded-lg">
          <h4 class="font-medium text-blue-800 mb-2">示例：</h4>
          <div class="text-sm text-blue-700">
            <div>输入：<code class="bg-white px-2 py-1 rounded">Hello世界123测试</code></div>
            <div>输出：<code class="bg-white px-2 py-1 rounded">Hello 世界 123 测试</code></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 额外的样式如果需要的话可以在这里添加 */
</style>
