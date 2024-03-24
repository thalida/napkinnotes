<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'
import { useUIStore } from '@/stores/ui';

import { BIconMoonFill, BIconSunFill, BIconCircleHalf } from "bootstrap-icons-vue"

const uiStore = useUIStore()
let activeIcon = null;

const menuOptions = [
  {
    key: 'light',
    icon: BIconSunFill,
    label: 'Light',
  },
  {
    key: 'dark',
    icon: BIconMoonFill,
    label: 'Dark',
  },
  {
    key: 'system',
    icon: BIconCircleHalf,
    label: 'System',
  },
]

watchEffect(() => {
  switch (uiStore.colorScheme) {
    case 'light':
      activeIcon = BIconSunFill
      break
    case 'dark':
      activeIcon = BIconMoonFill
      break
  }
})
</script>


<template>
  <Menu as="div" class="relative inline-block text-left">
    <div>
      <MenuButton class="flex items-center rounded-full text-gray-400 dark:text-white hover:text-gray-600">
        <span class="sr-only">Open options</span>
        <component :is="activeIcon" class="inline-block w-4 h-4" />
      </MenuButton>
    </div>

    <transition
      enter-active-class="transition ease-out duration-100"
      enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      eave-from-class="transform opacity-100 scale-100" l
      eave-to-class="transform opacity-0 scale-95"
    >
      <MenuItems
        class="absolute right-0 bottom-8 z-10 mt-2 min-w-32 origin-bottom-right rounded-md bg-white dark:bg-slate-800 shadow-lg overflow-hidden ring-1 ring-black ring-opacity-5 focus:outline-none"
      >
        <div>
          <MenuItem
            v-for="option in menuOptions"
            :key="option.key"
            v-slot="{ active: hover }"
          >
            <button
              @click="uiStore.setTheme(option.key)"
              class="flex flex-row items-center justify-start gap-2 w-full px-4 py-2 text-left text-sm"
              :class="{
                'bg-blue-100 dark:bg-slate-700 dark:text-emerald-500': uiStore.selectedTheme === option.key,
                'dark:text-slate-400': uiStore.selectedTheme !== option.key && hover,
                'text-gray-700 dark:text-white': uiStore.selectedTheme !== option.key && !hover,
              }"
            >
              <component :is="option.icon" class="w-4 h-4 inline-block mr-2" />
              <span>{{ option.label }}</span>
            </button>
          </MenuItem>
        </div>
      </MenuItems>
    </transition>
  </Menu>
</template>
