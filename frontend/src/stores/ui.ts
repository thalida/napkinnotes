import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useUIStore = defineStore('ui', () => {
  const supportedThemes = ['light', 'dark', 'system']
  const selectedTheme = ref('system')
  const themeClass = ref<'light' | 'dark'>('light')

  function initTheme() {
    const theme = localStorage.theme ? localStorage.theme : 'system'
    setTheme(theme)
  }

  function setTheme(theme: typeof supportedThemes[number]) {
    if (supportedThemes.includes(theme)) {
      selectedTheme.value = theme
    }

    if (
      selectedTheme.value === 'dark' ||
      (selectedTheme.value === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
    ) {
      themeClass.value = 'dark'
      document.documentElement.classList.add('dark')
    } else {
      themeClass.value = 'light'
      document.documentElement.classList.remove('dark')
    }

    if (selectedTheme.value === 'system') {
      localStorage.removeItem('x-theme')
    } else {
      localStorage.setItem('x-theme', selectedTheme.value)
    }
  }

  return {
    supportedThemes,
    selectedTheme,
    themeClass,
    initTheme,
    setTheme
  }
})
