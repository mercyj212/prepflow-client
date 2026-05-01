<template>
  <NeoAppShell>
    <div class="h-full w-full relative overflow-x-hidden overflow-y-auto bg-zinc-50 dark:bg-zinc-950 custom-scrollbar">
      <div class="min-h-full flex flex-col items-center justify-center relative p-4 md:p-10">
      <!-- Background Ambient Glows -->
      <div class="absolute -top-40 -left-40 w-96 h-96 bg-brand/5 dark:bg-brand/10 blur-[120px] rounded-full pointer-events-none"></div>
      <div class="absolute -bottom-40 -right-40 w-96 h-96 bg-zinc-900/5 dark:bg-zinc-100/5 blur-[120px] rounded-full pointer-events-none"></div>

      <!-- Game Stage: SELECT -->
      <div v-if="gameState === 'SELECT'" class="w-full max-w-xl z-10 animate-fade-inShadow">
        <header class="text-center mb-10">
          <div class="flex items-center justify-center gap-3 mb-4">
             <div class="w-12 h-12 rounded-2xl bg-zinc-900 dark:bg-white flex items-center justify-center shadow-neo">
                <Timer :size="24" class="text-white dark:text-zinc-900" />
             </div>
          </div>
          <h1 class="text-4xl font-black text-zinc-900 dark:text-white uppercase tracking-tighter">Speed Recall</h1>
          <p class="text-zinc-500 font-medium mt-2">Pick a subject to sharpen your instant memory.</p>
        </header>

        <NeoCard variant="extruded" class="p-8 !rounded-[40px] border-zinc-200 dark:border-white/5">
          <div class="space-y-6">
            <div>
              <label class="block text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-3">Select Subject</label>
              <div class="grid grid-cols-1 gap-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                <button 
                  v-for="course in courses" 
                  :key="course._id"
                  @click="selectedCourse = course"
                  class="w-full text-left p-4 rounded-2xl border transition-all flex items-center justify-between group"
                  :class="selectedCourse?._id === course._id 
                    ? 'bg-zinc-900 dark:bg-white border-zinc-900 dark:border-white text-white dark:text-black shadow-xl' 
                    : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-800'"
                >
                  <span class="text-sm font-bold">{{ course.title }}</span>
                  <div class="flex items-center gap-2">
                    <span class="text-[9px] font-black uppercase tracking-widest opacity-50">{{ course.level }}</span>
                    <Check v-if="selectedCourse?._id === course._id" :size="16" />
                  </div>
                </button>
              </div>
            </div>

            <button 
              @click="startGame"
              :disabled="!selectedCourse || loadingQuizzes"
              class="w-full h-16 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-black rounded-2xl transition-all uppercase tracking-[0.2em] text-xs shadow-xl active:scale-95 disabled:opacity-50 disabled:grayscale"
            >
              <span v-if="loadingQuizzes" class="flex items-center justify-center gap-2">
                <RotateCw class="animate-spin" :size="16" /> Loading Questions...
              </span>
              <span v-else>Start Game</span>
            </button>
          </div>
        </NeoCard>
      </div>

      <!-- Game Stage: PLAYING -->
      <div v-else-if="gameState === 'PLAYING'" class="w-full h-full flex flex-col items-center justify-between relative z-10">
        <!-- HUD -->
        <div class="w-full max-w-4xl flex items-center justify-between p-6">
          <div class="flex items-center gap-4">
            <div class="flex flex-col">
              <span class="text-[10px] font-black text-zinc-400 uppercase tracking-widest leading-none mb-1">Session Score</span>
              <span class="text-2xl font-black text-zinc-900 dark:text-white leading-none font-mono tracking-tighter">{{ score.toLocaleString() }}</span>
            </div>
            <div class="h-10 w-px bg-zinc-200 dark:bg-white/10 mx-2"></div>
            <div class="flex flex-col">
              <span class="text-[10px] font-black text-zinc-400 uppercase tracking-widest leading-none mb-1">Streak</span>
              <span class="text-2xl font-black text-emerald-500 leading-none">x{{ streak }}</span>
            </div>
          </div>

          <div class="flex items-center gap-6">
             <div class="text-right">
                <span class="text-[10px] font-black text-zinc-400 uppercase tracking-widest block mb-1">Progress</span>
                <div class="flex gap-1">
                   <div v-for="i in totalQuestions" :key="i" class="w-3 h-1.5 rounded-full" :class="i <= currentIndex + 1 ? 'bg-zinc-900 dark:bg-white' : 'bg-zinc-200 dark:bg-zinc-800'"></div>
                </div>
             </div>
             <button @click="requestQuit" class="w-10 h-10 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/5 flex items-center justify-center text-zinc-400 hover:text-red-500 transition-colors">
               <X :size="18" />
             </button>
          </div>
        </div>

        <!-- Question Display -->
        <div class="flex-1 flex flex-col items-center justify-center w-full max-w-3xl text-center px-6">
           <!-- Phase Indicator -->
           <div class="mb-8 overflow-hidden h-8">
              <Transition name="slide-up" mode="out-in">
                <span :key="phase" class="text-[11px] font-black uppercase tracking-[0.4em]" :class="phase === 'RECALL' ? 'text-brand' : 'text-zinc-400'">
                   {{ phase === 'FLASH' ? 'Memorize Question' : 'Answer Now' }}
                </span>
              </Transition>
           </div>

           <!-- The Question -->
           <div class="relative min-h-[160px] flex items-center justify-center mb-12">
              <div v-if="feedback" class="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
                 <span class="text-6xl font-black uppercase italic tracking-tighter animate-ping" :class="feedback === 'CORRECT' ? 'text-emerald-500' : 'text-red-500'">
                    {{ feedback }}
                 </span>
              </div>

              <Transition name="fade-scale" mode="out-in">
                 <h2 :key="currentQuestion?.text" class="text-3xl md:text-5xl font-black text-zinc-900 dark:text-white leading-[1.1] tracking-tight">
                    {{ currentQuestion?.text }}
                 </h2>
              </Transition>
           </div>

           <!-- Options (Only in RECALL phase) -->
           <div class="w-full grid grid-cols-1 md:grid-cols-2 gap-4 transition-all duration-500" :class="phase === 'RECALL' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20 pointer-events-none'">
              <button 
                v-for="(opt, idx) in options" 
                :key="idx"
                @click="submitAnswer(idx)"
                :disabled="feedback !== null"
                class="relative h-20 bg-white dark:bg-zinc-900 border-2 border-zinc-100 dark:border-white/5 rounded-[24px] px-8 flex items-center justify-between group overflow-hidden transition-all hover:border-brand active:scale-95"
              >
                <div class="flex items-center gap-4">
                  <span class="text-[10px] font-black text-zinc-400 border border-zinc-200 dark:border-zinc-800 w-6 h-6 flex items-center justify-center rounded-lg group-hover:bg-brand group-hover:border-brand group-hover:text-white transition-colors">
                    {{ idx + 1 }}
                  </span>
                  <span class="text-sm font-bold text-zinc-700 dark:text-zinc-200">{{ opt }}</span>
                </div>
                <ArrowRight :size="16" class="text-zinc-300 group-hover:text-brand transition-colors group-hover:translate-x-1" />
              </button>
           </div>
        </div>

        <!-- Timer Bar -->
        <div class="w-full p-10 pt-0">
           <div class="max-w-4xl mx-auto h-2 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden shadow-inner">
              <div 
                class="h-full bg-brand transition-all duration-100"
                :style="{ width: `${timerPercentage}%`, backgroundColor: timerPercentage < 30 ? '#ef4444' : '#10b981' }"
              ></div>
           </div>
        </div>
      </div>

      <!-- Game Stage: RESULTS -->
      <div v-else-if="gameState === 'RESULTS'" class="w-full max-w-xl z-10 animate-fade-inShadow text-center">
        <div class="w-24 h-24 rounded-[32px] bg-zinc-900 dark:bg-white flex items-center justify-center mx-auto mb-8 shadow-2xl">
           <Trophy :size="48" class="text-white dark:text-zinc-900" />
        </div>
        
        <h1 class="text-5xl font-black text-zinc-900 dark:text-white uppercase tracking-tighter mb-2">Recall Summary</h1>
        <p class="text-zinc-500 font-medium mb-10">Game over. Here are your results.</p>

        <div class="grid grid-cols-2 gap-4 mb-10 text-left">
           <NeoCard variant="depressed" class="p-6">
              <span class="text-[10px] font-black text-zinc-400 uppercase tracking-widest block mb-2">Final Score</span>
              <span class="text-3xl font-black text-zinc-900 dark:text-white">{{ score.toLocaleString() }}</span>
           </NeoCard>
           <NeoCard variant="depressed" class="p-6">
              <span class="text-[10px] font-black text-zinc-400 uppercase tracking-widest block mb-2">Best Streak</span>
              <span class="text-3xl font-black text-emerald-500">x{{ maxStreak }}</span>
           </NeoCard>
           <NeoCard variant="depressed" class="p-6">
              <span class="text-[10px] font-black text-zinc-400 uppercase tracking-widest block mb-2">Accuracy</span>
              <span class="text-3xl font-black text-zinc-900 dark:text-white">{{ Math.round((correctCount / totalQuestions) * 100) }}%</span>
           </NeoCard>
           <NeoCard variant="depressed" class="p-6">
              <span class="text-[10px] font-black text-zinc-400 uppercase tracking-widest block mb-2">Avg Speed</span>
              <span class="text-3xl font-black text-blue-500">{{ avgSpeed.toFixed(1) }}s</span>
           </NeoCard>
        </div>

        <div class="flex gap-4">
           <button @click="gameState = 'SELECT'" class="flex-1 h-14 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white font-black rounded-2xl uppercase tracking-widest text-[11px] hover:bg-zinc-200 transition-all">Play Again</button>
           <button @click="$router.push('/games')" class="flex-1 h-14 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-black rounded-2xl uppercase tracking-widest text-[11px] shadow-xl active:scale-95 transition-all">Exit to Hub</button>
        </div>
      </div>

      <!-- Quit Modal -->
      <div v-if="showQuitModal" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 dark:bg-black/60 backdrop-blur-md">
        <NeoCard class="w-full max-w-sm !rounded-[32px] p-8 shadow-2xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-white/5 text-center animate-fade-inShadow">
          <div class="w-16 h-16 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center mx-auto mb-6 text-red-500 ring-4 ring-red-50 dark:ring-red-900/10">
             <HelpCircle :size="24" :stroke-width="2.5" />
          </div>
          <h3 class="text-xl font-black text-zinc-900 dark:text-white uppercase tracking-tight mb-2">Quit Game?</h3>
          <p class="text-[13px] text-zinc-500 dark:text-zinc-400 mb-8 leading-relaxed">Your current score and streak will be lost.</p>
          
          <div class="flex gap-3">
            <button @click="cancelQuit" class="flex-1 h-12 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white font-bold text-xs uppercase tracking-widest hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors">Resume</button>
            <button @click="confirmQuit" class="flex-1 h-12 rounded-xl bg-red-500 text-white font-bold text-xs uppercase tracking-widest hover:bg-red-600 transition-colors shadow-lg shadow-red-500/20">Quit</button>
          </div>
        </NeoCard>
      </div>
    </div>
    </div>
  </NeoAppShell>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { 
  Timer, Check, RotateCw, X, ArrowRight, 
  Trophy, HelpCircle 
} from 'lucide-vue-next';
import NeoAppShell from '../components/layout/NeoAppShell.vue';
import NeoCard from '../components/common/NeoCard.vue';
import api from '../api/axios';

// GAME STATE
const gameState = ref('SELECT'); // SELECT, PLAYING, RESULTS
const phase = ref('FLASH'); // FLASH, RECALL
const courses = ref([]);
const selectedCourse = ref(null);
const questions = ref([]);
const currentIndex = ref(0);
const score = ref(0);
const streak = ref(0);
const maxStreak = ref(0);
const correctCount = ref(0);
const feedback = ref(null);
const loadingQuizzes = ref(false);
const showQuitModal = ref(false);

// TIMING
const timer = ref(0);
const MAX_TIME = 5000; // 5 seconds
const interval = ref(null);
const startTime = ref(0);
const totalTimeTaken = ref(0);

const currentQuestion = computed(() => questions.value[currentIndex.value]);
const options = computed(() => {
  if (!currentQuestion.value) return [];
  // Extract text from options and shuffle
  const opts = currentQuestion.value.options.map(o => o.text);
  return opts.sort(() => Math.random() - 0.5);
});
const correctAnswerText = computed(() => {
  if (!currentQuestion.value) return null;
  const correct = currentQuestion.value.options.find(o => o.isCorrect);
  return correct ? correct.text : null;
});

const totalQuestions = computed(() => questions.value.length);
const timerPercentage = computed(() => (timer.value / MAX_TIME) * 100);
const avgSpeed = computed(() => correctCount.value > 0 ? (totalTimeTaken.value / correctCount.value) / 1000 : 0);

onMounted(async () => {
  try {
    const res = await api.get('/courses');
    courses.value = res.data.filter(c => c.price > 0); // Only paid courses for games? Or all? Let's do all.
    if (courses.value.length === 0) courses.value = res.data;
  } catch (err) {
    console.error('Failed to fetch courses');
  }
});

const startGame = async () => {
  loadingQuizzes.value = true;
  try {
    // Fetch all quizzes for this course
    const res = await api.get(`/quizzes?course=${selectedCourse.value._id}`);
    if (res.data.length === 0) {
      alert('No questions available for this subject yet!');
      return;
    }
    
    // Extract questions from all quizzes
    let allQs = [];
    res.data.forEach(q => {
      allQs = [...allQs, ...q.questions];
    });

    if (allQs.length === 0) {
       alert('No questions found in quizzes.');
       return;
    }

    questions.value = allQs.sort(() => Math.random() - 0.5).slice(0, 10);
    resetGame();
    gameState.value = 'PLAYING';
    startFlashPhase();
  } catch (err) {
    alert('Failed to load questions.');
  } finally {
    loadingQuizzes.value = false;
  }
};

const resetGame = () => {
  currentIndex.value = 0;
  score.value = 0;
  streak.value = 0;
  maxStreak.value = 0;
  correctCount.value = 0;
  totalTimeTaken.value = 0;
};

const startFlashPhase = () => {
  phase.value = 'FLASH';
  timer.value = MAX_TIME;
  feedback.value = null;
  
  // Flash for 1.5 seconds
  setTimeout(() => {
    if (gameState.value !== 'PLAYING') return;
    startRecallPhase();
  }, 1500);
};

const startRecallPhase = () => {
  phase.value = 'RECALL';
  startTime.value = Date.now();
  timer.value = MAX_TIME;
  
  interval.value = setInterval(() => {
    timer.value -= 50;
    if (timer.value <= 0) {
      handleTimeout();
    }
  }, 50);
};

const submitAnswer = (idx) => {
  if (phase.value !== 'RECALL' || feedback.value) return;
  
  clearInterval(interval.value);
  const selectedText = options.value[idx];
  const timeTaken = Date.now() - startTime.value;
  
  if (selectedText === correctAnswerText.value) {
    handleCorrect(timeTaken);
  } else {
    handleWrong();
  }

  setTimeout(nextQuestion, 1200);
};

const handleCorrect = (timeTaken) => {
  feedback.value = 'CORRECT';
  correctCount.value++;
  streak.value++;
  if (streak.value > maxStreak.value) maxStreak.value = streak.value;
  
  const timeBonus = Math.max(0, Math.floor((MAX_TIME - timeTaken) / 50));
  const basePoints = 100;
  const multiplier = 1 + (streak.value * 0.1);
  score.value += Math.round((basePoints + timeBonus) * multiplier);
  totalTimeTaken.value += timeTaken;
};

const handleWrong = () => {
  feedback.value = 'WRONG';
  streak.value = 0;
};

const handleTimeout = () => {
  clearInterval(interval.value);
  feedback.value = 'TIME OUT';
  streak.value = 0;
  setTimeout(nextQuestion, 1200);
};

const nextQuestion = () => {
  if (currentIndex.value < questions.value.length - 1) {
    currentIndex.value++;
    startFlashPhase();
  } else {
    finishGame();
  }
};

const finishGame = async () => {
  gameState.value = 'RESULTS';
  
  // Submit score to leaderboard
  try {
    const awardsCount = Math.floor(score.value / 1000); 
    await api.post('/game/score', {
      score: score.value,
      awards: awardsCount,
      gameType: 'speedRecall'
    });
  } catch (err) {
    console.error('Failed to submit game score:', err);
  }
};

const requestQuit = () => {
  showQuitModal.value = true;
  clearInterval(interval.value);
};

const confirmQuit = () => {
  showQuitModal.value = false;
  gameState.value = 'SELECT';
};

const cancelQuit = () => {
  showQuitModal.value = false;
  // Resume timer if we were in the recall phase
  if (phase.value === 'RECALL' && feedback.value === null) {
    interval.value = setInterval(() => {
      timer.value -= 50;
      if (timer.value <= 0) {
        handleTimeout();
      }
    }, 50);
  }
};

onUnmounted(() => {
  clearInterval(interval.value);
});
</script>

<style scoped>
.shadow-neo {
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
}

.shadow-neo-inner {
  box-shadow: inset 0 2px 4px 0 rgba(0, 0, 0, 0.06);
}

/* Transitions */
.fade-scale-enter-active, .fade-scale-leave-active {
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.fade-scale-enter-from { opacity: 0; transform: scale(0.9) translateY(10px); }
.fade-scale-leave-to { opacity: 0; transform: scale(1.1) translateY(-10px); }

.slide-up-enter-active, .slide-up-leave-active {
  transition: all 0.3s ease;
}
.slide-up-enter-from { transform: translateY(100%); opacity: 0; }
.slide-up-leave-to { transform: translateY(-100%); opacity: 0; }

.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.1); border-radius: 10px; }
</style>
