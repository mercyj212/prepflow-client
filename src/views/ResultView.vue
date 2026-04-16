<template>
  <NeoAppShell>
    <div class="px-4 md:px-12 py-10 max-w-5xl mx-auto">

      <!-- HEADER -->
      <header class="mb-10 text-center md:text-left">
        <div class="flex items-center justify-center md:justify-start gap-3 mb-4">
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span class="text-[11px] font-black uppercase tracking-[0.3em] text-zinc-400">Your Results</span>
        </div>
        <h1 class="text-4xl md:text-5xl font-black text-zinc-900 dark:text-zinc-100 tracking-tight mb-2">
          {{ loading ? 'Loading...' : (result?.quizTitle || 'Test Complete') }}
        </h1>
        <p class="text-[15px] text-zinc-500 max-w-xl leading-relaxed">
          Here's how you did. Review each question below to understand where you went right and where to improve.
        </p>
      </header>

      <!-- Loading Skeleton -->
      <div v-if="loading" class="flex flex-col items-center justify-center py-24 gap-4">
        <div class="w-8 h-8 border-4 border-zinc-200 border-t-brand rounded-full animate-spin"></div>
        <p class="text-sm text-zinc-400 font-medium">Loading your results...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="py-16 text-center">
        <NeoCard variant="depressed" class="p-10 max-w-md mx-auto">
          <div class="w-14 h-14 rounded-full bg-red-100 dark:bg-red-500/10 flex items-center justify-center mx-auto mb-4">
            <AlertTriangle :size="28" class="text-red-500" />
          </div>
          <h3 class="text-lg font-black text-zinc-800 dark:text-white mb-2">Could not load results</h3>
          <p class="text-sm text-zinc-500 mb-6">{{ error }}</p>
          <button @click="goHome" class="px-8 h-11 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-black font-black text-[11px] uppercase tracking-widest hover:-translate-y-0.5 transition-all">
            Go to Dashboard
          </button>
        </NeoCard>
      </div>

      <template v-else-if="result">
        <!-- MAIN SCORE CARD -->
        <section class="relative bg-zinc-900 rounded-[36px] overflow-hidden p-10 md:p-14 mb-10 shadow-2xl border border-white/5">
          <div class="absolute -right-16 -bottom-16 w-72 h-72 bg-white/5 rounded-full blur-[80px] pointer-events-none"></div>

          <div class="relative z-10 flex flex-col md:flex-row items-center gap-10 md:gap-16">
            <!-- Score Ring -->
            <div class="relative w-48 h-48 flex items-center justify-center shrink-0">
              <svg class="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 192 192">
                <circle class="text-white/5" stroke-width="6" stroke="currentColor" fill="transparent" r="84" cx="96" cy="96" />
                <circle
                  :class="percentage >= 70 ? 'text-emerald-500' : (percentage >= 40 ? 'text-amber-500' : 'text-rose-500')"
                  stroke-width="10"
                  :stroke-dasharray="CIRCUMFERENCE"
                  :stroke-dashoffset="dashOffset"
                  stroke-linecap="round"
                  stroke="currentColor"
                  fill="transparent"
                  r="84" cx="96" cy="96"
                  class="transition-all duration-1000 ease-out"
                />
              </svg>
              <div class="w-36 h-36 rounded-full bg-zinc-800/60 backdrop-blur-md flex flex-col items-center justify-center border border-white/10">
                <span class="text-5xl font-black text-white leading-none">{{ percentage }}<span class="text-xl text-white/40">%</span></span>
                <span class="text-[9px] font-black uppercase tracking-widest text-zinc-400 mt-1">Score</span>
              </div>
            </div>

            <!-- Score Summary -->
            <div class="text-center md:text-left flex-1">
              <h2 class="text-3xl md:text-4xl font-black text-white mb-3 tracking-tight" :class="percentage < 40 ? 'text-rose-400' : ''">
                {{ scoreMessage }}
              </h2>
              <p class="text-zinc-400 text-[15px] leading-relaxed mb-6 max-w-sm">
                You answered <span class="text-white font-black">{{ result.score }} out of {{ result.totalQuestions }}</span> questions correctly.
                <span v-if="result.timeTaken" class="block mt-1 text-zinc-500 text-[13px]">
                  ⏱ You finished in {{ formatTime(result.timeTaken) }}.
                </span>
              </p>

              <div class="flex flex-wrap gap-3 justify-center md:justify-start">
                <div class="px-5 py-2.5 rounded-full bg-white/5 border border-white/10 text-zinc-300 text-[12px] font-bold flex items-center gap-2">
                  <CheckCircle2 :size="14" class="text-emerald-400" />
                  {{ result.score }} Correct
                </div>
                <div class="px-5 py-2.5 rounded-full bg-white/5 border border-white/10 text-zinc-300 text-[12px] font-bold flex items-center gap-2">
                  <XCircle :size="14" class="text-rose-400" />
                  {{ result.totalQuestions - result.score }} Wrong
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- QUICK TIPS BOX -->
        <NeoCard variant="depressed" class="p-6 mb-10 border-l-4" :class="percentage >= 70 ? 'border-l-emerald-500' : (percentage >= 40 ? 'border-l-amber-500' : 'border-l-rose-500')">
          <div class="flex items-start gap-4">
            <div class="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              :class="percentage >= 70 ? 'bg-emerald-500/10 text-emerald-500' : (percentage >= 40 ? 'bg-amber-500/10 text-amber-500' : 'bg-rose-500/10 text-rose-500')">
              <Lightbulb :size="20" />
            </div>
            <div>
              <p class="text-[13px] font-black uppercase tracking-wider mb-1"
                :class="percentage >= 70 ? 'text-emerald-500' : (percentage >= 40 ? 'text-amber-500' : 'text-rose-500')">
                {{ percentage >= 70 ? 'Great job!' : (percentage >= 40 ? 'Almost there!' : 'Keep practising!') }}
              </p>
              <p class="text-[14px] text-zinc-600 dark:text-zinc-400 leading-relaxed">
                {{ tipMessage }}
              </p>
            </div>
          </div>
        </NeoCard>

        <!-- QUESTION-BY-QUESTION REVIEW -->
        <section class="mb-12">
          <h3 class="text-[12px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-6">Question Review ({{ result.questionResults.length }} questions)</h3>
          
          <div class="space-y-4">
            <NeoCard
              v-for="(q, idx) in result.questionResults"
              :key="idx"
              variant="depressed"
              class="p-6 border-l-4 transition-all"
              :class="q.isCorrect ? 'border-l-emerald-500' : 'border-l-rose-500'"
            >
              <!-- Question Header -->
              <div class="flex items-start gap-3 mb-4">
                <div class="w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-[11px] font-black border"
                  :class="q.isCorrect ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' : 'bg-rose-500/10 text-rose-600 border-rose-500/20'">
                  {{ idx + 1 }}
                </div>
                <p class="text-[14px] font-semibold text-zinc-800 dark:text-zinc-200 leading-snug flex-1">{{ q.questionText }}</p>
                <div class="shrink-0">
                  <CheckCircle2 v-if="q.isCorrect" :size="20" class="text-emerald-500" />
                  <XCircle v-else :size="20" class="text-rose-500" />
                </div>
              </div>

              <!-- Answers -->
              <div class="ml-10 space-y-2">
                <div class="flex items-center gap-2 text-[13px]" :class="q.isCorrect ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'">
                  <span class="font-black">Your answer:</span>
                  <span>{{ q.yourAnswer }}</span>
                </div>
                <div v-if="!q.isCorrect" class="flex items-center gap-2 text-[13px] text-emerald-600 dark:text-emerald-400">
                  <span class="font-black">Correct answer:</span>
                  <span>{{ q.correctAnswer }}</span>
                </div>
                <!-- Explanation -->
                <div v-if="q.explanation" class="mt-3 pt-3 border-t border-zinc-100 dark:border-zinc-800">
                  <p class="text-[12px] font-black uppercase tracking-wider text-zinc-400 mb-1">Why?</p>
                  <p class="text-[13px] text-zinc-600 dark:text-zinc-400 leading-relaxed">{{ q.explanation }}</p>
                </div>
              </div>
            </NeoCard>
          </div>
        </section>

        <!-- FOOTER ACTIONS -->
        <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button @click="goHome" class="w-full sm:w-auto px-10 h-13 py-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 text-[11px] font-black uppercase tracking-widest text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all">
            Back to Dashboard
          </button>
          <button @click="retryQuiz" class="w-full sm:w-auto px-10 py-4 h-13 rounded-2xl bg-zinc-900 dark:bg-white text-white dark:text-black text-[11px] font-black uppercase tracking-widest hover:-translate-y-1 transition-all shadow-xl flex items-center justify-center gap-3">
            <RotateCcw :size="14" />
            Try Again
          </button>
        </div>
      </template>
    </div>
  </NeoAppShell>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { AlertTriangle, CheckCircle2, XCircle, Lightbulb, RotateCcw } from 'lucide-vue-next';
import NeoAppShell from '../components/layout/NeoAppShell.vue';
import NeoCard from '../components/common/NeoCard.vue';
import api from '../api/axios';

const route = useRoute();
const router = useRouter();

const result = ref(null);
const loading = ref(true);
const error = ref(null);
const CIRCUMFERENCE = 2 * Math.PI * 84;

// Always try to get quizId from the route, and fall back to query params for score/total
const quizId = route.query.quizId;
const fallbackScore = Number(route.query.score || 0);
const fallbackTotal = Number(route.query.total || 0);

const percentage = computed(() => {
  if (!result.value) return Math.round((fallbackScore / Math.max(1, fallbackTotal)) * 100);
  return Math.round((result.value.score / Math.max(1, result.value.totalQuestions)) * 100);
});

const dashOffset = computed(() => CIRCUMFERENCE - (percentage.value / 100) * CIRCUMFERENCE);

const scoreMessage = computed(() => {
  if (percentage.value >= 70) return 'Well Done!';
  if (percentage.value >= 40) return 'Not Bad!';
  return 'Keep Studying';
});

const tipMessage = computed(() => {
  if (percentage.value >= 70) return 'You did really well on this test! Go over any questions you missed and you\'ll be even better next time.';
  if (percentage.value >= 40) return 'You\'re getting there! Focus on the questions you got wrong below and read the explanations carefully.';
  return 'Don\'t give up! Everyone starts somewhere. Read through the answers and explanations below — they will help a lot.';
});

const formatTime = (seconds) => {
  if (!seconds) return '';
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return m > 0 ? `${m} min ${s} sec` : `${s} sec`;
};

onMounted(async () => {
  if (!quizId) {
    // No quizId: show basic fallback from URL params
    result.value = {
      quizTitle: 'Your Test',
      score: fallbackScore,
      totalQuestions: fallbackTotal,
      timeTaken: null,
      questionResults: [],
    };
    loading.value = false;
    return;
  }

  try {
    const res = await api.get(`/submissions/quiz/${quizId}`);
    result.value = res.data;
  } catch (err) {
    // If fetch fails, still show basic info from URL so page isn't blank
    console.warn('Could not fetch detailed results, showing basic data:', err.message);
    result.value = {
      quizTitle: 'Your Test',
      score: fallbackScore,
      totalQuestions: fallbackTotal,
      timeTaken: null,
      questionResults: [],
    };
  } finally {
    loading.value = false;
  }
});

const goHome = () => router.push('/dashboard');
const retryQuiz = () => {
  if (quizId) router.push(`/quiz/${quizId}`);
  else router.push('/subjects');
};
</script>

<style scoped>
.h-13 { height: 3.25rem; }
</style>
