<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth';
import { useCoreStore } from '@/stores/core';
import LoginDialog from '@/components/LoginDialog.vue'
import AppThemeSwitcher from '@/components/AppThemeSwitcher.vue'

const authStore = useAuthStore()
const coreStore = useCoreStore()
const isLoginDialogVisible = ref(false)

function handleLoginDialogDismiss() {
  isLoginDialogVisible.value = false
}

function handleLogoutButtonClick() {
  coreStore.clearData()
  authStore.logout()
}

function handleLoginButtonClick() {
  isLoginDialogVisible.value = true
}
</script>

<template>
  <div :class="$attrs.class" class="flex flex-row justify-between items-center">
    <button
      v-if="authStore.isAuthenticated"
      class="bg-red-500 text-white font-semibold py-2 px-4 rounded"
      @click="handleLogoutButtonClick"
    >
      Logout
    </button>
    <button
      v-else
      class="bg-indigo-500 text-white font-semibold py-2 px-4 rounded"
      @click="handleLoginButtonClick"
    >
      Show Login Dialog
    </button>
    <AppThemeSwitcher />
  </div>
  <LoginDialog :isVisible="isLoginDialogVisible" @onDismiss="handleLoginDialogDismiss" />
</template>

<style scoped>
</style>
