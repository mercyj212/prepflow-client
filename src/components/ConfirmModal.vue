<template>
  <Transition name="modal">
    <div v-if="show" class="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <!-- Backdrop with premium blur -->
      <div 
        class="absolute inset-0 bg-zinc-950/40 backdrop-blur-md transition-opacity" 
        @click="$emit('cancel')"
      ></div>

      <!-- Modal Card -->
      <div class="relative w-full max-w-sm bg-white dark:bg-zinc-900 rounded-[32px] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-white/20 dark:border-zinc-800 animate-in zoom-in-95 duration-200">
        <div class="p-8">
          <!-- Icon Header -->
          <div :class="[
            'w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 transition-colors',
            isDanger ? 'bg-red-500/10 text-red-500' : 'bg-zinc-900/10 text-zinc-900 dark:bg-white/10 dark:text-white'
          ]">
            <AlertCircle v-if="isDanger" :size="32" />
            <AlertTriangle v-else :size="32" />
          </div>

          <!-- Text Content -->
          <h3 class="text-xl font-black text-center text-zinc-900 dark:text-white uppercase tracking-tight mb-2">
            {{ title }}
          </h3>
          <p class="text-zinc-500 dark:text-zinc-400 text-center text-sm leading-relaxed antialiased">
            {{ message }}
          </p>
        </div>

        <!-- Action Grid -->
        <div class="flex border-t border-zinc-100 dark:border-zinc-800">
          <button 
            @click="$emit('cancel')"
            class="flex-1 py-5 text-xs font-bold uppercase tracking-widest text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors border-r border-zinc-100 dark:border-zinc-800"
          >
            Go Back
          </button>
          <button 
            @click="$emit('confirm')"
            :class="[
              'flex-1 py-5 text-xs font-black uppercase tracking-widest transition-all hover:scale-[1.02] active:scale-95',
              isDanger ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-black dark:bg-white text-white dark:text-black'
            ]"
          >
            {{ confirmText }}
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { AlertCircle, AlertTriangle } from 'lucide-vue-next';

defineProps({
  show: Boolean,
  title: { type: String, default: 'Are you sure?' },
  message: { type: String, default: 'This action cannot be undone.' },
  confirmText: { type: String, default: 'Confirm' },
  isDanger: { type: Boolean, default: true }
});

defineEmits(['confirm', 'cancel']);
</script>

<style scoped>
.modal-enter-active, .modal-leave-active {
  transition: opacity 0.3s ease;
}
.modal-enter-from, .modal-leave-to {
  opacity: 0;
}
</style>
