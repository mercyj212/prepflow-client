<template>
  <NeoCard variant="depressed" class="p-8">
    <h2 class="text-xl font-semibold mb-8 flex items-center gap-3 text-slate-900 dark:text-zinc-100 uppercase tracking-widest text-[11px] font-black">
      <div class="w-8 h-8 rounded-lg bg-slate-100 dark:bg-zinc-800 flex items-center justify-center">
        <svg class="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path></svg>
      </div>
      Assemble Assessment
    </h2>
    <form @submit.prevent="handleSubmit" class="space-y-6">
      <div>
        <label class="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 px-1">Target Curriculim</label>
        <select v-model="form.course" required class="w-full bg-[var(--neo-bg)] border border-slate-200 dark:border-zinc-800 rounded-2xl px-5 py-4 text-sm text-slate-900 dark:text-zinc-100 focus:ring-2 focus:ring-brand/20 transition-all shadow-neo-inner outline-none appearance-none">
          <option value="" disabled>Choose target node</option>
          <option v-for="c in courses" :key="c._id" :value="c._id">{{ c.title }}</option>
        </select>
      </div>
      <div>
        <label class="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 px-1">Diagnostic Label</label>
        <input v-model="form.title" required type="text" class="w-full bg-[var(--neo-bg)] border border-slate-200 dark:border-zinc-800 rounded-2xl px-5 py-4 text-sm text-slate-900 dark:text-zinc-100 focus:ring-2 focus:ring-brand/20 transition-all shadow-neo-inner outline-none" placeholder="e.g. Mid-Term Assessment">
      </div>
      <div>
        <label class="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 px-1">Temporal Constraint (mins)</label>
        <input v-model="form.timeLimit" type="number" min="1" class="w-full bg-[var(--neo-bg)] border border-slate-200 dark:border-zinc-800 rounded-2xl px-5 py-4 text-sm text-slate-900 dark:text-zinc-100 focus:ring-2 focus:ring-brand/20 transition-all shadow-neo-inner outline-none">
      </div>
      <button type="submit" :disabled="loading" class="w-full h-14 bg-zinc-900 dark:bg-white hover:-translate-y-1 text-white dark:text-zinc-900 font-black rounded-2xl transition-all shadow-neo-pill disabled:opacity-50 text-[11px] uppercase tracking-[0.2em] flex items-center justify-center gap-3">
        <span>{{ loading ? 'Assembling Shell...' : 'Finalize Assessment' }}</span>
        <span v-if="!loading">→</span>
      </button>
    </form>
  </NeoCard>
</template>

<script setup>
import { ref } from 'vue';
import NeoCard from '../common/NeoCard.vue';

const props = defineProps({
  loading: Boolean,
  courses: Array
});

const emit = defineEmits(['create']);

const form = ref({
  course: '',
  title: '',
  timeLimit: 30
});

const handleSubmit = () => {
  emit('create', { ...form.value });
  form.value = { course: '', title: '', timeLimit: 30 };
};
</script>
