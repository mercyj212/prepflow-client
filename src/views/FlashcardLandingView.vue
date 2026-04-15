<template>
  <NeoAppShell>
    <div class="px-4 sm:px-8 py-8">

      <!-- Header -->
      <header class="mb-12">
        <h1 class="text-2xl sm:text-3xl font-bold text-zinc-400 dark:text-zinc-400 uppercase tracking-widest mb-2">Flashcards</h1>
        <p class="text-[15px] font-medium text-zinc-500 dark:text-zinc-500">Select a course to start your flashcard session.</p>
      </header>

      <!-- Loading -->
      <NeoLoader v-if="quizStore.loading" label="Loading decks..." />

      <!-- Empty State -->
      <div v-else-if="quizStore.quizzes.length === 0" class="flex flex-col items-center justify-center py-32 text-center">
        <Sparkles :size="48" :stroke-width="1" class="text-zinc-300 mb-6" />
        <h2 class="text-xl font-semibold text-zinc-700 dark:text-zinc-300 mb-2">No decks available</h2>
        <p class="text-[13px] text-zinc-400 dark:text-zinc-500">Courses added by your admin will appear here.</p>
      </div>

      <!-- Course Card Grid -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
        <div
          v-for="quiz in quizStore.quizzes"
          :key="quiz._id"
          @click="$router.push(`/flashcards/${quiz._id}`)"
          class="group cursor-pointer bg-white dark:bg-zinc-900 rounded-[28px] shadow-neo border border-zinc-100 dark:border-white/5 p-8 hover:shadow-neo-md transition-all duration-500 hover:-translate-y-1"
        >
          <!-- Icon + card count -->
          <div class="flex items-start justify-between mb-8">
            <div class="w-14 h-14 rounded-[22px] bg-zinc-50 dark:bg-zinc-800/50 flex items-center justify-center shadow-neo-inner group-hover:scale-110 transition-transform duration-500">
              <component 
                :is="getIconComponent(quiz.title)" 
                :size="24" 
                :stroke-width="1.5"
                class="text-zinc-600 dark:text-zinc-400 transition-colors"
              />
            </div>
            <div class="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-white/5">
              <span class="text-[10px] font-black uppercase tracking-widest text-zinc-500 dark:text-zinc-400">{{ quiz.questions?.length || 0 }} cards</span>
            </div>
          </div>

          <!-- Title + description -->
          <h3 class="text-[20px] font-medium text-zinc-900 dark:text-zinc-100 tracking-tight mb-2">{{ quiz.title }}</h3>
          <p class="text-[14px] text-zinc-500 dark:text-zinc-500 line-clamp-2 leading-relaxed mb-8">{{ quiz.description || 'Tap to review the full flashcard deck.' }}</p>

          <!-- Footer row -->
          <div class="pt-6 border-t border-zinc-100 dark:border-zinc-800/50 flex items-center justify-between">
            <div class="flex items-center gap-3">
              <!-- Mini card preview stack -->
              <div class="flex -space-x-1.5">
                <div v-for="n in Math.min(3, quiz.questions?.length || 0)" :key="n"
                  class="w-5 h-7 rounded-md border border-white dark:border-zinc-800 shadow-sm transition-transform group-hover:-translate-y-1"
                  :style="{ transitionDelay: `${n * 50}ms` }"
                  :class="n === 1 ? 'bg-zinc-300 dark:bg-zinc-600' : n === 2 ? 'bg-zinc-200 dark:bg-zinc-700' : 'bg-zinc-100 dark:bg-zinc-800'">
                </div>
              </div>
              <span class="text-[12px] font-medium text-zinc-400 dark:text-zinc-500">Deck</span>
            </div>
            <div class="flex items-center gap-2 text-[13px] font-black uppercase tracking-widest text-zinc-500 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">
              Study <ArrowRight :size="16" :stroke-width="2" class="group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </NeoAppShell>
</template>

<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { 
  ArrowRight,
  Sparkles,
  Calculator,
  Languages,
  Atom,
  Dna,
  FlaskRound,
  TrendingUp,
  Landmark,
  Book
} from 'lucide-vue-next';
import { useQuizStore } from '../store/quiz';
import NeoAppShell from '../components/layout/NeoAppShell.vue';
import NeoLoader from '../components/common/NeoLoader.vue';

const router = useRouter();
const quizStore = useQuizStore();

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

onMounted(() => {
  quizStore.fetchQuizzes();
});
</script>
