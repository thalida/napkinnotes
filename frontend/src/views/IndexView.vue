<script setup lang="ts">
import { useCoreStore } from '@/stores/core';
import NapkinNote from '@/components/NapkinNote.vue'
import AppMenu from '@/components/AppMenu.vue'

const coreStore = useCoreStore()
</script>

<template>
  <div class="flex flex-col h-full max-h-full bg-slate-200 dark:bg-slate-900">

    <div class="grow overflow-auto">
      <NapkinNote
        v-if="coreStore.note"
        :key="coreStore.note.id"
        class="p-8 prose grow h-full w-full max-w-full border-slate-100 caret-orange-700 dark:caret-blue-700 dark:text-white overflow-y-auto focus:outline-none" />
    </div>

    <AppMenu class="p-4 shrink-0 bg-slate-300 dark:bg-slate-950" />
  </div>
</template>

<style scoped>
</style>
