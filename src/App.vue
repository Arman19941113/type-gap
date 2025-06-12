<script setup lang="ts">
import { computed, ref } from 'vue'
import ReloadPWA from './components/ReloadPWA.vue'
import Toast from './components/Toast.vue'

const toast = ref<InstanceType<typeof Toast> | null>(null)
const inputText = ref('')

const triggerToast = (message: string) => {
  toast.value?.show(message)
}

// 处理文本：在中文和英文以及数字之间添加空格
const processedText = computed(() => {
  if (!inputText.value) return ''
  
  return inputText.value
    // 中文后跟英文/数字，添加空格
    .replace(/([\u4e00-\u9fa5])([a-zA-Z0-9])/g, '$1 $2')
    // 英文/数字后跟中文，添加空格
    .replace(/([a-zA-Z0-9])([\u4e00-\u9fa5])/g, '$1 $2')
    // 清理多余的空格，但保留换行符
    .replace(/[ \t]+/g, ' ')
    .trim()
})

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

const inputTextArea = ref<HTMLTextAreaElement | null>(null)
const outputDiv = ref<HTMLDivElement | null>(null)

let isSyncingScroll = false

const handleScroll = (event: Event) => {
  if (isSyncingScroll) {
    isSyncingScroll = false
    return
  }

  isSyncingScroll = true

  const source = event.target as HTMLElement
  const target = source === inputTextArea.value ? outputDiv.value : inputTextArea.value

  if (target) {
    target.scrollTop = source.scrollTop
    target.scrollLeft = source.scrollLeft
  }
}
</script>

<template>
  <ReloadPWA />
  <Toast ref="toast" />
  <div class="min-h-screen bg-gray-50 py-8 px-4">
    <div class="max-w-6xl mx-auto">
      <!-- 标题 -->
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-gray-800 mb-2">文本格式化工具</h1>
        <p class="text-gray-600">自动在中文和英文、数字之间添加空格</p>
      </div>
      
      <!-- 主要内容区域 -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- 输入区域 -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-xl font-semibold text-gray-800">输入内容</h2>
            <div class="flex gap-2">
              <button
                @click="handlePaste"
                class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
              >
                📋 粘贴
              </button>
              <button
                @click="clearInput"
                class="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm"
              >
                🗑️ 清空
              </button>
            </div>
          </div>
          
          <textarea
            ref="inputTextArea"
            @scroll="handleScroll"
            v-model="inputText"
            placeholder="请输入需要处理的文本，或点击粘贴按钮..."
            class="w-full h-64 p-4 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          ></textarea>
          
          <div class="mt-2 text-sm text-gray-500">
            字符数：{{ inputText.length }}
          </div>
        </div>
        
        <!-- 输出区域 -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-xl font-semibold text-gray-800">处理结果</h2>
            <button
              @click="handleCopy"
              :disabled="!processedText"
              class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              📄 复制
            </button>
          </div>
          
          <div
            ref="outputDiv"
            @scroll="handleScroll"
            class="w-full h-64 p-4 border border-gray-300 rounded-lg bg-gray-50 overflow-y-auto whitespace-pre-wrap"
          >
            <span v-if="processedText" class="text-gray-800">{{ processedText }}</span>
            <span v-else class="text-gray-400">处理结果将显示在这里...</span>
          </div>
          
          <div class="mt-2 text-sm text-gray-500">
            字符数：{{ processedText.length }}
          </div>
        </div>
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
