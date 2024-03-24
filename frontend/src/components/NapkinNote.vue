<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from 'vue'
import { throttle } from 'lodash'
import { useCoreStore } from '@/stores/core';
import NapkinNote, { NAPKIN_NOTE_EVENTS } from "@/components/NapkinNote";

let napkinnote: NapkinNote
const coreStore = useCoreStore()
const contentEditableRef = ref<HTMLDivElement | null>(null)
const htmlContent = ref(coreStore.note?.content)
const throttledUpdate = throttle(coreStore.updateNote, 1000)

onMounted(() => {
  napkinnote = new NapkinNote(contentEditableRef.value as HTMLElement)
  napkinnote.on(NAPKIN_NOTE_EVENTS.ON_UPDATE, () => {
    coreStore.setNoteContent(napknapkinnotein.htmlContent)
    throttledUpdate()
  })
})

onBeforeUnmount(() => {
  coreStore.updateNote()
  napkinnote.destroy()
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

:root {
  --napkinnotes--calculator-widget--bg: rgba(0, 0, 0, 0.08);
  --napkinnoes--calculator-widget--output-text: #b91c1c;
  --napkinnotes--link-widget--action: #10b981;
}

.dark {
  --napkinnotes--calculator-widget--bg: rgba(0, 0, 0, 0.2);
  --napkinnoes--calculator-widget--output-text: #22c55e;
  --napkinnotes--link-widget--action: #10b981;
}

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
  background-color: var(--napkinnotes--calculator-widget--bg);
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
  background-color: var(--napkinnotes--calculator-widget--bg);
  border-radius: 8px;
  padding-left: 1rem;
  padding-right: 1rem;
  color: var(--napkinnoes--calculator-widget--output-text);
  font-family: "Fira Code", monospace;
  font-weight: 700;
}

.widget.widget-checkbox {
  margin-right: 0.5rem;
}

.widget.widget-link {
  white-space: nowrap;
}

.widget-link__action {
  color: var(--napkinnotes--link-widget--action);
  text-decoration: none;
  padding: 0.25rem 0.5rem;
}
</style>
