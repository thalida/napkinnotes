<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useCoreStore } from '@/stores/core'
import LoginDialog from '@/components/LoginDialog.vue'
import AboutDialog from '@/components/AboutDialog.vue'
import AppThemeSwitcher from '@/components/AppThemeSwitcher.vue'
import NapkinNotesLogo from '@/components/icons/NapkinNotesLogo.vue'
import { BIconEscape } from 'bootstrap-icons-vue'

const authStore = useAuthStore()
const coreStore = useCoreStore()
const isLoginDialogVisible = ref(false)
const isAboutDialogVisible = ref(false)

function handleLoginDialogDismiss() {
  isLoginDialogVisible.value = false
}

function handleAboutDialogDismiss() {
  isAboutDialogVisible.value = false
}

function handleLogoutButtonClick() {
  coreStore.clearData()
  authStore.logout()
}

function handleLoginButtonClick() {
  isLoginDialogVisible.value = true
}

function handleLogoButtonClick() {
  isAboutDialogVisible.value = true
}
</script>

<template>
  <div :class="$attrs.class" class="grid grid-cols-3 justify-between items-center">
    <div class="flex flex-row items-center justify-start gap-4">
      <button
        v-if="authStore.isAuthenticated"
        class="flex flex-row items-center justify-center w-5 h-5 hover:opacity-70"
        @click="handleLogoutButtonClick"
      >
        <BIconEscape class="inline-block text-rose-800 w-5 h-5" />
      </button>
      <button
        v-else
        class="bg-gradient-to-br from-pink-700 via-fuchsia-500 to-violet-700 text-white font-semibold py-2 px-4 rounded hover:shadow-lg hover:scale-105 hover:rotate-3 transition ease-in-out duration-200"
        @click="handleLoginButtonClick"
      >
        Log In
      </button>
    </div>
    <div class="flex flex-row items-center justify-center">
      <button
        class="flex flex-row items-center justify-center hover:scale-110 hover:-rotate-12 transition ease-in-out duration-200"
        @click="handleLogoButtonClick"
      >
        <NapkinNotesLogo class="w-10 h-10" />
      </button>
    </div>
    <div class="flex flex-row items-center justify-end gap-4">
      <AppThemeSwitcher />
    </div>
  </div>
  <LoginDialog :isVisible="isLoginDialogVisible" @onDismiss="handleLoginDialogDismiss" />
  <AboutDialog :isVisible="isAboutDialogVisible" @onDismiss="handleAboutDialogDismiss" />
</template>

<style scoped></style>
