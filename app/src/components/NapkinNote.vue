<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref, watchEffect } from 'vue'
import { throttle } from 'lodash'
import { useCoreStore } from '@/stores/core'
import NapkinNote, { NAPKINNOTE_EVENTS } from '@/lib/NapkinNote'
import { useAuthStore } from '@/stores/auth'
import { useWebSocket } from '@vueuse/core'

let napkinnote: NapkinNote
const authStore = useAuthStore()
const coreStore = useCoreStore()
const websocketUrl = ref(
  authStore.isAuthenticated
    ? `${import.meta.env.VITE_WEBSOCKET_URL}ws/notes/?token=${authStore.getTokenData()?.access_token}&token_type=${authStore.getTokenData()?.token_type}`
    : undefined
)
const { data, send } = useWebSocket(websocketUrl, {
  autoReconnect: true
})

const contentEditableRef = ref<HTMLDivElement | null>(null)
const htmlContent = ref(coreStore.note?.content)
const throttledUpdate = throttle(coreStore.updateNote, 1000)

onMounted(() => {
  napkinnote = new NapkinNote(contentEditableRef.value as HTMLElement)
  napkinnote.on(NAPKINNOTE_EVENTS.ON_UPDATE, () => {
    coreStore.setNoteContent(napkinnote.htmlContent)
    send(
      JSON.stringify({
        type: 'note_update',
        data: {
          id: coreStore.note?.id,
          content: napkinnote.htmlContent
        }
      })
    )
    throttledUpdate()
  })
})

onBeforeUnmount(() => {
  coreStore.updateNote()
  napkinnote.destroy()
})

watchEffect(() => {
  if (data.value === null) {
    return
  }

  const message = JSON.parse(data.value)
  if (message.type === 'note_update') {
    coreStore.setNoteContent(message.data.content)
    napkinnote.htmlContent = message.data.content
  }
})
</script>

<template>
  <div class="napkinnote" ref="contentEditableRef" contentEditable="true" v-html="htmlContent" />
</template>

<style>
:root {
  --napkinnotes--calculator-widget--bg: #bfdbfe80;
  --napkinnoes--calculator-widget--output-text: #10b981;
  --napkinnotes--link-widget--action: #10b981;
}

.dark {
  --napkinnotes--calculator-widget--bg: rgba(0, 0, 0, 0.2);
  --napkinnoes--calculator-widget--output-text: #22c55e;
  --napkinnotes--link-widget--action: #10b981;
}

.napkinnote {
  white-space: pre-wrap;
}

.napkinnote .widget.widget-calculator {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-end;
  gap: 1rem;
  min-height: 48px;
}

.napkinnote .widget-calculator--empty > .widget-calculator__output,
.napkinnote .widget-calculator--error > .widget-calculator__output {
  display: none;
}

.napkinnote .widget-calculator__input {
  background-color: var(--napkinnotes--calculator-widget--bg);
  border: 0;
  border-radius: 8px;
  padding-left: 1rem;
  padding-right: 1rem;
  min-height: 48px;
  max-height: 256px;
  height: 100%;
  flex-grow: 1;
  font-family: 'Fira Code', monospace;
  word-wrap: break-word;
  word-break: break-all;
}

.napkinnote .widget-calculator__output {
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
  font-family: 'Fira Code', monospace;
  font-weight: 700;
}

.napkinnote .widget.widget-checkbox {
  margin-right: 0.5rem;
}

.napkinnote a,
.napkinnote .widget.widget-link {
  color: var(--napkinnotes--link-widget--action);
  text-decoration: underline;
}
.napkinnote.napkinnote--ctrl-key-active .widget.widget-link {
  cursor: pointer;
}
</style>
