<template>
  <div class="col-span-1 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm transition-colors">
    <h2 class="text-xl font-semibold mb-6 flex items-center gap-2 text-zinc-900 dark:text-white uppercase tracking-widest text-[11px] font-black">
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
      Create Course
    </h2>
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div>
        <label class="block text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1.5">Course Title</label>
        <input v-model="form.title" required type="text" class="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-sm text-zinc-900 dark:text-white focus:ring-2 focus:ring-black dark:focus:ring-white transition-all shadow-sm" placeholder="e.g. Advanced Bio-Chemistry">
      </div>
      <div>
        <label class="block text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1.5">Description</label>
        <textarea v-model="form.description" class="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-sm text-zinc-900 dark:text-white focus:ring-2 focus:ring-black dark:focus:ring-white transition-all shadow-sm h-24 resize-none" placeholder="Enter course overview..."></textarea>
      </div>
      <div class="flex items-center gap-3 p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-100 dark:border-zinc-800 transition-all">
        <input 
          id="notify-students" 
          v-model="form.notifyStudents" 
          type="checkbox" 
          class="w-5 h-5 rounded-md border-zinc-300 dark:border-zinc-700 text-black focus:ring-black/20 bg-white dark:bg-zinc-900"
        >
        <label for="notify-students" class="text-[10px] font-black text-zinc-500 cursor-pointer select-none uppercase tracking-widest">
          Notify Students 📧
        </label>
      </div>
      <button type="submit" :disabled="loading" class="w-full bg-zinc-900 dark:bg-white hover:opacity-90 text-white dark:text-black font-black py-4 px-4 rounded-xl transition-all shadow-lg shadow-zinc-900/10 dark:shadow-none disabled:opacity-50 text-[11px] uppercase tracking-[0.2em]">
        {{ loading ? 'Creating...' : 'Launch Course' }}
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  loading: Boolean
});

const emit = defineEmits(['create']);

const form = ref({
  title: '',
  description: '',
  notifyStudents: false
});

const handleSubmit = () => {
  emit('create', { ...form.value });
  form.value = { title: '', description: '', notifyStudents: false };
};
</script>
