<template>
  <div class="col-span-1 lg:col-span-1 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 shadow-sm transition-colors relative overflow-hidden group">
    <div class="absolute inset-0 bg-gradient-to-tr from-emerald-500/5 dark:from-white/5 to-transparent pointer-events-none"></div>
    
    <header class="mb-8 relative z-10 flex items-center justify-between">
      <h2 class="text-[11px] font-black text-emerald-500 dark:text-emerald-400 uppercase tracking-[0.25em] flex items-center gap-3">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        Manual Payload Uplink
      </h2>
      <div v-if="loading" class="flex items-center gap-2 px-3 py-1 bg-emerald-50 dark:bg-emerald-500/10 rounded-full">
        <span class="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
        <span class="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">Injecting Data...</span>
      </div>
    </header>

    <div class="space-y-6 relative z-10">
      <div class="space-y-2">
        <label class="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Target Quiz</label>
        <select v-model="selectedQuizId" class="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-2xl px-5 py-4 text-sm text-zinc-900 dark:text-white focus:ring-2 focus:ring-emerald-500/20 transition-all shadow-sm appearance-none">
          <option value="" disabled>Select destination</option>
          <option v-for="q in quizzes" :key="q._id" :value="q._id">{{ q.title }}</option>
        </select>
      </div>

      <div class="space-y-2">
        <label class="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">JSON Payload (Paste prepared questions)</label>
        <textarea v-model="payload" class="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-2xl px-6 py-5 text-xs text-zinc-900 dark:text-white focus:ring-2 focus:ring-emerald-500/20 transition-all shadow-sm h-48 font-mono resize-none border-dashed" placeholder='[{"question": "...", "options": ["...", "..."], "answer": "..."}]'></textarea>
      </div>

      <button @click="handleImport" :disabled="!selectedQuizId || !payload || loading" class="w-full bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white font-black py-5 px-4 rounded-[24px] transition-all shadow-xl shadow-emerald-500/20 dark:shadow-none disabled:opacity-50 flex justify-center items-center gap-4 text-[11px] uppercase tracking-[0.2em]">
        <div v-if="loading" class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
        <span>{{ loading ? 'Injecting Data...' : 'Import Question Payload' }}</span>
      </button>
      
      <p class="text-[9px] text-zinc-400 text-center font-bold uppercase tracking-widest leading-relaxed">
        Requires an array of objects with <br/> "question", "options", and "answer" fields.
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import api from '../../api/axios';

const props = defineProps({
  quizzes: Array
});

const emit = defineEmits(['imported']);

const selectedQuizId = ref('');
const payload = ref('');
const loading = ref(false);

const handleImport = async () => {
  if (!selectedQuizId.value || !payload.value) return;
  
  loading.value = true;
  try {
    const rawData = JSON.parse(payload.value);
    const questions = Array.isArray(rawData) ? rawData : [rawData];
    
    // Auto-map format from payload to model format if needed
    // Assuming backend takes the standard text/options/explanation format if we use the batch endpoint
    // OR we convert it here:
    const mappedQuestions = questions.map(q => {
      // Handle "question" (input) -> "text" (model)
      const text = q.text || q.question;
      // Handle "answer" (input) -> "isCorrect" in options (model)
      const options = (q.options || []).map(opt => ({
        text: opt,
        isCorrect: opt === q.answer
      }));
      
      return { text, options, explanation: q.explanation || 'Legacy import question.' };
    });

    // Send to a batch endpoint
    await api.post(`/quizzes/${selectedQuizId.value}/batch-questions`, { questions: mappedQuestions });
    
    payload.value = '';
    emit('imported');
  } catch (err) {
    alert('Invalid JSON or transmission failure.');
    console.error(err);
  } finally {
    loading.value = false;
  }
};
</script>
