<script setup lang="ts">
import { ref, defineProps } from 'vue'
import { Dialog, DialogPanel, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { XCircleIcon } from '@heroicons/vue/24/outline'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const props = defineProps({
  isVisible: Boolean,
})
const emit = defineEmits(['onDismiss'])

const email = ref('')
const password = ref('')
const error = ref<string|null>(null)

async function handleSubmit(e: Event) {
  e.preventDefault()
  try {
    await authStore.loginWithEmail({ username: email.value, password: password.value })
    email.value = ''
    password.value = ''
    error.value = null
    emit('onDismiss')
  } catch {
    error.value = 'Invalid email or password'
    email.value = ''
    password.value = ''
  }
}
</script>

<template>
  <TransitionRoot as="template" :show="props.isVisible">
    <Dialog as="div" class="relative z-10" @close="$emit('onDismiss')">
      <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0" enter-to="opacity-100" leave="ease-in duration-200" leave-from="opacity-100" leave-to="opacity-0">
        <div class="fixed inset-0 bg-slate-900 bg-opacity-75 transition-opacity backdrop-blur-sm" />
      </TransitionChild>

      <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <TransitionChild
            as="template"
            enter="ease-out duration-300"
            enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enter-to="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leave-from="opacity-100 translate-y-0 sm:scale-100"
            leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <DialogPanel
              class="relative w-full transform overflow-hidden rounded-lg bg-white dark:bg-slate-950 px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:max-w-sm sm:p-6"
            >
              <div class="w-full sm:mx-auto sm:max-w-md">
                <img
                  class="mx-auto h-10 w-auto"
                  src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                  alt="Your Company"
                />
                <h2 class="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900 dark:text-white">
                  Napkin Notes
                </h2>
              </div>

              <div v-if="error" class="flex flex-row gap-2 mt-4 rounded-md bg-red-50 dark:bg-red-200 p-4 sm:mx-auto sm:w-full sm:max-w-sm">
                <div class="flex-shrink-0">
                  <XCircleIcon class="h-5 w-5 text-red-400 dark:text-red-600" aria-hidden="true" />
                </div>
                <p class="text-sm font-medium text-red-800">
                  {{error}}
                </p>
              </div>

              <form class="mt-4 space-y-6" @submit="handleSubmit">
                <div>
                  <label for="email" class="block text-sm font-medium leading-6 text-gray-900 dark:text-white">
                    Email address
                  </label>
                  <div class="mt-2">
                    <input
                      v-model="email"
                      id="email"
                      name="email"
                      type="email"
                      required
                      class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 dark:bg-white/5 dark:text-white dark:ring-white/10 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
                <div>
                  <label for="password" class="block text-sm font-medium leading-6 text-gray-900 dark:text-white">
                    Password
                  </label>
                  <div class="mt-2">
                    <input
                      v-model="password"
                      id="password"
                      name="password"
                      type="password"
                      required
                      class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 dark:bg-white/5 dark:text-white dark:ring-white/10 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
                <div>
                  <button
                    type="submit"
                    class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    Sign in
                  </button>
                </div>
              </form>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>
