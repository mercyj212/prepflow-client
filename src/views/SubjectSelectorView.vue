<template>
  <div class="min-h-screen bg-surface-primary dark:bg-zinc-950 text-slate-900 dark:text-zinc-100 pb-12">
    <nav class="sticky top-0 z-50 bg-white dark:bg-zinc-950 border-b border-border-light dark:border-border-dark px-4 sm:px-6 py-4">
      <div class="max-w-6xl mx-auto flex items-center justify-between gap-4">
        <div class="flex items-center gap-3">
          <button @click="router.push('/dashboard')" type="button" class="w-10 h-10 rounded-lg border-[0.5px] border-border-light flex items-center justify-center text-slate-600">
            ←
          </button>
          <BrandLogo />
        </div>
        <ThemeToggle />
      </div>
    </nav>

    <main class="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <header class="mb-10">
        <h1 class="text-[32px] font-medium text-slate-900 dark:text-white leading-tight">Pick a subject</h1>
        <p class="mt-2 text-[16px] font-normal text-slate-500">Select an exam body to filter available subjects.</p>
      </header>

      <!-- Filter Tabs -->
      <div class="flex items-center gap-2 border-b border-border-light dark:border-border-dark mb-10 overflow-x-auto no-scrollbar">
        <button
          v-for="body in examBodies"
          :key="body"
          @click="selectedBody = body"
          class="px-6 py-3 text-[14px] font-medium transition-all relative"
          :class="selectedBody === body ? 'text-brand' : 'text-slate-500 hover:text-slate-700'"
        >
          {{ body }}
          <div v-if="selectedBody === body" class="absolute bottom-0 left-0 right-0 h-[2px] bg-brand"></div>
        </button>
      </div>

      <!-- Subject Grid -->
      <div v-if="filteredQuizzes.length === 0" class="py-20 text-center">
        <p class="text-slate-500">No subjects found for {{ selectedBody }}.</p>
      </div>
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="quiz in filteredQuizzes"
          :key="quiz._id"
          class="flat-card p-6 group cursor-pointer hover:border-brand/30 transition-colors"
          @click="startQuiz(quiz._id)"
        >
          <div class="flex items-start justify-between mb-6">
            <div class="w-12 h-12 rounded-xl bg-slate-50 dark:bg-zinc-800 border-[0.5px] border-border-light dark:border-border-dark flex items-center justify-center text-[22px]">
              {{ getIcon(quiz.title) }}
            </div>
            <div class="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-zinc-800 text-[11px] font-medium text-slate-600 dark:text-zinc-400">
              {{ quiz.questions?.length || 0 }} topics
            </div>
          </div>
          
          <h3 class="text-[18px] font-medium text-slate-900 dark:text-white mb-1">{{ quiz.title }}</h3>
          <p class="text-[13px] font-normal text-slate-500 mb-6">{{ quiz.description || 'Comprehensive practice set' }}</p>
          
          <div class="pt-5 border-t border-dashed border-border-light dark:border-border-dark flex items-center justify-between">
            <div class="text-[12px] font-normal text-slate-500">
              Last score: <span class="font-medium text-slate-900 dark:text-zinc-200">{{ getLastScore(quiz._id) }}%</span>
            </div>
            <span class="text-brand text-[13px] font-medium group-hover:translate-x-1 transition-transform">Start test →</span>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useQuizStore } from '../store/quiz';
import BrandLogo from '../components/BrandLogo.vue';
import ThemeToggle from '../components/ThemeToggle.vue';

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
    'Mathematics': '🧮',
    'English': '📘',
    'Physics': '🧪',
    'Biology': '🌿',
    'Chemistry': '⚗️',
    'Economics': '📈',
    'Government': '🏛️'
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
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
