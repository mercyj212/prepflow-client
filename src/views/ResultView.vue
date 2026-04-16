<template>
  <NeoAppShell>
    <div class="min-h-screen bg-black text-white font-sans selection:bg-white selection:text-black noise-overlay pb-20">
      <div class="px-6 md:px-12 py-12 max-w-7xl mx-auto relative z-20">

        <!-- DEBRIEF HEADER -->
        <header class="mb-16 flex flex-col md:flex-row justify-between items-end gap-10">
          <div class="text-left w-full">
            <div class="flex items-center gap-3 mb-6">
              <span class="w-2 h-2 rounded-full bg-white animate-pulse"></span>
              <span class="text-[10px] font-mono uppercase tracking-[0.4em] text-white/40">// ACADEMIC_INTELLIGENCE_DEBRIEF</span>
            </div>
            <h1 class="text-[clamp(44px,6vw,92px)] leading-[0.85] font-black tracking-tighter uppercase mb-2">
              {{ loading ? 'ANALYZING...' : (result?.quizTitle || 'TEST_SUMMARY') }}
            </h1>
            <p class="text-[14px] text-zinc-500 font-bold uppercase tracking-widest mt-4">
              Mission ID: PREP_{{ quizId?.substring(0, 8) || 'NULL' }} // STATUS: COMPLETE
            </p>
          </div>
          
          <div v-if="!loading && result" class="text-right shrink-0">
             <div class="text-[clamp(80px,10vw,140px)] font-black leading-none tracking-tighter tabular-nums">
               {{ percentage }}<span class="text-[clamp(24px,3vw,40px)] text-white/20">%</span>
             </div>
             <div class="text-[10px] font-mono uppercase tracking-[0.4em] text-white/40 mt-2">// PERFORMANCE_SCORE</div>
          </div>
        </header>

        <!-- Loading Skeleton -->
        <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          <div v-for="i in 4" :key="i" class="h-44 border border-white/10 bg-white/5 animate-pulse"></div>
        </div>

        <!-- PERFORMANCE MATRIX (The Intelligence Grid) -->
        <div v-else-if="result" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 border border-white/10 mb-20">
          
          <!-- Cell 1: ACCURACY -->
          <div class="p-10 border-b border-white/10 lg:border-b-0 lg:border-r border-white/10 flex flex-col justify-between min-h-[320px] text-left">
            <div>
              <p class="text-[9px] font-mono uppercase tracking-[0.4em] text-white/30 mb-8">// ACCURACY_QUOTIENT</p>
              <div class="text-5xl font-black tracking-tighter tabular-nums">{{ result.score }} / {{ result.totalQuestions }}</div>
            </div>
            <div class="text-[11px] text-zinc-500 font-bold border-l border-zinc-800 pl-4 py-2">
              Precision rating for correct answer retrieval.
            </div>
          </div>

          <!-- Cell 2: TEMPORAL -->
          <div class="p-10 border-b border-white/10 lg:border-b-0 lg:border-r border-white/10 flex flex-col justify-between min-h-[320px] text-left">
            <div>
              <p class="text-[9px] font-mono uppercase tracking-[0.4em] text-white/30 mb-8">// TEMPORAL_FLUX</p>
              <div class="text-5xl font-black tracking-tighter tabular-nums">{{ formatTime(result.timeTaken) }}</div>
            </div>
            <div class="text-[11px] text-zinc-500 font-bold border-l border-zinc-800 pl-4 py-2">
              Mission duration vs. target speed index.
            </div>
          </div>

          <!-- Cell 3: RANK -->
          <div class="p-10 border-b border-white/10 lg:border-b-0 lg:border-r border-white/10 flex flex-col justify-between min-h-[320px] text-left overflow-hidden relative">
            <div class="absolute inset-0 z-0 pointer-events-none opacity-[0.05] flex items-center justify-center">
              <span class="text-[200px] font-black tracking-tighter">{{ scoreRank.charAt(0) }}</span>
            </div>
            <div class="relative z-10">
              <p class="text-[9px] font-mono uppercase tracking-[0.4em] text-white/30 mb-8">// STRATEGIC_RANK</p>
              <div class="text-4xl font-black tracking-tighter uppercase">{{ scoreRank }}</div>
            </div>
            <div class="relative z-10 text-[11px] text-zinc-500 font-bold border-l border-zinc-800 pl-4 py-2">
               Competency level assigned by the system.
            </div>
          </div>

          <!-- Cell 4: WEAKNESS -->
          <div class="p-10 flex flex-col justify-between min-h-[320px] bg-white/5 text-left border-l border-white/10">
            <div>
              <p class="text-[9px] font-mono uppercase tracking-[0.4em] text-white/30 mb-8">// REINFORCEMENT_VECTOR</p>
              <div class="text-3xl font-black tracking-tighter uppercase text-zinc-400">IMPROVE: <br/> SUBJECT_X</div>
            </div>
            <button @click="retryQuiz" class="group flex items-center justify-between w-full py-4 px-6 border border-white text-[11px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all">
              INITIALIZE_RETRY
              <span>→</span>
            </button>
          </div>
        </div>

        <!-- ERROR STATE -->
        <div v-else-if="error" class="py-32 text-center border border-white/10 bg-white/5">
          <AlertTriangle :size="48" class="text-zinc-600 mb-6 mx-auto" />
          <h2 class="text-2xl font-black uppercase tracking-tight mb-2">CRITICAL_SYSTEM_ERROR</h2>
          <p class="text-zinc-500 font-mono text-[11px] mb-8">{{ error }}</p>
          <button @click="goHome" class="px-10 py-4 bg-white text-black font-black uppercase tracking-widest text-[11px]">EXIT_TERMINAL</button>
        </div>

        <!-- QUESTION LOG (Data Stream) -->
        <section v-if="result && result.questionResults.length" class="mb-20">
          <div class="flex items-center gap-4 mb-10 border-b border-white/10 pb-4">
            <h3 class="text-[12px] font-bold uppercase tracking-[0.4em] font-mono">// QUESTION_LOG ({{ result.questionResults.length }}_STREAM_CHUNKS)</h3>
          </div>
          
          <div class="space-y-1">
            <div 
              v-for="(q, idx) in result.questionResults" 
              :key="idx"
              class="group relative flex flex-col md:flex-row items-stretch border border-white/10 hover:border-white transition-colors cursor-default"
            >
              <div class="w-16 md:w-20 shrink-0 flex items-center justify-center font-mono text-[11px] border-b md:border-b-0 md:border-r border-white/10 bg-white/5 text-white/40 group-hover:bg-white group-hover:text-black transition-all">
                #{{ String(idx + 1).padStart(2, '0') }}
              </div>
              
              <div class="flex-1 p-6 md:p-8 flex flex-col gap-4">
                <div class="flex items-start justify-between gap-6">
                  <p class="text-[15px] font-bold text-white/80 leading-snug group-hover:text-white transition-colors">{{ q.questionText }}</p>
                  <div class="shrink-0 font-mono text-[10px] tracking-widest px-3 py-1 border"
                    :class="q.isCorrect ? 'border-zinc-800 text-zinc-500' : 'border-white text-white animate-pulse'">
                    {{ q.isCorrect ? '[ SUCCESS ]' : '[ ! ERROR ]' }}
                  </div>
                </div>

                <div class="flex flex-col sm:flex-row gap-6 mt-4">
                  <div class="flex flex-col gap-1">
                    <span class="text-[8px] font-mono uppercase text-white/30">YOUR_ENTRY</span>
                    <span class="text-[13px] font-bold" :class="q.isCorrect ? 'text-white' : 'text-zinc-500'">{{ q.yourAnswer }}</span>
                  </div>
                  <div v-if="!q.isCorrect" class="flex flex-col gap-1">
                    <span class="text-[8px] font-mono uppercase text-white/30">VALID_TARGET</span>
                    <span class="text-[13px] font-bold text-white">{{ q.correctAnswer }}</span>
                  </div>
                </div>

                <div v-if="q.explanation" class="mt-6 pt-6 border-t border-white/5">
                  <p class="text-[10px] font-mono uppercase tracking-widest text-white/20 mb-2">// LOG_WHY_ANALYSIS</p>
                  <p class="text-[13px] text-zinc-500 font-medium leading-relaxed max-w-2xl group-hover:text-zinc-300 transition-colors">{{ q.explanation }}</p>
                </div>
              </div>

              <!-- Tactical Scan Line (Internal) -->
              <div v-if="!q.isCorrect" class="absolute inset-0 bg-white/5 pointer-events-none animate-glitch opacity-0 group-hover:opacity-100 transition-opacity z-10"></div>
            </div>
          </div>
        </section>

        <!-- FINAL ACTIONS -->
        <footer class="flex flex-col sm:flex-row items-center justify-center gap-6">
          <button @click="goHome" class="group relative px-12 py-6 border border-white/20 text-white/40 text-[11px] font-black uppercase tracking-[0.4em] hover:text-white hover:border-white transition-all">
            EXIT_TO_DASHBOARD
          </button>
          <button @click="retryQuiz" class="group relative px-12 py-6 bg-white text-black text-[11px] font-black uppercase tracking-[0.4em] hover:bg-zinc-200 transition-all flex items-center gap-4">
            RE_INITIALIZE_PRACTICE
            <span>→</span>
          </button>
        </footer>

      </div>
    </div>
  </NeoAppShell>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { AlertTriangle } from 'lucide-vue-next';
import NeoAppShell from '../components/layout/NeoAppShell.vue';
import api from '../api/axios';

const route = useRoute();
const router = useRouter();

const result = ref(null);
const loading = ref(true);
const error = ref(null);

const quizId = route.query.quizId;
const fallbackScore = Number(route.query.score || 0);
const fallbackTotal = Number(route.query.total || 0);

const percentage = computed(() => {
  if (!result.value) return Math.round((fallbackScore / Math.max(1, fallbackTotal)) * 100);
  return Math.round((result.value.score / Math.max(1, result.value.totalQuestions)) * 100);
});

const scoreRank = computed(() => {
  if (percentage.value >= 85) return 'ADMIRAL';
  if (percentage.value >= 70) return 'COMMANDER';
  if (percentage.value >= 50) return 'LIEUTENANT';
  if (percentage.value >= 30) return 'TRAINEE';
  return 'RECRUIT';
});

const formatTime = (seconds) => {
  if (!seconds) return '00:00';
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
};

onMounted(async () => {
  if (!quizId) {
    result.value = {
      quizTitle: 'FIELD_EXAM',
      score: fallbackScore,
      totalQuestions: fallbackTotal,
      timeTaken: 0,
      questionResults: [],
    };
    loading.value = false;
    return;
  }

  try {
    const res = await api.get(`/submissions/quiz/${quizId}`);
    result.value = res.data;
  } catch (err) {
    console.warn('Could not fetch detailed results, showing basic data:', err.message);
    result.value = {
      quizTitle: 'FIELD_EXAM',
      score: fallbackScore,
      totalQuestions: fallbackTotal,
      timeTaken: 0,
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
.noise-overlay { position: relative; }
.noise-overlay::before {
  content: ""; position: absolute; inset: 0; z-index: 10;
  background-image: url("https://grainy-gradients.vercel.app/noise.svg");
  opacity: 0.1; pointer-events: none; filter: contrast(150%) brightness(100%);
}
@keyframes glitch { 
  0% { transform: translate(0); clip-path: inset(40% 0 61% 0); } 
  20% { transform: translate(-5px, 5px); clip-path: inset(92% 0 1% 0); } 
  40% { transform: translate(-5px, -5px); clip-path: inset(43% 0 1% 0); } 
  60% { transform: translate(5px, 5px); clip-path: inset(25% 0 58% 0); } 
  80% { transform: translate(5px, -5px); clip-path: inset(54% 0 7% 0); } 
  100% { transform: translate(0); clip-path: inset(58% 0 43% 0); } 
}
.animate-glitch { animation: glitch 0.2s steps(2, end) infinite; }
</style>
