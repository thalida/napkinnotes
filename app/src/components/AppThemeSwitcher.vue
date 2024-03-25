<script setup lang="ts">
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'
import { useUIStore } from '@/stores/ui'
import type { Theme } from '@/types'

import { BIconMoonFill, BIconSunFill, BIconCircleHalf } from 'bootstrap-icons-vue'

const uiStore = useUIStore()

const menuOptions = [
  {
    key: 'light',
    icon: BIconSunFill,
    label: 'Light'
  },
  {
    key: 'dark',
    icon: BIconMoonFill,
    label: 'Dark'
  },
  {
    key: 'system',
    icon: BIconCircleHalf,
    label: 'System'
  }
]
</script>

<template>
  <Menu as="div" class="relative inline-block text-left">
    <div>
      <MenuButton class="flex items-center rounded-full text-blue-500 dark:text-slate-800">
        <span class="sr-only">Open options</span>
        <BIconSunFill v-if="uiStore.colorScheme === 'light'" class="w-5 h-5" />
        <BIconMoonFill v-else class="w-5 h-5" />
      </MenuButton>
    </div>

    <transition
      enter-active-class="transition ease-out duration-100"
      enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      eave-from-class="transform opacity-100 scale-100"
      l
      eave-to-class="transform opacity-0 scale-95"
    >
      <MenuItems
        class="absolute right-1 bottom-10 z-10 mt-2 min-w-32 origin-bottom-right rounded-md bg-blue-50 dark:bg-slate-800 shadow-lg overflow-hidden ring-1 ring-black ring-opacity-5 focus:outline-none"
      >
        <div>
          <MenuItem v-for="option in menuOptions" :key="option.key" v-slot="{ active: hover }">
            <button
              @click="uiStore.setTheme(option.key as Theme)"
              class="flex flex-row items-center justify-start gap-2 w-full px-4 py-2 text-left text-sm"
              :class="{
                'bg-teal-100 text-blue-500 dark:bg-slate-900/50 dark:text-blue-500':
                  uiStore.selectedTheme === option.key,
                'text-blue-500': uiStore.selectedTheme !== option.key && hover,
                'text-gray-700 dark:text-white': uiStore.selectedTheme !== option.key && !hover
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
