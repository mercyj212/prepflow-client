<template>
  <NeoCard variant="depressed" class="p-8">
    <h2 class="text-xl font-semibold mb-8 flex items-center gap-3 text-slate-900 dark:text-zinc-100 uppercase tracking-widest text-[11px] font-black">
      <div class="w-8 h-8 rounded-lg bg-slate-100 dark:bg-zinc-800 flex items-center justify-center">
        <svg class="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
      </div>
      Initialize Course
    </h2>
    <form @submit.prevent="handleSubmit" class="space-y-6">
      <div>
        <label class="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 px-1">Conceptual Title</label>
        <input v-model="form.title" required type="text" class="w-full bg-[var(--neo-bg)] border border-slate-200 dark:border-zinc-800 rounded-2xl px-5 py-4 text-sm text-slate-900 dark:text-zinc-100 focus:ring-2 focus:ring-brand/20 transition-all shadow-neo-inner outline-none" placeholder="e.g. Advanced Bio-Chemistry">
      </div>
      <div>
        <label class="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 px-1">Executive Summary</label>
        <textarea v-model="form.description" class="w-full bg-[var(--neo-bg)] border border-slate-200 dark:border-zinc-800 rounded-2xl px-5 py-4 text-sm text-slate-900 dark:text-zinc-100 focus:ring-2 focus:ring-brand/20 transition-all shadow-neo-inner outline-none h-32 resize-none" placeholder="Enter course overview..."></textarea>
      </div>
      <div class="flex items-center gap-4 p-4 bg-[var(--neo-bg)] rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-neo-inner transition-all">
        <div class="relative inline-flex items-center cursor-pointer">
          <input 
            id="notify-students" 
            v-model="form.notifyStudents" 
            type="checkbox" 
            class="w-5 h-5 rounded-md border-slate-300 dark:border-zinc-700 text-brand focus:ring-brand/20 bg-white dark:bg-zinc-900"
          >
        </div>
        <label for="notify-students" class="text-[10px] font-black text-slate-500 cursor-pointer select-none uppercase tracking-[0.2em]">
          Broadcast to Registry 📧
        </label>
      </div>
      <button type="submit" :disabled="loading" class="w-full h-14 bg-zinc-900 dark:bg-white hover:-translate-y-1 text-white dark:text-zinc-900 font-black rounded-2xl transition-all shadow-neo-pill disabled:opacity-50 text-[11px] uppercase tracking-[0.2em] flex items-center justify-center gap-3">
        <span>{{ loading ? 'Establishing Protocol...' : 'Launch Curriculim' }}</span>
        <span v-if="!loading">→</span>
      </button>
    </form>
  </NeoCard>
</template>

<script setup>
import { ref } from 'vue';
import NeoCard from '../common/NeoCard.vue';

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
