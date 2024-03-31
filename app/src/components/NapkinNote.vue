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

const $napkinnote = ref<HTMLDivElement | null>(null)
const throttledUpdate = throttle(coreStore.updateNote, 1000)

onMounted(() => {
  napkinnote = new NapkinNote($napkinnote.value as HTMLElement)
  napkinnote.setHtmlContent(coreStore.note?.content || '')
  napkinnote.on(NAPKINNOTE_EVENTS.ON_UPDATE, () => {
    coreStore.setNoteContent(napkinnote.getHtmlContent())
    send(
      JSON.stringify({
        type: 'note_update',
        data: {
          id: coreStore.note?.id,
          content: napkinnote.getHtmlContent()
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
    napkinnote.setHtmlContent(message.data.content)
  }
})
</script>

<template>
  <div ref="$napkinnote" />
</template>
