import { createRouter, createWebHistory } from 'vue-router'
import IndexView from '@/views/IndexView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: IndexView
    },
    { path: '/:pathMatch(.*)*', name: 'NotFound', redirect: '/' }
  ]
})

export default router
