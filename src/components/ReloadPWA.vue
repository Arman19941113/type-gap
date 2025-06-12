<script setup lang="ts">
import { useRegisterSW } from 'virtual:pwa-register/vue'

const { needRefresh, updateServiceWorker } = useRegisterSW()

const handleUpdate = async () => {
  await updateServiceWorker()
}
</script>

<template>
  <transition name="slide-fade">
    <div
      v-if="needRefresh"
      class="fixed top-4 left-4 z-50 p-4 bg-white rounded-lg shadow-lg flex items-center space-x-4"
    >
      <p class="text-gray-800">有新内容可用，点击更新。</p>
      <button
        @click="handleUpdate"
        class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
      >
        刷新
      </button>
    </div>
  </transition>
</template>

<style scoped>
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.5s ease;
}
.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}
</style> 
