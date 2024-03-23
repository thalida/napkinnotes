import type { INote } from '@/types'
import api from './index'
import { useAuthStore } from '@/stores/auth'

export function updateNote(id: string, { content }: Partial<INote>) {
  const authStore = useAuthStore()
  return api.put(
    `/notes/${id}/`,
    {
      content
    },
    {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `${authStore.tokenData?.token_type} ${authStore.tokenData?.access_token}`
      },
    }
  )
}

export default {
  updateNote
}
