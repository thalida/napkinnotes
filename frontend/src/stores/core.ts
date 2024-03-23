import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { IUser, INote } from '@/types'
import notesApi from '@/api/notes'
import usersApi from '@/api/users'

export const useCoreStore = defineStore('core', () => {
  const user = ref<IUser | null>(null)
  const note = ref<INote | null>(null)

  function clearData() {
    user.value = null
    note.value = null
  }

  function setNoteContent(content: string) {
    if (!note.value) {
      return
    }

    note.value.content = content

    if (note.value.isAnon) {
      localStorage.setItem('x-anon-note', JSON.stringify(note.value))
    }
  }

  async function initUser() {
    const res = await usersApi.fetchMe()
    user.value = res.data
    note.value = {
      ...res.data.note,
      isAnon: false
    }
  }

  async function initAnon() {
    const storedNote = localStorage.getItem('x-anon-note')
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
    localStorage.setItem('x-anon-note', JSON.stringify(note.value))
  }

  async function updateNote() {
    console.log('updateNote')
    if (!note.value) {
      return
    }

    console.log('note.value', note.value)

    if (note.value.isAnon) {
      return
    }

    await notesApi.updateNote(note.value.id, { content: note.value.content })
  }

  return {
    user,
    note,
    clearData,
    setNoteContent,
    initUser,
    initAnon,
    updateNote
  }
})
