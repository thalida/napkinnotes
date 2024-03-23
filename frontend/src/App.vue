<script setup lang="ts">
import { ref } from 'vue'
import { RouterView } from 'vue-router'
import { useAuthStore } from './stores/auth'
import { useUIStore } from './stores/ui'
import { useCoreStore } from './stores/core'
import { onMounted, watchEffect } from 'vue';

const uiStore = useUIStore()
const authStore = useAuthStore()
const coreStore = useCoreStore()
const isLoading = ref(true)

onMounted(() => {
  uiStore.initTheme()
  authStore.silentLogin().finally(() => {
    isLoading.value = false
    console.log('isLoading', isLoading.value)
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
  <div v-else>
    Loading...
  </div>
</template>

<style scoped>
</style>
