import { computed, type Ref } from 'vue'

export function useTextProcessor(inputText: Ref<string>) {
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

  return {
    processedText
  }
} 
