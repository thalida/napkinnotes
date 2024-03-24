<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { throttle } from 'lodash'
import { useCoreStore } from '@/stores/core';
import Napkin, { NAPKIN_EVENTS } from "@/napkin";

let napkin: Napkin
const coreStore = useCoreStore()
const contentEditableRef = ref<HTMLDivElement | null>(null)
const htmlContent = ref(coreStore.note?.content)

const throttledUpdate = throttle(coreStore.updateNote, 1000)

onMounted(() => {
  napkin = new Napkin(contentEditableRef.value as HTMLElement)
  napkin.on(NAPKIN_EVENTS.ON_UPDATE, () => {
    coreStore.setNoteContent(napkin.htmlContent)
    throttledUpdate()
  })
})
</script>

<template>
  <div
    class="bg-white p-2 prose w-full max-w-full"
    style="min-height: 100px;"
    ref="contentEditableRef"
    contenteditable="true"
    v-html="htmlContent"
  />
</template>

<style scoped>
</style>
