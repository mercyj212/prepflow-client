<template>
  <NeoAppShell>
    <div class="px-6 sm:px-12 py-12">
      <!-- Header Section -->
      <header class="mb-16">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-2 h-2 bg-brand rounded-full"></div>
          <span class="text-[10px] font-black text-brand uppercase tracking-[0.4em]">Resource Directory</span>
        </div>
        <h1 class="text-[42px] font-medium text-slate-900 dark:text-zinc-100 tracking-tighter leading-none mb-4 italic">Academic Anthology</h1>
        <p class="text-[16px] font-normal text-slate-500 dark:text-zinc-500 max-w-xl leading-relaxed">Select a curriculum path to begin your sequence. Each module is synthesized to meet clinical performance standards.</p>
      </header>

      <!-- Premium Filter Architecture -->
      <div class="flex items-center gap-4 mb-16 overflow-x-auto no-scrollbar pb-4 -mx-1 px-1">
        <button
          v-for="body in examBodies"
          :key="body"
          @click="selectedBody = body"
          class="px-8 h-12 rounded-full text-[11px] font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap border flex items-center justify-center min-w-[120px]"
          :class="selectedBody === body 
            ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 border-zinc-900 dark:border-white shadow-neo-pill' 
            : 'bg-transparent text-slate-400 border-slate-200 dark:border-zinc-800 hover:border-brand hover:text-brand'"
        >
          {{ body }}
        </button>
      </div>

      <!-- Subject Matrix -->
      <div v-if="filteredQuizzes.length === 0" class="py-32 text-center">
        <p class="text-[12px] font-black text-slate-400 uppercase tracking-[0.4em]">Void detected. Select alternate node.</p>
      </div>
      
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        <div
          v-for="quiz in filteredQuizzes"
          :key="quiz._id"
          class="group cursor-pointer relative"
          @click="startQuiz(quiz._id)"
        >
          <NeoCard variant="hoverable" class="p-8 h-full flex flex-col">
            <div class="flex items-start justify-between mb-8">
              <div class="w-14 h-14 rounded-[22px] bg-slate-50 dark:bg-zinc-800/50 flex items-center justify-center text-[24px] shadow-neo-inner group-hover:scale-110 transition-transform duration-500">
                {{ getIcon(quiz.title) }}
              </div>
              <div class="flex flex-col items-end">
                <span class="px-3 py-1.5 rounded-full bg-brand/5 border border-brand/10 text-[9px] font-black text-brand uppercase tracking-[0.2em] mb-2">
                  {{ quiz.questions?.length || 0 }} Items
                </span>
                <span v-if="getLastScore(quiz._id) > 0" class="text-[9px] font-black text-emerald-500 uppercase tracking-widest">
                  Last: {{ getLastScore(quiz._id) }}%
                </span>
              </div>
            </div>
            
            <div class="flex-1">
              <h3 class="text-[22px] font-medium text-slate-900 dark:text-zinc-100 tracking-tight leading-none mb-3 group-hover:text-brand transition-colors italic">
                {{ quiz.title }}
              </h3>
              <p class="text-[14px] font-normal text-slate-500 dark:text-zinc-500 line-clamp-2 leading-relaxed mb-8">
                {{ quiz.description || 'Systematic assessment of core curriculum principles and strategic logic.' }}
              </p>
            </div>

            <div class="pt-6 border-t border-slate-100 dark:border-zinc-800/50 flex items-center justify-between">
              <span class="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                Initiate Sequence
              </span>
              <div class="w-10 h-10 rounded-full border border-slate-200 dark:border-zinc-800 flex items-center justify-center group-hover:bg-brand group-hover:border-brand group-hover:text-white transition-all duration-300">
                <svg class="w-5 h-5 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
              </div>
            </div>
          </NeoCard>
          
          <!-- Decorative element -->
          <div class="absolute -z-10 -bottom-2 -right-2 w-full h-full bg-brand/5 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity rounded-[32px]"></div>
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
import NeoCard from '../components/common/NeoCard.vue';

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
