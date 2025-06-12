<script setup lang="ts">
import { nextTick, ref, watch } from 'vue';

const props = withDefaults(defineProps<{
  duration?: number
}>(), {
  duration: 2000
})

const isVisible = ref(false)
const message = ref('')

let timer: number | undefined

const show = async (msg: string) => {
  if (isVisible.value) {
    isVisible.value = false
    await nextTick()
  }
  message.value = msg
  isVisible.value = true
}

defineExpose({
  show
})

watch(isVisible, (newValue) => {
  if (newValue) {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      isVisible.value = false
    }, props.duration)
  }
})
</script>

<template>
  <Transition
    enter-active-class="transition-all duration-300 ease-out"
    leave-active-class="transition-all duration-300 ease-in"
    enter-from-class="transform -translate-y-full opacity-0"
    enter-to-class="transform translate-y-0 opacity-100"
    leave-from-class="transform translate-y-0 opacity-100"
    leave-to-class="transform -translate-y-full opacity-0"
  >
    <div
      v-if="isVisible"
      class="fixed top-0 left-1/2 -translate-x-1/2 mt-4 bg-gray-900/50 backdrop-blur-sm text-white text-center py-3 px-6 rounded-lg shadow-lg z-50"
      role="alert"
    >
      {{ message }}
    </div>
  </Transition>
</template>
