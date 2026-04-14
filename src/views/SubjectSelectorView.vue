<template>
  <NeoAppShell>
    <div class="px-4 sm:px-8 py-8">
      <!-- Header -->
      <header class="mb-8">
        <h1 class="text-2xl sm:text-3xl font-bold text-slate-400 dark:text-zinc-400 uppercase tracking-widest mb-2">Courses</h1>
        <p class="text-[15px] font-medium text-slate-500 dark:text-zinc-500">Select an exam body to filter available subjects.</p>
      </header>

      <!-- Filter Tabs -->
      <div class="flex items-center gap-2 border-b border-black/10 dark:border-white/10 mb-8 overflow-x-auto no-scrollbar">
        <button
          v-for="body in examBodies"
          :key="body"
          @click="selectedBody = body"
          class="px-5 py-2.5 text-[13px] font-semibold transition-all relative whitespace-nowrap"
          :class="selectedBody === body ? 'text-slate-900 dark:text-zinc-100' : 'text-slate-500 hover:text-slate-700 dark:hover:text-zinc-300'"
        >
          {{ body }}
          <div v-if="selectedBody === body" class="absolute bottom-0 left-0 right-0 h-[2px] bg-slate-800 dark:bg-zinc-200 rounded-full"></div>
        </button>
      </div>

      <!-- Subject Grid -->
      <div v-if="filteredQuizzes.length === 0" class="py-20 text-center">
        <p class="text-slate-400 dark:text-zinc-500 text-[15px]">No subjects found for {{ selectedBody }}.</p>
      </div>
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
        <div
          v-for="quiz in filteredQuizzes"
          :key="quiz._id"
          class="bg-[var(--neo-surface)] rounded-[24px] shadow-neo border border-white/20 dark:border-white/5 p-6 group cursor-pointer hover:shadow-neo-md transition-all duration-300"
          @click="startQuiz(quiz._id)"
        >
          <div class="flex items-start justify-between mb-5">
            <div class="w-11 h-11 rounded-[14px] bg-slate-100 dark:bg-zinc-800 flex items-center justify-center text-[20px]">
              {{ getIcon(quiz.title) }}
            </div>
            <div class="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-zinc-800 text-[11px] font-medium text-slate-500 dark:text-zinc-500">
              {{ quiz.questions?.length || 0 }} Q
            </div>
          </div>
          
          <h3 class="text-[17px] font-semibold text-slate-800 dark:text-zinc-100 mb-1">{{ quiz.title }}</h3>
          <p class="text-[13px] text-slate-500 dark:text-zinc-500 mb-5">{{ quiz.description || 'Comprehensive practice set' }}</p>
          
          <div class="pt-4 border-t border-dashed border-black/10 dark:border-white/10 flex items-center justify-between">
            <div class="text-[12px] text-slate-500">
              Last score: <span class="font-semibold text-slate-800 dark:text-zinc-200">{{ getLastScore(quiz._id) }}%</span>
            </div>
            <span class="text-[13px] font-medium text-slate-500 group-hover:translate-x-1 transition-transform">Start →</span>
          </div>
        </div>
      </div>
    </div>
  </NeoAppShell>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useQuizStore } from '../store/quiz';
import NeoAppShell from '../components/layout/NeoAppShell.vue';

const router = useRouter();
const quizStore = useQuizStore();

const examBodies = ['All', 'JAMB', 'WAEC', 'NECO'];
const selectedBody = ref('All');

const filteredQuizzes = computed(() => {
  if (selectedBody.value === 'All') return quizStore.quizzes;
  return quizStore.quizzes.filter(q => q.examBody === selectedBody.value || q.examType === selectedBody.value);
});

onMounted(() => {
  quizStore.fetchQuizzes();
  quizStore.fetchMySubmissions();
});

const getIcon = (title) => {
  const icons = {
    'Mathematics': '🧮', 'English': '📘', 'Physics': '🧪',
    'Biology': '🌿', 'Chemistry': '⚗️', 'Economics': '📈', 'Government': '🏛️'
  };
  return icons[title] || '📚';
};

const getLastScore = (id) => {
  const related = quizStore.mySubmissions.filter(s => s.quiz?._id === id);
  if (related.length === 0) return 0;
  const last = related[related.length - 1];
  return Math.round((last.score / last.totalQuestions) * 100);
};

const startQuiz = (id) => {
  router.push(`/quiz/${id}`);
};
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
</style>
