<script setup lang="ts">
import { useCoreStore } from '@/stores/core'
import NapkinNote from '@/components/NapkinNote.vue'
import AppMenu from '@/components/AppMenu.vue'

const coreStore = useCoreStore()
</script>

<template>
  <div class="flex h-full max-h-full flex-col bg-blue-100 dark:bg-slate-900">
    <div class="grow overflow-auto">
      <NapkinNote
        v-if="coreStore.note"
        :key="coreStore.note.id"
        class="prose prose-slate h-full w-full max-w-full grow overflow-y-auto border-slate-100 p-8 caret-blue-700 dark:prose-invert selection:bg-teal-200 focus:outline-none dark:text-white dark:caret-slate-200 dark:selection:bg-blue-900"
      />
      <div v-if="coreStore.fetchNotesError" class="p-8 text-red-700 dark:text-red-300">
        {{ coreStore.fetchNotesError }}
      </div>
    </div>

    <AppMenu class="shrink-0 bg-blue-200 p-4 dark:bg-slate-950" />
  </div>
</template>

<style scoped></style>
