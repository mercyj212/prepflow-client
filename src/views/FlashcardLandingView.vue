<template>
  <NeoAppShell>
    <div class="px-4 sm:px-8 py-8 max-w-7xl mx-auto">

      <!-- Header Section -->
      <header class="mb-10">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
          <div>
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900/5 dark:bg-white/5 border border-zinc-900/10 dark:border-white/10 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 dark:text-zinc-400 mb-3">
              <Sparkles :size="12" class="text-amber-500 animate-pulse" /> Categorized Decks
            </div>
            <h1 class="text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">Flashcards & Study Decks</h1>
            <p class="text-[14px] text-zinc-500 dark:text-zinc-400 mt-1 max-w-xl">Master your CBT courses with active recall. Filter by department and level to jump right in.</p>
          </div>

          <!-- Search Bar -->
          <div class="relative w-full md:w-72">
            <Search :size="16" class="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search flashcards..."
              class="w-full h-11 pl-11 pr-4 rounded-2xl bg-zinc-100/80 dark:bg-zinc-800/80 border border-zinc-200/50 dark:border-white/10 text-[13px] text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white transition-all"
            />
            <button
              v-if="searchQuery"
              @click="searchQuery = ''"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
            >
              ✕
            </button>
          </div>
        </div>

        <!-- Department Filter Pills -->
        <div class="space-y-3">
          <div class="flex items-center gap-2 text-[11px] font-black uppercase tracking-wider text-zinc-400">
            <Layers :size="14" /> Department Filter
          </div>
          <div class="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
            <button
              v-for="dept in availableDepartments"
              :key="dept"
              @click="selectedDepartment = dept"
              class="px-5 h-9 rounded-full text-[11px] font-bold uppercase tracking-wider transition-all whitespace-nowrap border flex items-center gap-2 shrink-0"
              :class="selectedDepartment === dept 
                ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 border-zinc-900 dark:border-white shadow-neo-pill' 
                : 'bg-zinc-100/50 dark:bg-zinc-800/50 text-zinc-500 dark:text-zinc-400 border-zinc-200/60 dark:border-white/5 hover:border-zinc-400 dark:hover:border-zinc-600 hover:text-zinc-900 dark:hover:text-white'"
            >
              <component :is="getDeptIcon(dept)" :size="13" />
              {{ dept }}
            </button>
          </div>
        </div>

        <!-- Level Filter Pills -->
        <div class="space-y-3 mt-4">
          <div class="flex items-center gap-2 text-[11px] font-black uppercase tracking-wider text-zinc-400">
            <GraduationCap :size="14" /> Academic Level
          </div>
          <div class="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
            <button
              v-for="level in availableLevels"
              :key="level"
              @click="selectedLevel = level"
              class="px-5 h-9 rounded-full text-[11px] font-bold uppercase tracking-wider transition-all whitespace-nowrap border shrink-0"
              :class="selectedLevel === level 
                ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 border-zinc-900 dark:border-white shadow-neo-pill' 
                : 'bg-zinc-100/50 dark:bg-zinc-800/50 text-zinc-500 dark:text-zinc-400 border-zinc-200/60 dark:border-white/5 hover:border-zinc-400 dark:hover:border-zinc-600 hover:text-zinc-900 dark:hover:text-white'"
            >
              {{ level === 'All' ? 'All Levels' : level }}
            </button>
          </div>
        </div>
      </header>

      <!-- Loading Skeleton -->
      <div v-if="quizStore.loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        <div v-for="i in 6" :key="i" class="p-8 h-64 rounded-[28px] border border-zinc-100 dark:border-white/5 bg-zinc-50/50 dark:bg-zinc-900/50">
          <div class="flex justify-between mb-8">
            <BaseSkeleton width="56px" height="56px" customClass="!rounded-[22px]" />
            <BaseSkeleton width="80px" height="28px" customClass="rounded-full" />
          </div>
          <BaseSkeleton width="75%" height="24px" customClass="mb-4" />
          <BaseSkeleton width="100%" height="16px" customClass="mb-2" />
          <BaseSkeleton width="66%" height="16px" />
        </div>
      </div>

      <!-- Empty State -->
      <div v-else-if="filteredQuizzes.length === 0" class="flex flex-col items-center justify-center py-24 text-center">
        <div class="w-16 h-16 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-4 text-zinc-400">
          <BookOpen :size="32" />
        </div>
        <h2 class="text-lg font-bold text-zinc-800 dark:text-zinc-200 mb-1">No Flashcards Found</h2>
        <p class="text-[13px] text-zinc-400 dark:text-zinc-500 max-w-sm">No flashcard decks match your current department or level filter.</p>
        <button
          @click="resetFilters"
          class="mt-6 px-6 h-10 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-opacity"
        >
          Reset All Filters
        </button>
      </div>

      <!-- Categorized Decks Display -->
      <div v-else class="space-y-14">
        <div v-for="(group, groupName) in groupedQuizzes" :key="groupName" class="space-y-6">
          
          <!-- Category Section Header -->
          <div class="flex items-center gap-4">
            <div class="w-2.5 h-2.5 rounded-full bg-amber-500"></div>
            <h2 class="text-sm font-black uppercase tracking-[0.25em] text-zinc-600 dark:text-zinc-400">
              {{ groupName }}
            </h2>
            <span class="px-2.5 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-[10px] font-bold text-zinc-400">
              {{ group.length }} {{ group.length === 1 ? 'Deck' : 'Decks' }}
            </span>
            <div class="h-px flex-grow bg-zinc-200/60 dark:bg-zinc-800/80"></div>
          </div>

          <!-- Course Cards Grid -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div
              v-for="quiz in group"
              :key="quiz._id"
              @click="$router.push(`/flashcards/${quiz._id}`)"
              class="group cursor-pointer bg-white dark:bg-zinc-900 rounded-[28px] shadow-neo border border-zinc-100 dark:border-white/5 p-7 hover:shadow-neo-md transition-all duration-500 hover:-translate-y-1 flex flex-col justify-between"
            >
              <div>
                <!-- Top Row: Icon + Card Count Badge -->
                <div class="flex items-start justify-between mb-6">
                  <div class="w-13 h-13 rounded-[20px] bg-zinc-50 dark:bg-zinc-800/60 flex items-center justify-center shadow-neo-inner group-hover:scale-110 transition-transform duration-500">
                    <component 
                      :is="getIconComponent(quiz.title)" 
                      :size="22" 
                      :stroke-width="1.5"
                      class="text-zinc-700 dark:text-zinc-300 transition-colors"
                    />
                  </div>
                  <div class="flex flex-col items-end gap-1">
                    <span class="px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 text-[9px] font-black uppercase tracking-widest">
                      {{ quiz.questions?.length || 0 }} Cards
                    </span>
                    <span v-if="getQuizDept(quiz)" class="text-[9px] font-bold uppercase tracking-wider text-zinc-400">
                      {{ getQuizDept(quiz) }}
                    </span>
                  </div>
                </div>

                <!-- Title & Description -->
                <h3 class="text-[19px] font-bold text-zinc-900 dark:text-zinc-100 tracking-tight leading-snug mb-2 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                  {{ quiz.title }}
                </h3>
                <p class="text-[13px] text-zinc-500 dark:text-zinc-400 line-clamp-2 leading-relaxed mb-6">
                  {{ quiz.description || 'Practice flashcards covering key terms and concepts.' }}
                </p>
              </div>

              <!-- Footer Row: Stack preview & Action -->
              <div class="pt-5 border-t border-zinc-100 dark:border-zinc-800/60 flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <span v-if="quiz.course?.level" class="px-2.5 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-[10px] font-black uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                    {{ quiz.course.level }}
                  </span>
                  <span v-if="quiz.course?.semester" class="text-[10px] font-medium text-zinc-400">
                    {{ quiz.course.semester }}
                  </span>
                </div>
                <div class="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-widest text-zinc-600 dark:text-zinc-300 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                  Study <ArrowRight :size="14" :stroke-width="2" class="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

    </div>
  </NeoAppShell>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { 
  ArrowRight,
  Sparkles,
  Search,
  Layers,
  GraduationCap,
  BookOpen,
  Calculator,
  Languages,
  Atom,
  Dna,
  FlaskRound,
  TrendingUp,
  Landmark,
  Book,
  Code,
  Brain,
  Globe,
  Shield
} from 'lucide-vue-next';
import { useQuizStore } from '../store/quiz';
import NeoAppShell from '../components/layout/NeoAppShell.vue';
import BaseSkeleton from '../components/common/BaseSkeleton.vue';

const router = useRouter();
const quizStore = useQuizStore();

const searchQuery = ref('');
const selectedDepartment = ref('All');
const selectedLevel = ref('All');

const availableDepartments = [
  'All',
  'Software and Web Development',
  'Artificial Intelligence',
  'Networking and Cloud Computing',
  'Cyber Security',
  'Computer Science'
];

const availableLevels = ['All', 'ND1', 'ND2', 'HND1', 'HND2'];

const resetFilters = () => {
  searchQuery.value = '';
  selectedDepartment.value = 'All';
  selectedLevel.value = 'All';
};

const getQuizDept = (quiz) => {
  return quiz.course?.department?.name || quiz.department?.name || '';
};

const getDeptIcon = (deptName) => {
  const name = deptName.toLowerCase();
  if (name.includes('software') || name.includes('web')) return Code;
  if (name.includes('ai') || name.includes('artificial')) return Brain;
  if (name.includes('network') || name.includes('cloud')) return Globe;
  if (name.includes('cyber') || name.includes('security')) return Shield;
  if (name.includes('computer')) return Code;
  return Layers;
};

const getIconComponent = (title) => {
  const lowerTitle = title.toLowerCase();
  
  if (lowerTitle.includes('eed') || lowerTitle.includes('entrepreneurship')) return TrendingUp;
  if (lowerTitle.includes('gns') || lowerTitle.includes('communication') || lowerTitle.includes('logic')) return Languages;
  if (lowerTitle.includes('math')) return Calculator;
  if (lowerTitle.includes('english') || lowerTitle.includes('lit')) return Languages;
  if (lowerTitle.includes('phys')) return Atom;
  if (lowerTitle.includes('bio')) return Dna;
  if (lowerTitle.includes('chem')) return FlaskRound;
  if (lowerTitle.includes('code') || lowerTitle.includes('programming')) return Code;
  if (lowerTitle.includes('security') || lowerTitle.includes('cyber')) return Shield;
  
  return Book;
};

const filteredQuizzes = computed(() => {
  return quizStore.quizzes.filter(quiz => {
    // 1. Search Query Filter
    if (searchQuery.value.trim()) {
      const q = searchQuery.value.toLowerCase();
      const titleMatch = quiz.title?.toLowerCase().includes(q);
      const descMatch = quiz.description?.toLowerCase().includes(q);
      const courseMatch = quiz.course?.title?.toLowerCase().includes(q);
      if (!titleMatch && !descMatch && !courseMatch) return false;
    }

    // 2. Department Filter
    if (selectedDepartment.value !== 'All') {
      const deptName = getQuizDept(quiz).toLowerCase();
      const targetDept = selectedDepartment.value.toLowerCase();
      if (!deptName.includes(targetDept) && !targetDept.includes(deptName)) return false;
    }

    // 3. Level Filter
    if (selectedLevel.value !== 'All') {
      const level = quiz.course?.level || quiz.level;
      if (level !== selectedLevel.value) return false;
    }

    return true;
  });
});

const groupedQuizzes = computed(() => {
  const groups = {};

  filteredQuizzes.value.forEach(quiz => {
    const dept = getQuizDept(quiz) || 'General Courses';
    const level = quiz.course?.level || quiz.level || 'All Levels';
    const groupKey = `${dept} (${level})`;

    if (!groups[groupKey]) {
      groups[groupKey] = [];
    }
    groups[groupKey].push(quiz);
  });

  return groups;
});

onMounted(() => {
  quizStore.fetchQuizzes();
});
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
</style>
