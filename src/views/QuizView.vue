<template>
  <div class="min-h-screen bg-black flex flex-col items-center justify-center px-4">
    
    <div v-if="quizStore.loading" class="text-white text-center">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-4"></div>
      <p>Loading Quiz...</p>
    </div>

    <div v-else-if="quizStore.error" class="text-red-500 text-center bg-zinc-900 border border-zinc-800 p-8 rounded-2xl">
      <h2 class="text-xl font-bold mb-2">Error</h2>
      <p>{{ quizStore.error }}</p>
      <button @click="$router.push('/')" class="mt-4 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-white">Go Back</button>
    </div>

    <div v-else-if="quiz" class="w-full max-w-2xl rounded-2xl bg-zinc-900 p-6 sm:p-8 shadow-2xl border border-zinc-800">
      
      <div class="flex items-center justify-between mb-4 pb-4 border-b border-zinc-800">
        <div>
          <h2 class="text-white font-bold">{{ quiz.title }}</h2>
          <p class="text-sm text-zinc-400 mt-1">
            Question {{ currentIndex + 1 }} of {{ quiz.questions.length }}
          </p>
        </div>
        <div class="flex flex-col items-end">
          <p class="text-sm font-semibold text-red-400 flex items-center gap-1.5 bg-red-500/10 px-3 py-1.5 rounded-full">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            {{ formattedTime }}
          </p>
        </div>
      </div>

      <div class="w-full bg-zinc-800 rounded-full h-1.5 mb-8">
        <div
          class="bg-indigo-500 h-1.5 rounded-full transition-all duration-300"
          :style="{ width: progress + '%' }"
        ></div>
      </div>

      <div class="mb-8">
        <h1 class="text-white text-xl sm:text-2xl font-semibold leading-relaxed">
          {{ currentQuestion.text }}
        </h1>
      </div>

      <div class="space-y-3">
        <button
          v-for="(option, index) in currentQuestion.options"
          :key="option._id"
          @click="selectAnswer(option)"
          :disabled="answered"
          :class="[
            'w-full rounded-xl border px-5 py-4 text-left text-white transition-all flex items-center group',
            getOptionClass(option)
          ]"
          :style="answered && option.isCorrect ? { borderColor: '#10b981', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10b981' } : {}"
        >
          <span 
            class="w-8 h-8 rounded-full border border-zinc-600 flex items-center justify-center mr-4 text-sm tracking-wide font-medium transition-colors shrink-0" 
            :class="[
              isSelected(option) ? 'bg-white/10' : '',
              !answered ? 'group-hover:border-indigo-400 group-hover:text-indigo-400' : ''
            ]"
            :style="answered && option.isCorrect ? { borderColor: '#10b981', color: '#10b981' } : (answered && isSelected(option) && !option.isCorrect ? { borderColor: '#f87171', color: '#f87171' } : {})"
          >
            {{ optionLabels[index] }}
          </span>
          <span class="text-sm sm:text-base" :style="answered && option.isCorrect ? { color: '#10b981', fontWeight: '600' } : (answered && isSelected(option) && !option.isCorrect ? { color: '#f87171', fontWeight: '600' } : {})">{{ option.text }}</span>
        </button>
      </div>

      <div
        v-if="answered"
        class="mt-8 pt-6 border-t border-zinc-800"
      >
        <div class="flex items-center justify-between">
          <p v-if="localAnswers[currentIndex]?.isSelectedCorrect" class="text-emerald-400 font-semibold flex items-center gap-2">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>
            Answered
          </p>
          <p v-else class="text-zinc-400 font-medium flex items-center gap-2">
            Answer Recorded
          </p>

          <button
            @click="nextQuestion"
            class="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-2.5 font-medium text-white hover:bg-indigo-700 transition"
          >
            {{ currentIndex === quiz.questions.length - 1 ? 'Submit Quiz' : 'Next Question' }}
            <svg v-if="currentIndex !== quiz.questions.length - 1" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
            <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
          </button>
        </div>
      </div>
      
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, onBeforeUnmount, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useQuizStore } from '../store/quiz';

const route = useRoute();
const router = useRouter();
const quizStore = useQuizStore();

const optionLabels = ['A', 'B', 'C', 'D', 'E', 'F'];

const currentIndex = ref(0);
const studentAnswers = ref([]); // Tracks all answers { questionId, selectedOptionId }
const answered = ref(false);

const timeLeft = ref(0);
let timer = null;

// Temporary local state to show selection before submission
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

onMounted(async () => {
  const quizId = route.params.id;
  await quizStore.fetchQuizById(quizId);
  
  if (quiz.value) {
    console.log('--- DEBUG: QUIZ LOADED ---');
    console.log('Title:', quiz.value.title);
    console.log('Q1 Options Correctness:', quiz.value.questions[0].options.map(o => `${o.text}: ${o.isCorrect}`));
    timeLeft.value = (quiz.value.timeLimit || 30) * 60;
    startTimer();
  }
});

onBeforeUnmount(() => {
  clearInterval(timer);
});

function startTimer() {
  timer = setInterval(() => {
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

const isSelected = (option) => {
  const local = localAnswers.value[currentIndex.value];
  return local && local.selectedOption._id === option._id;
};

function getOptionClass(option) {
  if (!answered.value) {
    return 'border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800/80 hover:border-zinc-600 cursor-pointer';
  }

  const isCorrect = option.isCorrect;
  const selected = isSelected(option);

  if (isCorrect) {
    return 'border-emerald-500 bg-emerald-500/10 text-emerald-400 cursor-default shadow-[0_0_20px_rgba(16,185,129,0.2)] z-10';
  }

  if (selected && !isCorrect) {
    return 'border-red-500 bg-red-500/10 text-red-400 cursor-default shadow-[0_0_20px_rgba(239,68,68,0.2)] z-10';
  }

  return 'border-zinc-800 bg-zinc-900/30 opacity-40 cursor-default';
}

async function nextQuestion() {
  if (currentIndex.value < quiz.value.questions.length - 1) {
    currentIndex.value++;
    answered.value = !!localAnswers.value[currentIndex.value];
  } else {
    clearInterval(timer);
    await submitQuizFinal();
  }
}

async function submitQuizFinal() {
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
  }
}
</script>