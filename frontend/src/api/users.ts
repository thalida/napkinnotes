import api from './index'
import { useAuthStore } from '@/stores/auth'

export function fetchMe() {
  const authStore = useAuthStore()
  return api.get(
    '/users/me/',
    {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `${authStore.tokenData?.token_type} ${authStore.tokenData?.access_token}`
      },
    }
  )
}


export default {
  fetchMe
}
