<script setup lang="ts">
import { ref } from 'vue'
import { onMounted, watchEffect } from 'vue'
import { RouterView } from 'vue-router'
import { useAuthStore } from './stores/auth'
import { useUIStore } from './stores/ui'
import { useCoreStore } from './stores/core'
import NapkinNotesLogo from './components/icons/NapkinNotesLogo.vue'

const uiStore = useUIStore()
const authStore = useAuthStore()
const coreStore = useCoreStore()
const isLoading = ref(true)

onMounted(() => {
  uiStore.initTheme()
  authStore.silentLogin().finally(() => {
    isLoading.value = false
  })
})

watchEffect(() => {
  if (isLoading.value) {
    return
  }

  if (authStore.isAuthenticated) {
    coreStore.initUser()
  } else {
    coreStore.initAnon()
  }
})
</script>

<template>
  <RouterView v-if="!isLoading" />
  <div
    v-else
    class="flex flex-col gap-4 items-center justify-center w-full h-full bg-gradient-to-br from-slate-300 via-blue-200 to-sky-20 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950"
  >
    <NapkinNotesLogo
      class="animate-grow-spin relative inline-block w-16 h-16 rounded-lg drop-shadow-xl"
    />
  </div>
</template>

<style scoped>
.animate-grow-spin {
  -webkit-animation: grow 3s linear infinite;
  animation: grow 3s linear infinite;
}

@keyframes grow {
  0% {
    transform: scale(1) rotate(0deg);
  }
  33% {
    transform: scale(1.5) rotate(-30deg);
  }
  66% {
    transform: scale(1.5) rotate(20deg);
  }
  100% {
    transform: scale(1) rotate(0deg);
  }
}

.animate-flipx {
  -webkit-animation: flipX 2s linear infinite;
  animation: flipX 2s linear infinite;
}

@keyframes flipX {
  0% {
    transform: perspective(200px) rotateX(0deg) rotateY(0deg);
  }
  50% {
    transform: perspective(200px) rotateX(-180deg) rotateY(0deg);
  }
  100% {
    transform: perspective(200px) rotateX(-180deg) rotateY(-180deg);
  }
}
</style>
