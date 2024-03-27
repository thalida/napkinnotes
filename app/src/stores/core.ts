import { ref, watchEffect } from 'vue'
import { defineStore } from 'pinia'
import { useWebSocket, type UseWebSocketReturn } from '@vueuse/core'
import type { IUser, INote } from '@/types'
import notesApi from '@/api/notes'
import usersApi from '@/api/users'
import { LOCALSTOARGE_NAMESPACE } from '.'
import { useAuthStore } from './auth'

export const useCoreStore = defineStore('core', () => {
  const authStore = useAuthStore()
  const NOTE_STORAGE_KEY = `${LOCALSTOARGE_NAMESPACE}anon-note`

  const user = ref<IUser | null>(null)
  const note = ref<INote | null>(null)
  const fetchNotesError = ref<string | null>(null)

  function clearData() {
    user.value = null
    note.value = null
  }

  async function initUser() {
    const userRes = await usersApi.fetchMe()
    user.value = userRes.data

    try {
      const noteRes = await notesApi.fetchNotes()
      fetchNotesError.value = null

      if (noteRes.data.length > 0) {
        note.value = {
          ...noteRes.data[0],
          isAnon: false
        }
        return
      }

      const createRes = await notesApi.createNote({
        content: ''
      })
      note.value = {
        ...createRes.data,
        isAnon: false
      }
      return
    } catch (error: any) {
      const errorMessage = Array.isArray(error.response?.data)
        ? error.response?.data[0]
        : error.response?.data
      fetchNotesError.value = errorMessage || 'Failed to fetch note'
      note.value = null
    }
  }

  async function initAnon() {
    const storedNote = localStorage.getItem(NOTE_STORAGE_KEY)
    if (storedNote) {
      note.value = JSON.parse(storedNote)
      return
    }

    const now = new Date()
    note.value = {
      id: `anon-${now.getTime()}`,
      created_at: now.toISOString(),
      updated_at: now.toISOString(),
      content: '',
      isAnon: true
    }
    localStorage.setItem(NOTE_STORAGE_KEY, JSON.stringify(note.value))
  }

  function setNoteContent(content: string) {
    if (!note.value) {
      return
    }

    note.value.content = content

    if (note.value.isAnon) {
      localStorage.setItem(NOTE_STORAGE_KEY, JSON.stringify(note.value))
    }
  }

  async function updateNote() {
    if (!note.value) {
      return
    }

    if (note.value.isAnon) {
      return
    }

    await notesApi.updateNote(note.value.id, { content: note.value.content })
  }

  return {
    user,
    note,
    fetchNotesError,
    clearData,
    setNoteContent,
    initUser,
    initAnon,
    updateNote,
  }
})
