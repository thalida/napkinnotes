<script setup lang="ts">
import { useCoreStore } from '@/stores/core';
import NapkinNote from '@/components/NapkinNote.vue'
import AppMenu from '@/components/AppMenu.vue'

const coreStore = useCoreStore()
</script>

<template>
  <div class="flex flex-col h-full max-h-full bg-blue-100 dark:bg-slate-900">

    <div class="grow overflow-auto">
      <NapkinNote
        v-if="coreStore.note"
        :key="coreStore.note.id"
        class="p-8 prose prose-slate grow h-full w-full max-w-full border-slate-100 selection:bg-teal-200 caret-amber-700 dark:selection:bg-blue-900 dark:caret-blue-700 dark:text-white overflow-y-auto focus:outline-none" />
    </div>

    <AppMenu class="p-4 shrink-0 bg-blue-200 dark:bg-slate-950" />
  </div>
</template>

<style scoped>
</style>
