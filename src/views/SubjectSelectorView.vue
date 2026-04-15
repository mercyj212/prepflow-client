<template>
  <NeoAppShell>
    <div class="px-6 sm:px-12 py-12">
      <!-- Breadcrumbs -->
      <nav class="flex items-center gap-2 mb-8 text-[11px] font-black uppercase tracking-[0.2em] text-zinc-400">
        <router-link to="/subjects" class="hover:text-zinc-900 dark:hover:text-white transition-colors">Path</router-link>
        <span>/</span>
        <router-link :to="`/subjects/${path}`" class="hover:text-zinc-900 dark:hover:text-white transition-colors">{{ pathName }}</router-link>
        <span>/</span>
        <span class="text-zinc-900 dark:text-zinc-100">{{ categoryName }}</span>
      </nav>

      <!-- Header Section -->
      <header class="mb-16">
        <h1 class="text-[42px] font-medium text-zinc-900 dark:text-zinc-100 tracking-tighter leading-none mb-4">
          {{ categoryName }} Subjects
        </h1>
        <p class="text-[16px] font-normal text-zinc-500 dark:text-zinc-500 max-w-xl leading-relaxed">
          Browse specialized materials for {{ categoryName }}. Filter by level to find exactly what you need.
        </p>
      </header>

      <!-- Adaptive Level Filter -->
      <div v-if="path !== 'entrance'" class="flex items-center gap-4 mb-16 overflow-x-auto no-scrollbar pb-4 -mx-1 px-1">
        <button
          v-for="level in availableLevels"
          :key="level"
          @click="selectedLevel = level"
          class="px-8 h-12 rounded-full text-[11px] font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap border flex items-center justify-center min-w-[120px]"
          :class="selectedLevel === level 
            ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 border-zinc-900 dark:border-white shadow-neo-pill' 
            : 'bg-transparent text-zinc-400 border-zinc-200 dark:border-zinc-800 hover:border-zinc-900 dark:hover:border-white hover:text-zinc-900 dark:hover:text-white'"
        >
          {{ level === 'All' ? 'All Levels' : level }}
        </button>
      </div>

      <!-- Subject Matrix -->
      <div v-if="filteredQuizzes.length === 0" class="py-32 text-center">
        <p class="text-[12px] font-black text-zinc-400 uppercase tracking-[0.4em]">No subjects found for this criteria.</p>
        <button @click="selectedLevel = 'All'" class="mt-8 text-[11px] font-bold underline underline-offset-4 hover:text-zinc-900 dark:hover:text-zinc-300">Clear filter</button>
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
              <div class="w-14 h-14 rounded-[22px] bg-zinc-50 dark:bg-zinc-800/50 flex items-center justify-center shadow-neo-inner group-hover:scale-110 transition-transform duration-500">
                <component 
                  :is="getIconComponent(quiz.title)" 
                  :size="24" 
                  :stroke-width="1.5"
                  class="text-zinc-600 dark:text-zinc-400 transition-colors"
                />
              </div>
              <div class="flex flex-col items-end">
                <span class="px-3 py-1.5 rounded-full bg-zinc-900/5 dark:bg-white/5 border border-zinc-900/10 dark:border-white/10 text-[9px] font-black text-zinc-900 dark:text-zinc-100 uppercase tracking-[0.2em] mb-2">
                  {{ quiz.questions?.length || 0 }} Items
                </span>
                <span v-if="getLastScore(quiz._id) > 0" class="text-[9px] font-black text-zinc-500 uppercase tracking-widest">
                  Last: {{ getLastScore(quiz._id) }}%
                </span>
              </div>
            </div>
            
            <div class="flex-1">
              <h3 class="text-[22px] font-medium text-zinc-900 dark:text-zinc-100 tracking-tight leading-none mb-3 group-hover:text-zinc-500 transition-colors">
                {{ quiz.title }}
              </h3>
              <p class="text-[14px] font-normal text-zinc-500 dark:text-zinc-500 line-clamp-2 leading-relaxed mb-8">
                {{ quiz.description || 'A complete test covering the most important topics and problem-solving skills.' }}
              </p>
            </div>

            <div class="pt-6 border-t border-zinc-100 dark:border-zinc-800/50 flex items-center justify-between">
              <span class="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em] group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">
                Start Practice
              </span>
              <div class="w-10 h-10 rounded-full border border-zinc-200 dark:border-zinc-800 flex items-center justify-center group-hover:bg-zinc-900 dark:group-hover:bg-white group-hover:border-zinc-900 dark:group-hover:border-white group-hover:text-white dark:group-hover:text-zinc-900 transition-all duration-300">
                <ArrowRight :size="18" :stroke-width="2" class="group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          </NeoCard>
          <div class="absolute -z-10 -bottom-2 -right-2 w-full h-full bg-zinc-900/5 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity rounded-[32px]"></div>
        </div>
      </div>
    </div>
  </NeoAppShell>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { 
  ArrowRight,
  Calculator,
  Languages,
  Atom,
  Dna,
  FlaskRound,
  TrendingUp,
  Landmark,
  Book,
  FileText
} from 'lucide-vue-next';
import { useQuizStore } from '../store/quiz';
import NeoAppShell from '../components/layout/NeoAppShell.vue';
import NeoCard from '../components/common/NeoCard.vue';

const route = useRoute();
const router = useRouter();
const quizStore = useQuizStore();

const path = computed(() => route.params.path || 'university');
const category = computed(() => route.params.category || '');

const pathName = computed(() => {
  const names = { 'university': 'University', 'polytechnic': 'Polytechnic', 'entrance': 'Entrance Exams' };
  return names[path.value] || path.value;
});

const categoryName = computed(() => {
  if (!category.value) return '';
  return category.value.charAt(0).toUpperCase() + category.value.slice(1);
});

const availableLevels = computed(() => {
  if (path.value === 'university') return ['All', '100L', '200L', '300L', '400L', '500L'];
  if (path.value === 'polytechnic') return ['All', 'ND1', 'ND2', 'HND1', 'HND2'];
  return ['All'];
});

const selectedLevel = ref('All');

// Smart Filtering Logic
const filteredQuizzes = computed(() => {
  let list = quizStore.quizzes;

  if (path.value === 'entrance') {
    list = list.filter(q => 
      q.examBody?.toLowerCase() === category.value || 
      q.examType?.toLowerCase() === category.value ||
      q.title?.toLowerCase().includes(category.value)
    );
  } else {
    const deptKeywords = {
      'engineering': ['math', 'physics', 'tech', 'calc', 'eng'],
      'sciences': ['bio', 'chem', 'math', 'comp', 'phys', 'sci'],
      'health': ['bio', 'anat', 'pharm', 'nurse', 'health'],
      'arts': ['hist', 'lit', 'phil', 'art', 'eng'],
      'social': ['econ', 'psych', 'govt', 'soc'],
      'management': ['acc', 'bus', 'fin', 'mgt']
    };
    
    const keywords = deptKeywords[category.value] || [];
    if (category.value !== 'all') {
      list = list.filter(q => 
        q.department === category.value ||
        keywords.some(k => q.title?.toLowerCase().includes(k))
      );
    }
  }

  if (selectedLevel.value !== 'All') {
    list = list.filter(q => {
      const qLevel = q.level || (path.value === 'university' ? '100L' : 'ND1');
      return qLevel === selectedLevel.value;
    });
  }

  return list;
});

onMounted(() => {
  quizStore.fetchQuizzes();
  quizStore.fetchMySubmissions();
});

const getIconComponent = (title) => {
  const lowerTitle = title.toLowerCase();
  
  if (lowerTitle.includes('math')) return Calculator;
  if (lowerTitle.includes('english') || lowerTitle.includes('lit')) return Languages;
  if (lowerTitle.includes('phys')) return Atom;
  if (lowerTitle.includes('bio')) return Dna;
  if (lowerTitle.includes('chem')) return FlaskRound;
  if (lowerTitle.includes('econ') || lowerTitle.includes('acc') || lowerTitle.includes('fin')) return TrendingUp;
  if (lowerTitle.includes('govt') || lowerTitle.includes('pol') || lowerTitle.includes('phil')) return Landmark;
  
  return Book;
};

const getLastScore = (id) => {
  const related = quizStore.mySubmissions.filter(s => s.quiz?._id === id);
  if (related.length === 0) return 0;
  const last = related[related.length - 1];
  if (!last.totalQuestions) return 0;
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
