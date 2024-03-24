<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth';
import { useCoreStore } from '@/stores/core';
import NapkinApp from '@/components/NapkinApp.vue'
import LoginDialog from '@/components/LoginDialog.vue'


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
  <div class="flex flex-col h-full max-h-full bg-white dark:bg-slate-900">

    <div class="grow overflow-auto">
      <NapkinApp
        v-if="coreStore.note"
        :key="coreStore.note.id"
        class="p-8 prose grow h-full w-full max-w-full border-slate-100 dark:text-white overflow-y-auto focus:outline-none" />
    </div>

    <div class="p-4 shrink-0 dark:bg-slate-950">
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
    </div>

    <LoginDialog :isVisible="isLoginDialogVisible" @onDismiss="handleLoginDialogDismiss" />
  </div>
</template>

<style scoped>
</style>
