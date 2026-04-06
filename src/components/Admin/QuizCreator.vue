<template>
  <div class="col-span-1 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm transition-colors">
    <h2 class="text-xl font-semibold mb-6 flex items-center gap-2 text-zinc-900 dark:text-white uppercase tracking-widest text-[11px] font-black">
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path></svg>
      Create Base Quiz
    </h2>
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div>
        <label class="block text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1.5">Target Course</label>
        <select v-model="form.course" required class="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-sm text-zinc-900 dark:text-white focus:ring-2 focus:ring-black dark:focus:ring-white transition-all shadow-sm">
          <option value="" disabled>Choose target course</option>
          <option v-for="c in courses" :key="c._id" :value="c._id">{{ c.title }}</option>
        </select>
      </div>
      <div>
        <label class="block text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1.5">Quiz Title</label>
        <input v-model="form.title" required type="text" class="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-sm text-zinc-900 dark:text-white focus:ring-2 focus:ring-black dark:focus:ring-white transition-all shadow-sm" placeholder="e.g. Mid-Term Assessment">
      </div>
      <div>
        <label class="block text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1.5">Time Limit (mins)</label>
        <input v-model="form.timeLimit" type="number" min="1" class="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-sm text-zinc-900 dark:text-white focus:ring-2 focus:ring-black dark:focus:ring-white transition-all shadow-sm">
      </div>
      <button type="submit" :disabled="loading" class="w-full bg-zinc-900 dark:bg-white hover:opacity-90 text-white dark:text-black font-black py-4 px-4 rounded-xl transition-all shadow-lg shadow-zinc-900/10 dark:shadow-none disabled:opacity-50 text-[11px] uppercase tracking-[0.2em]">
        {{ loading ? 'Assembling...' : 'Create Shell Quiz' }}
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';

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
