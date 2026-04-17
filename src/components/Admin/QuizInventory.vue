<template>
  <div v-for="quiz in quizzes" :key="quiz._id" 
       class="bg-[var(--neo-surface)] border border-zinc-200 dark:border-zinc-800 rounded-[32px] p-8 hover:shadow-neo-md transition-all duration-500 group mb-8">
    <div class="flex items-center justify-between gap-6">
      <div class="flex-1 min-w-0">
        <h3 class="text-[19px] font-black text-zinc-900 dark:text-zinc-100 uppercase tracking-tight leading-none mb-3 group-hover:text-brand transition-colors">{{ quiz.title }}</h3>
        <p class="text-[9px] font-black text-zinc-400 uppercase tracking-[0.3em] flex items-center gap-3">
          <span class="text-brand/80">{{ quiz.course?.title || 'General Subject' }}</span>
          <span class="w-1 h-1 bg-zinc-200 dark:bg-zinc-700 rounded-full"></span>
          <span class="text-emerald-500">{{ quiz.course?.level || 'N/A' }}</span>
          <span class="w-1 h-1 bg-zinc-200 dark:bg-zinc-700 rounded-full"></span>
          <span>{{ quiz.questions?.length || 0 }} Questions</span>
        </p>
      </div>
      <div class="flex items-center gap-2.5">
        <button @click="emit('rename', quiz)" class="w-11 h-11 bg-zinc-50 dark:bg-zinc-800/50 text-zinc-400 hover:text-zinc-900 dark:hover:text-white rounded-2xl shadow-neo-pill flex items-center justify-center transition-all" title="Rename Test">
          <Pencil :size="18" :stroke-width="2" />
        </button>
        <button @click="emit('delete', quiz._id)" class="w-11 h-11 bg-rose-50 dark:bg-rose-500/5 text-rose-400 hover:bg-rose-500 hover:text-white rounded-2xl shadow-neo-pill flex items-center justify-center transition-all" title="Delete Test">
          <Trash2 :size="18" :stroke-width="2" />
        </button>
      </div>
    </div>
    
    <div class="mt-8 flex items-center gap-4 p-5 bg-zinc-50 dark:bg-zinc-800/40 rounded-2xl border border-zinc-100 dark:border-zinc-800/50 transition-colors group-hover:border-brand/20 overflow-hidden shadow-neo-inner">
      <div class="flex-1 flex flex-col gap-1 overflow-hidden">
        <span class="text-[9px] font-black text-brand uppercase tracking-[0.2em] ml-1">Practice Link</span>
        <input type="text" readonly :value="getPracticeLink(quiz._id)" class="bg-transparent text-[11px] font-mono text-zinc-400 focus:outline-none truncate px-1">
      </div>
      <button @click="emit('copy', quiz._id)" class="px-6 h-11 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-[10px] font-black uppercase tracking-[0.2em] rounded-xl hover:scale-105 active:scale-95 transition-all shadow-neo flex items-center gap-2">
        <Copy :size="12" />
        <span>Copy Link</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { Pencil, Trash2, Copy } from 'lucide-vue-next';

const props = defineProps({
  quizzes: Array
});

const emit = defineEmits(['rename', 'delete', 'copy']);

const getPracticeLink = (id) => {
  return `${window.location.origin}/practice/${id}`;
};
</script>
