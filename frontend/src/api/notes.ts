import { INote } from '@/types/notes'
import api from './index'
import { authStore } from '@/store/auth'

export function updateNote({ id, content }: INote) {
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
