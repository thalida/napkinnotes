import { ref } from 'vue'
import { defineStore } from 'pinia'
import { LOCALSTOARGE_NAMESPACE } from '.'

export const useUIStore = defineStore('ui', () => {
  const THEME_STORAGE_KEY = `${LOCALSTOARGE_NAMESPACE}theme`
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
      localStorage.removeItem(THEME_STORAGE_KEY)
    } else {
      localStorage.setItem(THEME_STORAGE_KEY, selectedTheme.value)
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
