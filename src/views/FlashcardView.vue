<template>
  <div class="min-h-screen bg-black flex flex-col items-center justify-center px-4 relative overflow-hidden">
    <!-- Abstract background blobs -->
    <div class="absolute top-0 left-0 w-96 h-96 bg-purple-900/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
    <div class="absolute bottom-0 right-0 w-96 h-96 bg-blue-900/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>

    <div v-if="quizStore.loading" class="text-white text-center z-10">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-4"></div>
      <p>Loading Flashcards...</p>
    </div>

    <div v-else-if="quizStore.error" class="text-red-500 text-center bg-zinc-900 border border-zinc-800 p-8 rounded-2xl z-10">
      <h2 class="text-xl font-bold mb-2">Error</h2>
      <p>{{ quizStore.error }}</p>
      <button @click="$router.push('/')" class="mt-4 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-white transition">Go Back</button>
    </div>

    <div v-else-if="quiz && quiz.questions.length > 0" class="w-full max-w-3xl z-10">
      <div class="flex justify-between items-center mb-8 px-2">
        <button @click="$router.push('/dashboard')" class="text-zinc-400 hover:text-white flex items-center gap-2 transition">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
          Back
        </button>
        <div class="text-center">
          <h2 class="text-white font-bold text-lg">{{ quiz.title }} — Study Mode</h2>
          <p class="text-sm text-zinc-400">Card {{ currentIndex + 1 }} of {{ quiz.questions.length }}</p>
        </div>
        <div class="w-20"></div> <!-- spacer for alignment -->
      </div>

      <!-- Flashcard Container -->
      <div class="relative w-full h-96 perspective-1000 group cursor-pointer" @click="flipCard">
        <div 
          class="w-full h-full absolute transition-all duration-500 transform-style-3d"
          :class="{ 'rotate-y-180': isFlipped }"
        >
          
          <!-- Front of card (Question) -->
          <div class="absolute w-full h-full backface-hidden rounded-3xl bg-zinc-900 border border-zinc-700/50 shadow-2xl flex flex-col items-center justify-center p-8 sm:p-12 text-center group-hover:border-zinc-500 transition-colors">
            <span class="absolute top-6 left-6 text-xs font-bold text-zinc-500 uppercase tracking-widest bg-zinc-800 px-3 py-1 rounded-full">Question</span>
            <p class="text-2xl sm:text-3xl font-semibold text-white leading-tight">
              {{ currentQuestion.text }}
            </p>
            <p class="absolute bottom-6 text-zinc-500 text-sm animate-pulse flex items-center gap-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"></path></svg>
              Tap to flip
            </p>
          </div>

          <!-- Back of card (Answer) -->
          <div class="absolute w-full h-full backface-hidden rotate-y-180 rounded-3xl bg-gradient-to-br from-indigo-900/40 to-cyan-900/40 border border-indigo-500/30 shadow-[0_0_50px_rgba(99,102,241,0.1)] flex flex-col items-center justify-center p-8 sm:p-12 text-center">
            <span class="absolute top-6 left-6 text-xs font-bold text-indigo-300 uppercase tracking-widest bg-indigo-500/20 px-3 py-1 rounded-full border border-indigo-500/20">Answer</span>
            <p class="text-2xl sm:text-3xl font-bold text-white leading-tight">
              {{ correctAnswerText }}
            </p>
            <div v-if="currentQuestion.explanation" class="mt-6 p-4 rounded-xl bg-black/40 text-left w-full border border-white/5">
              <p class="text-sm font-semibold text-indigo-300 mb-1">Explanation:</p>
              <p class="text-sm text-zinc-300">{{ currentQuestion.explanation }}</p>
            </div>
          </div>

        </div>
      </div>

      <!-- Controls -->
      <div class="flex items-center justify-center gap-6 mt-12 w-full">
        <button 
          @click="prevCard" 
          :disabled="currentIndex === 0"
          class="p-4 rounded-full bg-zinc-900 border border-zinc-800 text-white hover:border-zinc-500 hover:bg-zinc-800 disabled:opacity-30 disabled:hover:border-zinc-800 disabled:hover:bg-zinc-900 transition-all shadow-lg active:scale-95"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>
        </button>
        
        <button 
          v-if="currentIndex === quiz.questions.length - 1"
          @click="$router.push(`/quiz/${quiz._id}`)"
          class="px-8 py-4 rounded-2xl bg-indigo-600 font-bold text-white hover:bg-indigo-500 transition-all shadow-[0_0_20px_rgba(79,70,229,0.3)] min-w-[160px] active:scale-95"
        >
          Take Quiz Now
        </button>

        <button 
          v-else
          @click="nextCard"
          class="px-8 py-4 rounded-2xl bg-zinc-900 border border-zinc-700 font-bold text-white hover:bg-zinc-800 hover:border-zinc-500 transition-all min-w-[160px] active:scale-95"
        >
          Next Card
        </button>

        <button 
          @click="nextCard" 
          :disabled="currentIndex === quiz.questions.length - 1"
          class="p-4 rounded-full bg-zinc-900 border border-zinc-800 text-white hover:border-zinc-500 hover:bg-zinc-800 disabled:opacity-30 disabled:hover:border-zinc-800 disabled:hover:bg-zinc-900 transition-all shadow-lg active:scale-95"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
        </button>
      </div>

    </div>

    <div v-else class="text-zinc-400 z-10 text-center">
      <p>This study set has no questions yet.</p>
      <button @click="$router.push('/')" class="mt-4 px-4 py-2 bg-zinc-800 rounded-lg text-white">Return Home</button>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useQuizStore } from '../store/quiz';
import axios from 'axios';
import { useAuthStore } from '../store/auth';

const route = useRoute();
const router = useRouter();
const quizStore = useQuizStore();
const authStore = useAuthStore();

const currentIndex = ref(0);
const isFlipped = ref(false);

const quizId = route.params.id;
// We need to fetch the quiz WITH correct answers visible for studying.
// Since the standard /api/quizzes endpoint removes `isCorrect`, we need a special endpoint or just hit it and assume we are admin?
// Actually, earlier the API returns `-questions.options.isCorrect`. 
// To make Flashcards work, we will need to adjust the backend quizController OR create a specific study endpoint.
// For now, let's load it. Wait, the API strips `isCorrect`.
// I will need to quickly add `isCorrect` dynamically or fix the API to allow a study route! 
const quiz = computed(() => quizStore.currentQuiz);

const currentQuestion = computed(() => {
  if (!quiz.value || quiz.value.questions.length === 0) return null;
  return quiz.value.questions[currentIndex.value];
});

// Since the standard API strips `isCorrect`, let's just show the correct answer if it exists, otherwise fallback to finding it if we update the backend.
const correctAnswerText = computed(() => {
  if (!currentQuestion.value) return '';
  const correctOpt = currentQuestion.value.options.find(o => o.isCorrect === true);
  return correctOpt ? correctOpt.text : 'No correct answer found.';
});

onMounted(async () => {
  isFlipped.value = false;
  await quizStore.fetchStudyQuizById(quizId);
});

const flipCard = () => {
  isFlipped.value = !isFlipped.value;
};

const nextCard = () => {
  if (currentIndex.value < quiz.value.questions.length - 1) {
    if (isFlipped.value) {
      isFlipped.value = false;
      setTimeout(() => {
        currentIndex.value++;
      }, 300);
    } else {
      currentIndex.value++;
    }
  }
};

const prevCard = () => {
  if (currentIndex.value > 0) {
    if (isFlipped.value) {
      isFlipped.value = false;
      setTimeout(() => {
        currentIndex.value--;
      }, 300);
    } else {
      currentIndex.value--;
    }
  }
};

</script>

<style scoped>
.perspective-1000 {
  perspective: 1000px;
}
.transform-style-3d {
  transform-style: preserve-3d;
}
.backface-hidden {
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
}
.rotate-y-180 {
  transform: rotateY(180deg);
}
</style>
