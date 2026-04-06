<template>
  <div v-for="quiz in quizzes" :key="quiz._id" 
       class="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 hover:shadow-xl hover:shadow-zinc-900/5 transition-all duration-500 group mb-6">
    <div class="flex items-center justify-between gap-6">
      <div class="flex-1 min-w-0">
        <h3 class="text-xl font-black text-zinc-900 dark:text-white tracking-tighter leading-none mb-3 group-hover:text-indigo-500 transition-colors">{{ quiz.title }}</h3>
        <p class="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] flex items-center gap-3">
          <span>{{ quiz.course?.title || 'General Curriculum' }}</span>
          <span class="w-1 h-1 bg-zinc-300 rounded-full"></span>
          <span>{{ quiz.questions?.length || 0 }} Questions Generated</span>
        </p>
      </div>
      <div class="flex items-center gap-2">
        <button @click="emit('rename', quiz)" class="p-3 bg-zinc-50 dark:bg-zinc-800 text-zinc-400 hover:text-black dark:hover:text-white rounded-[18px] transition-all">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
        </button>
        <button @click="emit('delete', quiz._id)" class="p-3 bg-red-50 dark:bg-red-500/10 text-red-300 hover:text-red-500 rounded-[18px] transition-all">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
        </button>
      </div>
    </div>
    
    <div class="mt-6 flex items-center gap-4 p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl border border-zinc-100 dark:border-zinc-800 transition-colors group-hover:border-indigo-500/20 overflow-hidden">
      <div class="flex-1 flex flex-col gap-1 overflow-hidden">
        <span class="text-[9px] font-black text-indigo-500 uppercase tracking-widest ml-1">Practice Link Access</span>
        <input type="text" readonly :value="getPracticeLink(quiz._id)" class="bg-transparent text-[11px] font-mono text-zinc-400 focus:outline-none truncate px-1">
      </div>
      <button @click="emit('copy', quiz._id)" class="px-5 py-3 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-[10px] font-black uppercase tracking-[0.2em] rounded-xl hover:scale-105 active:scale-95 transition-all">
        Copy Path
      </button>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  quizzes: Array
});

const emit = defineEmits(['rename', 'delete', 'copy']);

const getPracticeLink = (id) => {
  return `${window.location.origin}/practice/${id}`;
};
</script>
