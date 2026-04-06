<template>
  <div class="col-span-1 lg:col-span-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 shadow-sm transition-colors relative overflow-hidden">
    <div class="absolute inset-0 bg-gradient-to-br from-indigo-500/5 dark:from-white/5 to-transparent pointer-events-none"></div>
    
    <header class="mb-8 relative z-10 flex items-center justify-between">
      <h2 class="text-[11px] font-black text-indigo-500 dark:text-indigo-400 uppercase tracking-[0.25em] flex items-center gap-3">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26.126.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg>
        AI Assessment Architect
      </h2>
      <div v-if="loading" class="flex items-center gap-2 px-3 py-1 bg-indigo-50 dark:bg-indigo-500/10 rounded-full">
        <span class="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse"></span>
        <span class="text-[9px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">Optimizing Prompt...</span>
      </div>
    </header>

    <form @submit.prevent="handleSubmit" class="space-y-6 relative z-10">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="space-y-2">
          <label class="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Target Quiz</label>
          <div class="flex items-center gap-3">
            <select v-model="form.quizId" required class="flex-1 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-2xl px-5 py-4 text-sm text-zinc-900 dark:text-white focus:ring-2 focus:ring-indigo-500/20 transition-all shadow-sm appearance-none">
              <option value="" disabled>Choose a destination quiz</option>
              <option v-for="q in quizzes" :key="q._id" :value="q._id">{{ q.title }} ({{ q.questions?.length || 0 }} Qs)</option>
            </select>
          </div>
        </div>
        <div class="space-y-2">
          <label class="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Question Volume</label>
          <input v-model="form.count" required type="number" min="1" max="200" class="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-2xl px-5 py-4 text-sm text-zinc-900 dark:text-white focus:ring-2 focus:ring-indigo-500/20 transition-all shadow-sm">
        </div>
      </div>

      <div class="space-y-2">
        <label class="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Knowledge Context (Paste text or Upload)</label>
        <textarea v-model="form.material" class="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-2xl px-6 py-5 text-sm text-zinc-900 dark:text-white focus:ring-2 focus:ring-indigo-500/20 transition-all shadow-sm h-40 font-mono resize-none" placeholder="Enter the academic material or context for the AI..."></textarea>
      </div>

      <!-- File Upload Zone -->
      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <label class="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Supporting Documents (Img/PDF)</label>
          <span class="text-[9px] font-bold text-zinc-300">{{ files.length }}/10 sources used</span>
        </div>
        
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label v-if="files.length < 10" class="flex flex-col items-center justify-center p-8 border-2 border-dashed border-zinc-100 dark:border-zinc-800 rounded-3xl cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-all group shrink-0">
            <svg class="w-8 h-8 text-zinc-200 group-hover:text-indigo-400 transition-colors mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 4v16m8-8H4"/></svg>
            <span class="text-[10px] font-black uppercase tracking-widest text-zinc-400 group-hover:text-zinc-600 transition-colors">Attach Source</span>
            <input type="file" multiple accept="image/*,.pdf" class="hidden" @change="onFileChange" />
          </label>

          <div v-if="files.length > 0" class="flex flex-col gap-2 max-h-[140px] overflow-y-auto pr-2 custom-scrollbar">
            <div v-for="(f, i) in files" :key="i" class="flex items-center gap-3 p-3 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800 rounded-2xl group shadow-sm transition-all hover:translate-x-1">
              <span class="text-lg shrink-0">{{ f.type.includes('pdf') ? '📄' : '🖼️' }}</span>
              <span class="flex-1 text-[10px] font-bold text-zinc-600 dark:text-zinc-300 truncate uppercase tracking-wider">{{ f.name }}</span>
              <button @click="removeFile(i)" type="button" class="p-1.5 text-zinc-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100">&times;</button>
            </div>
          </div>
        </div>
      </div>

      <button type="submit" :disabled="loading" class="w-full bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white font-black py-5 px-4 rounded-[24px] transition-all shadow-xl shadow-indigo-500/20 dark:shadow-none disabled:opacity-50 flex justify-center items-center gap-4 text-[11px] uppercase tracking-[0.25em]">
        <svg v-if="!loading" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
        <div v-else class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
        <span>{{ loading ? 'Generating Assessment...' : 'Craft Assessment with AI' }}</span>
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  loading: Boolean,
  quizzes: Array
});

const emit = defineEmits(['generate']);

const form = ref({
  quizId: '',
  material: '',
  count: 100
});

const files = ref([]);

const onFileChange = (e) => {
  const selectedFiles = Array.from(e.target.files);
  const remaining = 10 - files.value.length;
  files.value.push(...selectedFiles.slice(0, remaining));
};

const removeFile = (index) => {
  files.value.splice(index, 1);
};

const handleSubmit = () => {
  if (!form.value.quizId) return;
  emit('generate', { ...form.value, files: files.value });
};
</script>
