<template>
  <NeoAppShell :showSidebar="false">
    <template #header>
      <div class="flex items-center w-full gap-4 md:gap-8 px-2">
        <button @click="goBack" class="w-10 h-10 rounded-xl border border-border-light dark:border-border-dark flex items-center justify-center text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        </button>
        
        <div class="flex-1">
          <div v-if="quiz" class="flex items-center gap-3">
            <span class="text-[12px] font-black uppercase tracking-widest text-brand bg-brand/10 px-3 py-1 rounded-lg">Practice</span>
            <p class="text-[15px] font-bold text-zinc-900 dark:text-zinc-100 hidden sm:block">
              Question {{ currentIndex + 1 }} <span class="text-zinc-400 font-medium">/ {{ quiz.questions.length }}</span>
            </p>
          </div>
        </div>

        <div class="flex items-center gap-4">
          <div class="px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[13px] font-black text-amber-600 dark:text-amber-500 flex items-center gap-2 shadow-sm font-mono">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            {{ formattedTime }}
          </div>
          <ThemeToggle />
        </div>
      </div>
    </template>

    <div class="max-w-4xl mx-auto py-12 px-6">
      <!-- Progress Indicator -->
      <div v-if="quiz" class="mb-12">
        <div class="flex justify-between items-end mb-3">
          <span class="text-[11px] font-black uppercase tracking-[0.2em] text-zinc-400">Your progress</span>
          <span class="text-[13px] font-bold text-zinc-900 dark:text-white">{{ Math.round(progress) }}%</span>
        </div>
        <div class="h-1.5 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden border border-white/10">
          <div class="h-full bg-brand transition-all duration-700 ease-in-out shadow-[0_0_12px_rgba(20,184,166,0.3)]" :style="{ width: `${progress}%` }"></div>
        </div>
      </div>

      <div v-if="quizStore.loading" class="flex flex-col items-center justify-center py-20 gap-6">
        <NeoLoader color="#14b8a6" size="large" />
        <p class="text-[11px] font-black uppercase tracking-widest text-zinc-400">Preparing your questions...</p>
      </div>

      <div v-else-if="quizStore.error" class="py-20">
        <NeoCard variant="depressed" class="p-10 text-center">
            <div class="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg class="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            </div>
            <h3 class="text-xl font-black uppercase tracking-tight text-zinc-900 dark:text-white mb-4">Something went wrong</h3>
            <p class="text-zinc-500 mb-8">{{ quizStore.error }}</p>
            <button @click="router.push('/dashboard')" class="px-8 py-3 bg-zinc-900 dark:bg-white text-white dark:text-black rounded-xl font-black uppercase tracking-widest text-[11px]">Go back to Dashboard</button>
        </NeoCard>
      </div>

      <div v-else-if="quiz && currentQuestion" class="animate-in fade-in slide-in-from-bottom-6 duration-700">
        <!-- Question Core -->
        <div class="mb-12">
            <h1 class="text-2xl md:text-3xl font-bold text-zinc-800 dark:text-zinc-100 leading-[1.3] text-balance">
                {{ currentQuestion.text }}
            </h1>
        </div>

        <!-- Options Container -->
        <div class="space-y-4">
             <div 
                v-for="(option, index) in currentQuestion.options" 
                :key="option._id"
                @click="selectAnswer(option)"
                class="group relative flex items-center gap-6 p-6 rounded-[24px] border-2 transition-all duration-300 cursor-pointer overflow-hidden"
                :class="[
                  getOptionStyles(option).border,
                  getOptionStyles(option).bg,
                  focusedOptionIndex === index && !answered ? 'border-brand ring-4 ring-brand/5' : ''
                ]"
             >
                <!-- Background Glow on Hover -->
                <div class="absolute inset-0 bg-brand/5 opacity-0 group-hover:opacity-100 transition-opacity" v-if="!answered"></div>
                
                <!-- Option Badge -->
                <div 
                    class="w-12 h-12 rounded-2xl flex items-center justify-center font-black transition-all duration-300 shrink-0 border-2"
                    :class="getBadgeStyles(option)"
                >
                    {{ optionLabels[index] }}
                </div>

                <!-- Option Text -->
                <div class="flex-1 text-[16px] font-medium transition-colors" :class="getOptionStyles(option).text">
                    {{ option.text }}
                </div>

                <!-- Feedback Icon -->
                <div v-if="answered && (option.isCorrect || isSelected(option))" class="ml-auto">
                    <svg v-if="option.isCorrect" class="w-6 h-6 text-emerald-500" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path></svg>
                    <svg v-else class="w-6 h-6 text-red-500" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path></svg>
                </div>
             </div>
        </div>

        <!-- Explanation Panel -->
        <transition enter-active-class="transition duration-500 ease-out" enter-from-class="opacity-0 -translate-y-4" enter-to-class="opacity-100 translate-y-0">
          <div v-if="answered" class="mt-12">
            <NeoCard variant="depressed" class="p-8 border-l-4" :class="isCurrentCorrect ? 'border-l-emerald-500' : 'border-l-red-500'">
                <div class="flex items-center gap-3 mb-4">
                  <span class="text-[10px] font-black uppercase tracking-[0.2em]" :class="isCurrentCorrect ? 'text-emerald-500' : 'text-red-500'">Explanation</span>
                </div>
                <p class="text-[16px] leading-relaxed text-zinc-700 dark:text-zinc-300">
                  {{ currentQuestion.explanation || 'An explanation is not available for this question. Check your course materials for more details.' }}
                </p>
            </NeoCard>
          </div>
        </transition>
      </div>
    </div>

    <!-- Immersive Desktop Navigation Footer -->
    <div v-if="quiz && !quizStore.loading" class="fixed bottom-0 left-0 right-0 z-[60] bg-[rgba(10,10,10,0.8)] backdrop-blur-xl border-t border-white/10 px-8 py-6">
       <div class="max-w-4xl mx-auto flex items-center justify-between gap-6">
          <button @click="toggleFlag" class="flex items-center gap-3 px-6 h-12 rounded-2xl border transition-all text-[12px] font-black uppercase tracking-widest" :class="isFlagged ? 'border-amber-500 bg-amber-500/10 text-amber-500' : 'border-white/10 text-white/40 hover:text-white hover:border-white/30'">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" :class="{ 'fill-amber-500': isFlagged }"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>
            {{ isFlagged ? 'Review Flagged' : 'Flag Question' }}
          </button>

          <button
            @click="onNextClick"
            :disabled="!answered"
            class="flex-1 md:flex-none md:min-w-[200px] h-12 rounded-2xl bg-brand text-white text-[12px] font-black uppercase tracking-widest shadow-[0_0_20px_rgba(20,184,166,0.2)] hover:-translate-y-1 transition-all active:translate-y-0 disabled:opacity-30 flex items-center justify-center gap-3"
          >
            {{ currentIndex === quiz.questions.length - 1 ? 'Finish and see results' : 'Next Question' }}
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </button>
       </div>
    </div>

    <!-- UI MODALS -->
    <FlagReviewPanel :open="showFlagReview" :flagged-indexes="flaggedQuestionIndexes" @close="showFlagReview = false" @jump="jumpToFlaggedQuestion" @submit="submitQuizFinal" />
    <ConfirmModal :show="confirmModal.show" :title="confirmModal.title" :message="confirmModal.message" :confirmText="confirmModal.confirmText" :isDanger="confirmModal.isDanger" @confirm="handleConfirm" @cancel="confirmModal.show = false" />
    
    <!-- Finish Modal (Styled as Neo) -->
    <div v-if="resultModal.show" class="fixed inset-0 z-[100] flex items-center justify-center p-6">
        <div class="absolute inset-0 bg-black/60 backdrop-blur-md"></div>
        <NeoCard variant="extruded" class="relative w-full max-w-sm p-10 text-center animate-in zoom-in duration-500 shadow-2xl">
            <div class="w-20 h-20 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_30px_rgba(16,185,129,0.3)]">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            <h3 class="text-2xl font-black uppercase tracking-tight text-zinc-800 dark:text-white mb-2">Test Finished</h3>
            <p class="text-[14px] text-zinc-500 dark:text-zinc-400 mb-10 leading-relaxed font-medium">
                You got <span class="text-emerald-500 font-black text-2xl mx-1">{{ resultModal.score }}/{{ resultModal.total }}</span> questions right.
            </p>
            
            <div class="flex flex-col gap-3">
              <button @click="retakeQuiz" class="w-full py-4 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-black font-black uppercase tracking-widest text-[11px] shadow-lg hover:-translate-y-1 transition-all">Try Again</button>
              <button @click="goToResults" class="w-full py-4 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 font-black uppercase tracking-widest text-[11px] hover:bg-zinc-200 transition-all">See Detailed Results</button>
            </div>
        </NeoCard>
    </div>
  </NeoAppShell>
</template>

<script setup>
import { computed, ref, onMounted, onBeforeUnmount } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useQuizStore } from '../store/quiz';
import NeoAppShell from '../components/layout/NeoAppShell.vue';
import NeoCard from '../components/common/NeoCard.vue';
import NeoLoader from '../components/common/NeoLoader.vue';
import ThemeToggle from '../components/ThemeToggle.vue';
import FlagReviewPanel from '../components/quiz/FlagReviewPanel.vue';
import ConfirmModal from '../components/ConfirmModal.vue';

const route = useRoute();
const router = useRouter();
const quizStore = useQuizStore();

const optionLabels = ['A', 'B', 'C', 'D', 'E', 'F'];
const currentIndex = ref(0);
const studentAnswers = ref([]);
const answered = ref(false);
const resultModal = ref({ show: false, score: 0, total: 0 });
const isSubmitting = ref(false);
const flaggedQuestions = ref(new Set());
const showFlagReview = ref(false);
const focusedOptionIndex = ref(0);
const confirmModal = ref({ show: false, title: '', message: '', confirmText: 'Confirm', isDanger: true, onConfirm: null });
const localAnswers = ref({});
const timeLeft = ref(0);
let timer = null;
const isTabActive = ref(true);

const quiz = computed(() => quizStore.currentQuiz);
const currentQuestion = computed(() => quiz.value?.questions[currentIndex.value]);
const progress = computed(() => quiz.value ? ((currentIndex.value + 1) / quiz.value.questions.length) * 100 : 0);
const formattedTime = computed(() => {
  const m = Math.floor(timeLeft.value / 60);
  const s = timeLeft.value % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
});
const isCurrentCorrect = computed(() => {
  if (!answered.value || !currentQuestion.value) return false;
  return localAnswers.value[currentIndex.value]?.selectedOption.isCorrect;
});
const isFlagged = computed(() => currentQuestion.value ? flaggedQuestions.value.has(currentQuestion.value._id) : false);

onMounted(async () => {
  await quizStore.fetchStudyQuizById(route.params.id);
  if (quiz.value) {
    timeLeft.value = (quiz.value.timeLimit || 30) * 60;
    startTimer();
  }
  window.addEventListener('blur', () => isTabActive.value = false);
  window.addEventListener('focus', () => isTabActive.value = true);
  window.addEventListener('keydown', handleKeyPress);
});

onBeforeUnmount(() => {
  clearInterval(timer);
  window.removeEventListener('keydown', handleKeyPress);
});

const getOptionStyles = (option) => {
  if (!answered.value) return { border: 'border-zinc-200 dark:border-zinc-800 bg-transparent', text: 'text-zinc-600 dark:text-zinc-400' };
  if (option.isCorrect) return { border: 'border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.2)] bg-emerald-500/5', text: 'text-emerald-600 dark:text-emerald-400 font-bold' };
  if (isSelected(option)) return { border: 'border-red-500 bg-red-500/5', text: 'text-red-600 dark:text-red-400' };
  return { border: 'border-zinc-100 dark:border-zinc-900 opacity-40', text: 'text-zinc-400' };
};

const getBadgeStyles = (option) => {
  if (!answered.value) return 'border-zinc-200 dark:border-zinc-800 text-zinc-400 group-hover:border-brand group-hover:text-brand';
  if (option.isCorrect) return 'bg-emerald-500 text-white border-emerald-500 scale-110';
  if (isSelected(option)) return 'bg-red-500 text-white border-red-500';
  return 'border-zinc-100 dark:border-zinc-800 text-zinc-300 opacity-30';
};

const isSelected = (opt) => localAnswers.value[currentIndex.value]?.selectedOption._id === opt._id;

function handleKeyPress(e) {
  if (!quiz.value || !currentQuestion.value) return;
  if (e.key === 'ArrowDown' || e.key === 'ArrowRight') { e.preventDefault(); focusedOptionIndex.value = (focusedOptionIndex.value + 1) % currentQuestion.value.options.length; }
  else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') { e.preventDefault(); focusedOptionIndex.value = (focusedOptionIndex.value - 1 + currentQuestion.value.options.length) % currentQuestion.value.options.length; }
  else if ((e.key === 'Enter' || e.key === ' ') && !answered.value) { e.preventDefault(); const opt = currentQuestion.value.options[focusedOptionIndex.value]; if (opt) selectAnswer(opt); }
  else if (answered.value && e.key === 'Enter') onNextClick();
}

function startTimer() {
  timer = setInterval(() => {
    if (!isTabActive.value) return;
    if (timeLeft.value > 0) timeLeft.value--;
    else { clearInterval(timer); submitQuizFinal(); }
  }, 1000);
}

function selectAnswer(option) {
  if (answered.value) return;
  localAnswers.value[currentIndex.value] = { selectedOption: option };
  studentAnswers.value.push({ questionId: currentQuestion.value._id, selectedOptionId: option._id });
  answered.value = true;
}

function toggleFlag() {
  if (!currentQuestion.value) return;
  const id = currentQuestion.value._id;
  if (flaggedQuestions.value.has(id)) flaggedQuestions.value.delete(id);
  else flaggedQuestions.value.add(id);
}

async function nextQuestion() {
  if (currentIndex.value < quiz.value.questions.length - 1) {
    currentIndex.value++;
    answered.value = !!localAnswers.value[currentIndex.value];
    focusedOptionIndex.value = 0;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } else {
    if (flaggedQuestions.value.size > 0) { showFlagReview.value = true; return; }
    clearInterval(timer);
    await handleFinish();
  }
}

const handleFinish = async () => {
  if (isSubmitting.value) return;
  const score = Object.values(localAnswers.value).filter(a => a.selectedOption.isCorrect).length;
  const total = quiz.value.questions.length;
  resultModal.value = { show: true, score, total };
  isSubmitting.value = true;
  try {
    await quizStore.submitQuiz(quiz.value._id, studentAnswers.value, (quiz.value.timeLimit * 60) - timeLeft.value, total);
  } catch (err) { console.error(err); }
  finally { isSubmitting.value = false; }
};

const handleConfirm = () => { if (confirmModal.value.onConfirm) confirmModal.value.onConfirm(); confirmModal.value.show = false; };
const retakeQuiz = () => window.location.reload();
const goToResults = () => router.push({ path: '/result', query: { score: resultModal.value.score, total: resultModal.value.total, quizId: quiz.value._id } });
const goBack = () => { confirmModal.value = { show: true, title: 'Leave Practice?', message: 'Leaving will lose your progress on this test. Are you sure?', confirmText: 'Leave', isDanger: true, onConfirm: () => router.push('/dashboard') }; };
const onNextClick = () => nextQuestion();
const flaggedQuestionIndexes = computed(() => quiz.value ? quiz.value.questions.map((q, i) => flaggedQuestions.value.has(q._id) ? i : -1).filter(i => i !== -1) : []);
function jumpToFlaggedQuestion(index) { currentIndex.value = index; answered.value = !!localAnswers.value[index]; focusedOptionIndex.value = 0; showFlagReview.value = false; window.scrollTo({ top: 0, behavior: 'smooth' }); }
</script>

<style scoped>
.animate-in { animation: fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
</style>
