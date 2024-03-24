<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from 'vue'
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

onBeforeUnmount(() => {
  coreStore.updateNote()
  napkin.destroy()
})
</script>

<template>
  <div
    ref="contentEditableRef"
    contentEditable="true"
    v-html="htmlContent"
  />
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Fira+Code:wght@300..700&display=swap');

.widget.widget-calculator {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-end;
  gap: 1rem;
  min-height: 48px;
}

.widget-calculator--empty > .widget-calculator__output,
.widget-calculator--error > .widget-calculator__output {
  display: none;
}

.widget-calculator__input {
  background-color: rgba(0, 0, 0, 0.2);
  border: 0;
  border-radius: 8px;
  padding-left: 1rem;
  padding-right: 1rem;
  min-height: 48px;
  max-height: 256px;
  height: 100%;
  flex-grow: 1;
  font-family: "Fira Code", monospace;
  word-wrap: break-word;
  word-break: break-all;
}

.widget-calculator__output {
  display: flex;
  flex-shrink: 0;
  justify-content: center;
  align-items: center;
  height: 48px;
  min-width: 48px;
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  padding-left: 1rem;
  padding-right: 1rem;
  color: #00ff92;
  font-family: "Fira Code", monospace;
}

.widget.widget-checkbox {
  margin-right: 0.5rem;
}

.widget.widget-link {
  white-space: nowrap;
}

.widget-link__action {
  color: #00ff92;
  text-decoration: none;
}
</style>
