<template>
  <NeoAppShell>
    <div class="px-4 sm:px-8 py-8 max-w-2xl mx-auto">

      <NeoLoader v-if="quizStore.loading" label="Loading flashcards..." />

      <div v-else-if="quizStore.error" class="flex flex-col items-center justify-center py-20 text-center">
        <p class="text-rose-500 font-semibold mb-4">{{ quizStore.error }}</p>
        <button @click="$router.push('/flashcards')" class="px-6 py-2.5 rounded-xl bg-slate-100 dark:bg-zinc-800 text-[11px] font-black uppercase tracking-widest flex items-center gap-2">
          <ChevronLeft :size="16" />
          Back
        </button>
      </div>

      <div v-else-if="!quiz || quiz.questions.length === 0" class="flex flex-col items-center justify-center py-32 text-center">
        <div class="w-16 h-16 rounded-[20px] bg-zinc-50 dark:bg-zinc-800/50 flex items-center justify-center mb-6 shadow-neo-inner">
          <Sparkles :size="32" :stroke-width="1.2" class="text-zinc-300" />
        </div>
        <p class="text-slate-500 dark:text-zinc-500 text-[15px] mb-8 font-medium">This deck has no cards yet.</p>
        <button @click="$router.push('/flashcards')" class="px-8 h-12 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-[11px] font-black uppercase tracking-widest flex items-center gap-2">
          <ChevronLeft :size="16" />
          Back to Decks
        </button>
      </div>

      <!-- Completion Summary -->
      <div v-else-if="currentIndex >= quiz.questions.length" class="py-10 max-w-md mx-auto animate-in">
        <div class="bg-white dark:bg-zinc-900 rounded-[40px] p-10 shadow-neo border border-zinc-100 dark:border-white/5 text-center relative overflow-hidden">
          <div class="absolute -top-10 -right-10 w-32 h-32 bg-emerald-500/5 blur-3xl rounded-full"></div>
          
          <div class="w-20 h-20 rounded-[28px] bg-emerald-50 dark:bg-emerald-900/10 flex items-center justify-center mx-auto mb-8 shadow-neo-inner">
             <Trophy :size="36" :stroke-width="1.5" class="text-emerald-500" />
          </div>
          <h2 class="text-3xl font-black text-slate-800 dark:text-zinc-100 mb-2 uppercase tracking-tight">Session Complete</h2>
          <p class="text-slate-500 dark:text-zinc-500 text-[15px] mb-10 font-medium">Domain knowledge updated successfully.</p>
          
          <div class="grid grid-cols-2 gap-6 mb-10">
            <div class="p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-500/10 dark:border-emerald-500/20">
              <p class="text-[10px] font-black uppercase tracking-widest text-emerald-500 mb-2">Mastered</p>
              <p class="text-3xl font-bold text-emerald-600 dark:text-emerald-400">{{ knownCount }}</p>
            </div>
            <div class="p-5 rounded-2xl bg-rose-50 dark:bg-rose-900/10 border border-rose-500/10 dark:border-rose-500/20">
              <p class="text-[10px] font-black uppercase tracking-widest text-rose-500 mb-2">Review</p>
              <p class="text-3xl font-bold text-rose-600 dark:text-rose-400">{{ reviewCount }}</p>
            </div>
          </div>

          <div class="space-y-4">
            <button @click="restartSession" class="w-full h-14 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-neo-pill hover:-translate-y-1 transition-all flex items-center justify-center gap-3">
              <RefreshCw :size="16" />
              Restart Session
            </button>
            <button @click="$router.push(`/quiz/${quiz._id}`)" class="w-full h-14 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-neo-pill hover:-translate-y-1 transition-all flex items-center justify-center gap-3">
              Ready for a test?
              <ArrowRight :size="16" :stroke-width="2" />
            </button>
          </div>
        </div>
      </div>

      <template v-else>

        <!-- Header -->
        <div class="flex items-center justify-between mb-10">
          <button @click="$router.push('/flashcards')" class="flex items-center gap-2 shadow-neo-inner px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest text-slate-500 dark:text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors">
            <ChevronLeft :size="14" :stroke-width="3" />
            Back to sets
          </button>
          <button @click="$router.push(`/quiz/${quiz._id}`)" class="px-5 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:-translate-y-0.5 transition-all shadow-neo-pill flex items-center gap-2">
            Start Exam
            <ArrowRight :size="14" :stroke-width="3" />
          </button>
        </div>

        <!-- Progress -->
        <div class="mb-10">
          <h1 class="text-3xl font-bold text-slate-800 dark:text-zinc-100 mb-4 tracking-tight">{{ quiz.title }}</h1>
          <div class="flex items-center gap-4">
            <div class="flex-1 h-2 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden shadow-neo-inner">
              <div class="h-full rounded-full bg-zinc-900 dark:bg-white transition-all duration-700 ease-out"
                :style="{ width: `${((currentIndex + 1) / quiz.questions.length) * 100}%` }"></div>
            </div>
            <span class="text-[12px] font-black text-zinc-400 dark:text-zinc-500 shrink-0 uppercase tracking-widest">{{ currentIndex + 1 }} / {{ quiz.questions.length }}</span>
          </div>
        </div>

        <!-- Card wrapper -->
        <div class="mb-8 relative max-w-2xl mx-auto flex items-center justify-center gap-4 sm:gap-8 group/wrapper">
          
          <!-- Previous Arrow -->
          <button 
            @click="prevCard" 
            :disabled="currentIndex === 0"
            class="shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 shadow-neo flex items-center justify-center text-zinc-400 hover:text-brand hover:-translate-x-1 transition-all disabled:opacity-30 disabled:hover:translate-x-0"
          >
            <ChevronLeft :size="24" :stroke-width="2.5" />
          </button>

          <!-- Visual layer -->
          <div ref="cardTrackEl" class="w-full max-w-sm sm:max-w-md md:max-w-lg relative shrink-0" style="height: 380px;">
            <div class="card-inner cursor-pointer" :class="{ 'is-flipped': isFlipped }" @click="flipCard">

              <!-- Front -->
              <div class="card-face card-front bg-white dark:bg-zinc-900 rounded-[36px] shadow-neo border border-zinc-100 dark:border-white/5 flex flex-col p-8 sm:p-10">
                <div class="flex items-center justify-between mb-8">
                  <div class="flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-white/5">
                    <span class="text-[10px] font-black uppercase tracking-widest text-zinc-400">Question</span>
                  </div>
                  <HelpCircle :size="18" :stroke-width="1.5" class="text-zinc-300 dark:text-zinc-600" />
                </div>
                <div class="flex-1 flex items-center justify-center">
                  <p class="text-[20px] sm:text-[24px] font-medium text-slate-800 dark:text-zinc-100 leading-snug text-center tracking-tight">{{ currentQuestion.text }}</p>
                </div>
                <div class="flex flex-col items-center gap-2 mt-8 opacity-40">
                  <span class="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Tap to flip card</span>
                  <div class="flex gap-1">
                    <div class="w-1.5 h-1.5 rounded-full bg-zinc-300 animate-pulse"></div>
                    <div class="w-1.5 h-1.5 rounded-full bg-zinc-300"></div>
                    <div class="w-1.5 h-1.5 rounded-full bg-zinc-300 animate-pulse" style="animation-delay: 0.5s"></div>
                  </div>
                </div>
              </div>

              <!-- Back -->
              <div class="card-face card-back bg-white dark:bg-zinc-900 rounded-[36px] shadow-neo border border-zinc-100 dark:border-white/5 flex flex-col p-8 sm:p-10">
                <div class="flex items-center justify-between mb-8">
                  <div class="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                    <span class="text-[10px] font-black uppercase tracking-widest text-emerald-500">Correct Answer</span>
                  </div>
                  <CheckCircle2 :size="18" :stroke-width="1.5" class="text-emerald-500" />
                </div>
                <div class="flex-1 flex items-center justify-center">
                  <p class="text-[20px] sm:text-[24px] font-bold text-slate-800 dark:text-zinc-100 leading-snug text-center tracking-tight">{{ correctAnswerText }}</p>
                </div>
                <div v-if="currentQuestion.explanation" class="mt-8 p-4 sm:p-5 rounded-[24px] bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-white/5">
                  <p class="text-[11px] font-black uppercase tracking-widest text-zinc-500 mb-2">Diagnostic Explanation</p>
                  <p class="text-[13px] text-zinc-400 dark:text-zinc-600 leading-relaxed">{{ currentQuestion.explanation }}</p>
                </div>
              </div>

            </div>
          </div>
          
          <!-- Next Arrow -->
          <button 
            @click="nextCard"
            class="shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 shadow-neo flex items-center justify-center text-zinc-400 hover:text-brand hover:translate-x-1 transition-all"
          >
            <ArrowRight :size="24" :stroke-width="2.5" />
          </button>
        </div>


      </template>
    </div>
  </NeoAppShell>
</template>

<script setup>
import { computed, ref, onMounted, onBeforeUnmount } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { 
  ChevronLeft, 
  ArrowRight, 
  Sparkles, 
  Trophy, 
  RefreshCw, 
  HelpCircle,
  CheckCircle2
} from 'lucide-vue-next';
import { useQuizStore } from '../store/quiz';
import NeoAppShell from '../components/layout/NeoAppShell.vue';
import NeoLoader from '../components/common/NeoLoader.vue';

const route = useRoute();
const router = useRouter();
const quizStore = useQuizStore();

const currentIndex = ref(0);
const isFlipped = ref(false);
const isDragging = ref(false);
const cardTrackEl = ref(null);

// Session stats
const knownCards = ref([]);
const reviewCards = ref([]);
const knownCount = computed(() => knownCards.value.length);
const reviewCount = computed(() => reviewCards.value.length);

// Visual stamps opacity
const stampKnownOpacity = ref(0);
const stampReviewOpacity = ref(0);

const quiz = computed(() => quizStore.currentQuiz);
const currentQuestion = computed(() => {
  if (!quiz.value?.questions?.length || currentIndex.value >= quiz.value.questions.length) return null;
  return quiz.value.questions[currentIndex.value];
});
const correctAnswerText = computed(() => {
  if (!currentQuestion.value) return '';
  const opt = currentQuestion.value.options?.find(o => o.isCorrect === true || o.isCorrect === 'true');
  return opt ? opt.text : 'See quiz for the correct answer.';
});

onMounted(async () => {
  isFlipped.value = false;
  document.body.style.overscrollBehaviorX = 'none';
  await quizStore.fetchStudyQuizById(route.params.id);
});

onBeforeUnmount(() => {
  document.body.style.overscrollBehaviorX = '';
});

const flipCard = () => { isFlipped.value = !isFlipped.value; };

const prevCard = () => {
  if (currentIndex.value > 0) {
    isFlipped.value = false;
    currentIndex.value--;
  }
};

const nextCard = () => {
  if (!quiz.value || currentIndex.value >= quiz.value.questions.length) return;
  
  if (currentQuestion.value && !knownCards.value.includes(currentQuestion.value._id)) {
    knownCards.value.push(currentQuestion.value._id);
  }

  isFlipped.value = false;
  currentIndex.value++;
};

const restartSession = () => {
  currentIndex.value = 0;
  knownCards.value = [];
  reviewCards.value = [];
  isFlipped.value = false;
};
</script>

<style scoped>
.card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  transition: transform 0.55s cubic-bezier(0.4, 0, 0.2, 1);
  transform-style: preserve-3d;
}
.card-inner.is-flipped { transform: rotateY(180deg); }

.card-face {
  position: absolute;
  inset: 0;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
}
.card-back { transform: rotateY(180deg); }

.animate-in { animation: fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }
</style>
