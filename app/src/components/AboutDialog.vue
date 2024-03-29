<script setup lang="ts">
import { Dialog, DialogPanel, TransitionChild, TransitionRoot } from '@headlessui/vue'
import NapkinNotesLogo from '@/components/icons/NapkinNotesLogo.vue'

const props = defineProps({
  isVisible: Boolean
})
</script>

<template>
  <TransitionRoot as="template" :show="props.isVisible">
    <Dialog as="div" class="relative z-10" @close="$emit('onDismiss')">
      <TransitionChild
        as="template"
        enter="ease-out duration-300"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="ease-in duration-200"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div
          class="fixed inset-0 bg-blue-200 bg-opacity-75 backdrop-blur-sm transition-opacity dark:bg-slate-900 dark:bg-opacity-75"
        />
      </TransitionChild>

      <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div
          class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0"
        >
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
              class="relative w-full transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:max-w-sm sm:p-6 dark:bg-slate-950"
            >
              <div
                class="flex w-full flex-row items-center justify-start gap-4 pb-4 sm:mx-auto sm:max-w-md"
              >
                <NapkinNotesLogo class="w-10 h-10" />
                <h2 class="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                  About Napkin Notes
                </h2>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<style scoped></style>
