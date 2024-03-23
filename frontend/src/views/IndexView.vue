<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth';
import { useCoreStore } from '@/stores/core';
import { throttle } from 'lodash'
import Napkin from '@/components/Napkin.vue'
import LoginDialog from '@/components/LoginDialog.vue'


const authStore = useAuthStore()
const coreStore = useCoreStore()
const isLoginDialogVisible = ref(false)

const throttledUpdate = throttle(coreStore.updateNote, 1000)

function handleLoginDialogDismiss() {
  isLoginDialogVisible.value = false
}

function handleLogoutButtonClick() {
  authStore.logout()
}

function handleLoginButtonClick() {
  isLoginDialogVisible.value = true
}

function handleContentChange(content: string) {
  if (typeof coreStore.note === 'undefined' || coreStore.note === null) {
    return
  }

  console.log('content', content)

  coreStore.setNoteContent(content)
  throttledUpdate()
}
</script>

<template>

    <div class="flex flex-col py-10 px-4 sm:px-6 lg:px-8">
        <button v-if="authStore.isAuthenticated" class="mt-4 bg-red-500 text-white font-semibold py-2 px-4 rounded" @click="handleLogoutButtonClick">
          Logout
        </button>
        <button
          v-else
          class="mt-4 bg-indigo-500 text-white font-semibold py-2 px-4 rounded"
          @click="handleLoginButtonClick"
        >
          Show Login Dialog
        </button>

        <Napkin
          v-if="coreStore.note"
          :content="coreStore.note.content"
          @onContentChange="handleContentChange"
        />

      <LoginDialog :isVisible="isLoginDialogVisible" @onDismiss="handleLoginDialogDismiss" />
    </div>

</template>

<style scoped>
</style>
