<template>
  <div class="min-h-screen bg-white dark:bg-zinc-950 text-slate-900 dark:text-zinc-100 pb-24">
    <!-- Quiz Top Bar -->
    <nav class="sticky top-0 z-40 bg-white dark:bg-zinc-950 border-b border-border-light dark:border-border-dark">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
        <div class="flex items-center gap-3">
          <button @click="goBack" type="button" class="w-10 h-10 rounded-lg border-[0.5px] border-border-light dark:border-border-dark flex items-center justify-center text-slate-600 dark:text-zinc-300 hover:bg-slate-50 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          </button>
          <div class="pl-2">
            <p v-if="quiz" class="text-[14px] font-medium text-slate-900 dark:text-zinc-200">
              Question {{ currentIndex + 1 }} <span class="text-slate-400 font-normal">of {{ quiz.questions.length }}</span>
            </p>
          </div>
        </div>
        <div class="flex items-center gap-3">
          <div class="px-3 py-1.5 rounded-full border-[0.5px] border-warning/30 bg-warning/5 text-[13px] font-medium text-warning flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            {{ formattedTime }}
          </div>
          <ThemeToggle />
        </div>
      </div>
      <!-- Progress Bar -->
      <div v-if="quiz" class="h-[3px] bg-slate-100 dark:bg-zinc-800">
        <div class="h-full bg-brand transition-all duration-300 ease-out" :style="{ width: `${progress}%` }"></div>
      </div>
    </nav>

    <main class="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <section v-if="quizStore.loading" class="py-16 text-center text-[15px] font-normal text-slate-500 dark:text-zinc-400">
        {{ isSubmitting ? 'Submitting your quiz...' : 'Loading quiz questions...' }}
      </section>

      <section v-else-if="quizStore.error" class="flat-card p-8 text-center">
        <p class="text-[16px] font-medium text-danger">{{ quizStore.error }}</p>
        <button @click="goBack" class="mt-4 text-brand font-medium">Return to dashboard</button>
      </section>

      <section v-else-if="quiz && currentQuestion">
        <!-- Question Text Area -->
        <article class="mb-10">
          <h1 class="text-[22px] sm:text-[26px] leading-relaxed font-normal text-slate-900 dark:text-white">
            {{ currentQuestion.text }}
          </h1>
        </article>

        <!-- Option Cards -->
        <div class="grid grid-cols-1 gap-4">
          <QuizOptionCard
            v-for="(option, index) in currentQuestion.options"
            :key="option._id"
            :label="optionLabels[index]"
            :text="option.text"
            :disabled="answered"
            :card-class="[getOptionClass(option), focusedOptionIndex === index && !answered ? 'border-brand' : '']"
            :badge-class="getBadgeClass(option)"
            @click="selectAnswer(option)"
          />
        </div>

        <!-- Inline Explanation Panel -->
        <transition enter-active-class="transition duration-300 ease-out" enter-from-class="opacity-0 translate-y-4" enter-to-class="opacity-100 translate-y-0">
          <article v-if="answered" class="mt-8 flat-card p-6 bg-slate-50 dark:bg-zinc-900/50">
            <div class="flex items-center gap-2 mb-3">
              <div :class="localAnswers[currentIndex]?.isSelectedCorrect ? 'bg-success' : 'bg-danger'" class="w-1.5 h-1.5 rounded-full"></div>
              <p
                class="text-[14px] font-medium"
                :class="localAnswers[currentIndex]?.isSelectedCorrect ? 'text-success' : 'text-danger'"
              >
                {{ localAnswers[currentIndex]?.isSelectedCorrect ? 'Correct explanation' : 'Incorrect choice explanation' }}
              </p>
            </div>
            <p class="text-[15px] leading-relaxed font-normal text-slate-600 dark:text-zinc-300 sentence-case">
              {{ currentQuestion.explanation || 'No detailed explanation available for this question.' }}
            </p>
          </article>
        </transition>
      </section>
    </main>

    <!-- Footer Bar -->
    <footer v-if="quiz && !quizStore.loading" class="fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-zinc-950 border-t border-border-light dark:border-border-dark">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 py-5 flex items-center justify-between gap-4">
        <button
          @click="toggleFlag"
          type="button"
          class="flex items-center gap-2 px-5 py-2.5 rounded-lg border-[0.5px] text-[14px] font-medium transition-all"
          :class="isFlagged ? 'border-warning text-warning bg-warning/5' : 'border-border-light dark:border-border-dark text-slate-600 dark:text-zinc-300 hover:bg-slate-50'"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" :class="{ 'fill-warning': isFlagged }"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>
          {{ isFlagged ? 'Flagged' : 'Flag' }}
        </button>

        <button
          @click="onNextClick"
          type="button"
          :disabled="!answered"
          class="flex items-center gap-2 px-6 py-2.5 rounded-lg border-[0.5px] border-brand bg-brand text-white text-[14px] font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-[0.98]"
        >
          {{ currentIndex === quiz.questions.length - 1 ? 'Submit results' : 'Next question' }}
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
        </button>
      </div>
    </footer>

    <!-- Review Panel -->
    <FlagReviewPanel
      :open="showFlagReview"
      :flagged-indexes="flaggedQuestionIndexes"
      @close="showFlagReview = false"
      @jump="jumpToFlaggedQuestion"
      @submit="submitQuizFinal"
    />
  </div>
</template>

<script setup>
import { computed, ref, onMounted, onBeforeUnmount, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useQuizStore } from '../store/quiz';
import ThemeToggle from '../components/ThemeToggle.vue';
import QuizOptionCard from '../components/quiz/QuizOptionCard.vue';
import FlagReviewPanel from '../components/quiz/FlagReviewPanel.vue';

const route = useRoute();
const router = useRouter();
const quizStore = useQuizStore();

const optionLabels = ['A', 'B', 'C', 'D', 'E', 'F'];

const currentIndex = ref(0);
const studentAnswers = ref([]);
const answered = ref(false);
const isSubmitting = ref(false);
const flaggedQuestions = ref(new Set());
const showFlagReview = ref(false);
const focusedOptionIndex = ref(0);

const timeLeft = ref(0);
let timer = null;
const isTabActive = ref(true);
let onBlur = null;
let onFocus = null;

const localAnswers = ref({});

const quiz = computed(() => quizStore.currentQuiz);
const currentQuestion = computed(() => {
  if (!quiz.value) return null;
  return quiz.value.questions[currentIndex.value];
});

const progress = computed(() => {
  if (!quiz.value) return 0;
  return ((currentIndex.value + 1) / quiz.value.questions.length) * 100;
});

const formattedTime = computed(() => {
  const minutes = Math.floor(timeLeft.value / 60);
  const seconds = timeLeft.value % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
});

const isFlagged = computed(() => {
  if (!currentQuestion.value) return false;
  return flaggedQuestions.value.has(currentQuestion.value._id);
});

onMounted(async () => {
  const quizId = route.params.id;
  await quizStore.fetchQuizById(quizId);
  
  if (quiz.value) {
    timeLeft.value = (quiz.value.timeLimit || 30) * 60;
    startTimer();
  }

  onBlur = () => { isTabActive.value = false; };
  onFocus = () => { isTabActive.value = true; };
  window.addEventListener('blur', onBlur);
  window.addEventListener('focus', onFocus);

  // Keyboard support: arrow keys
  window.addEventListener('keydown', handleKeyPress);
});

onBeforeUnmount(() => {
  clearInterval(timer);
  window.removeEventListener('keydown', handleKeyPress);
  if (onBlur) window.removeEventListener('blur', onBlur);
  if (onFocus) window.removeEventListener('focus', onFocus);
});

function handleKeyPress(e) {
  if (!quiz.value || !currentQuestion.value) return;

  if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
    e.preventDefault();
    focusedOptionIndex.value = (focusedOptionIndex.value + 1) % currentQuestion.value.options.length;
    return;
  }

  if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
    e.preventDefault();
    focusedOptionIndex.value = (focusedOptionIndex.value - 1 + currentQuestion.value.options.length) % currentQuestion.value.options.length;
    return;
  }

  if ((e.key === 'Enter' || e.key === ' ') && !answered.value) {
    e.preventDefault();
    const focusedOption = currentQuestion.value.options[focusedOptionIndex.value];
    if (focusedOption) selectAnswer(focusedOption);
    return;
  }

  if (answered.value) {
    if (e.key === 'Enter') onNextClick();
    return;
  }
}

function startTimer() {
  timer = setInterval(() => {
    if (!isTabActive.value) return; // Pause if tab blurred
    
    if (timeLeft.value > 0) {
      timeLeft.value--;
    } else {
      clearInterval(timer);
      submitQuizFinal();
    }
  }, 1000);
}

function selectAnswer(option) {
  if (answered.value) return;

  const isCorrect = option.isCorrect;
  
  localAnswers.value[currentIndex.value] = {
    selectedOption: option,
    isSelectedCorrect: isCorrect
  };
  
  studentAnswers.value.push({
    questionId: currentQuestion.value._id,
    selectedOptionId: option._id
  });

  answered.value = true;
}

function getOptionClass(option) {
  if (!answered.value) {
    return 'border-border-light dark:border-border-dark bg-white dark:bg-zinc-900 hover:border-brand/50 cursor-pointer';
  }

  const isCorrect = option.isCorrect;
  const selected = isSelected(option);

  if (isCorrect) {
    return 'border-success bg-success/5 text-success cursor-default';
  }

  if (selected && !isCorrect) {
    return 'border-danger bg-danger/5 text-danger cursor-default';
  }

  return 'border-border-light dark:border-border-dark bg-white dark:bg-zinc-900 opacity-50 cursor-default';
}

function getBadgeClass(option) {
  if (!answered.value) {
    return 'border-border-light dark:border-border-dark text-slate-400 group-hover:border-brand group-hover:text-brand';
  }
  
  const isCorrect = option.isCorrect;
  const selected = isSelected(option);
  
  if (isCorrect) return 'bg-success text-white border-success';
  if (selected && !isCorrect) return 'bg-danger text-white border-danger';
  
  return 'border-border-light dark:border-border-dark text-slate-300 opacity-50';
}

const isSelected = (option) => {
  const local = localAnswers.value[currentIndex.value];
  return local && local.selectedOption._id === option._id;
};

function toggleFlag() {
  if (!currentQuestion.value) return;
  const id = currentQuestion.value._id;
  if (flaggedQuestions.value.has(id)) {
    flaggedQuestions.value.delete(id);
  } else {
    flaggedQuestions.value.add(id);
  }
}

async function nextQuestion() {
  if (currentIndex.value < quiz.value.questions.length - 1) {
    currentIndex.value++;
    answered.value = !!localAnswers.value[currentIndex.value];
    focusedOptionIndex.value = 0;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } else {
    if (flaggedQuestions.value.size > 0) {
      showFlagReview.value = true;
      return;
    }
    clearInterval(timer);
    await submitQuizFinal();
  }
}

async function submitQuizFinal() {
  clearInterval(timer);
  showFlagReview.value = false;
  isSubmitting.value = true;
  const timeTaken = ((quiz.value.timeLimit || 30) * 60) - timeLeft.value;
  
  try {
    const result = await quizStore.submitQuiz(quiz.value._id, studentAnswers.value, timeTaken, quiz.value.questions.length);
    router.push({
      path: '/result',
      query: {
        score: result.score,
        total: result.totalQuestions,
        quizId: quiz.value._id
      },
    });
  } catch (err) {
    console.error("Failed to submit", err);
  } finally {
    isSubmitting.value = false;
  }
}

function goBack() {
  if (confirm('Are you sure you want to end the test? Progress will not be saved.')) {
    router.push('/dashboard');
  }
}

function onNextClick() {
  nextQuestion();
}

const flaggedQuestionIndexes = computed(() => {
  if (!quiz.value) return [];
  return quiz.value.questions
    .map((question, index) => (flaggedQuestions.value.has(question._id) ? index : -1))
    .filter((index) => index !== -1);
});

function jumpToFlaggedQuestion(index) {
  currentIndex.value = index;
  answered.value = !!localAnswers.value[currentIndex.value];
  focusedOptionIndex.value = 0;
  showFlagReview.value = false;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
</script>