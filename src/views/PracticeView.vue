<template>
  <div class="min-h-screen bg-[#FBFBFB] dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 font-sans transition-colors duration-300 flex flex-col">
    <!-- Navbar -->
    <nav class="sticky top-0 z-50 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 px-6 py-4">
      <div class="max-w-4xl mx-auto flex items-center justify-between">
        <BrandLogo />
        <ThemeToggle />
      </div>
    </nav>

    <main class="flex-grow max-w-2xl mx-auto w-full px-6 py-12">
      <!-- Loading State -->
      <div v-if="loading" class="flex flex-col items-center justify-center py-20">
        <div class="w-6 h-6 border-2 border-zinc-300 dark:border-zinc-700 border-t-zinc-900 dark:border-t-white rounded-full animate-spin mb-4"></div>
        <p class="text-sm text-zinc-500">Preparing your session...</p>
      </div>

      <!-- Result State -->
      <div v-else-if="finished" class="text-center py-20 animate-fade-in">
        <div class="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        </div>
        <h2 class="text-3xl font-bold mb-2">Practice Complete!</h2>
        <p class="text-zinc-500 dark:text-zinc-400 mb-8">You scored {{ score }} out of {{ quiz.questions.length }}</p>
        
        <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
           <button @click="resetPractice" class="px-8 py-3 bg-black dark:bg-white text-white dark:text-black font-semibold rounded-xl hover:opacity-90 transition">
             Practice Again
           </button>
           <router-link to="/register" class="px-8 py-3 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 font-semibold rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-900 transition">
             Create Full Account
           </router-link>
        </div>
      </div>

      <!-- Quiz State -->
      <div v-else-if="quiz" class="animate-fade-in">
        <div class="mb-8 border-b border-zinc-200 dark:border-zinc-800 pb-6 flex items-center justify-between">
          <div>
            <h2 class="text-xl font-bold">{{ quiz.title }}</h2>
            <p class="text-sm text-zinc-500">Question {{ currentIndex + 1 }} of {{ quiz.questions.length }}</p>
          </div>
          <div class="text-right">
             <span class="text-xs font-bold uppercase tracking-widest text-zinc-400">Score: {{ score }}</span>
          </div>
        </div>

        <div class="mb-10">
          <h3 class="text-2xl font-medium leading-relaxed">{{ currentQuestion.text }}</h3>
        </div>

        <div class="space-y-3">
          <button
            v-for="(option, index) in currentQuestion.options"
            :key="index"
            @click="selectAnswer(option)"
            :disabled="answered"
            :class="[
              'w-full flex items-center p-4 rounded-xl border text-left transition-all duration-200 group',
              getOptionClass(option)
            ]"
          >
            <span 
              class="w-10 h-10 rounded-full border flex items-center justify-center mr-4 text-sm font-bold transition-colors"
              :class="getLabelClass(option)"
            >
              {{ String.fromCharCode(65 + index) }}
            </span>
            <span class="text-lg">{{ option.text }}</span>
          </button>
        </div>

        <!-- Feedback & Next Section -->
        <div v-if="answered" class="mt-10 p-6 rounded-2xl border transition-all animate-bounce-in" :class="feedbackClass">
          <div class="flex items-start gap-4">
            <div class="mt-1">
               <svg v-if="isCorrect" class="w-6 h-6 text-emerald-500" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path></svg>
               <svg v-else class="w-6 h-6 text-red-500" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path></svg>
            </div>
            <div class="flex-1">
              <h4 class="font-bold mb-1">{{ isCorrect ? 'Correct!' : 'Incorrect' }}</h4>
              <p class="text-sm opacity-90 leading-relaxed">{{ currentQuestion.explanation || 'Review the source material to explore why this answer is consistent with the curriculum.' }}</p>
            </div>
          </div>
          <button 
            @click="nextQuestion" 
            class="mt-6 w-full py-3 bg-black dark:bg-white text-white dark:text-black font-bold rounded-xl transition hover:opacity-90"
          >
            {{ currentIndex === quiz.questions.length - 1 ? 'Finish Practice' : 'Continue' }}
          </button>
        </div>
      </div>
    </main>

    <footer class="py-10 bg-black border-t border-white/5 text-center">
      <p class="text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-600">Powered by PrepUp Interactive Learning</p>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import api from '../api/axios';
import ThemeToggle from '../components/ThemeToggle.vue';
import BrandLogo from '../components/BrandLogo.vue';

const route = useRoute();
const loading = ref(true);
const quiz = ref(null);
const currentIndex = ref(0);
const score = ref(0);
const selectedOption = ref(null);
const answered = ref(false);
const finished = ref(false);

const currentQuestion = computed(() => quiz.value?.questions[currentIndex.value]);
const isCorrect = computed(() => selectedOption.value?.isCorrect);

const fetchQuiz = async () => {
  loading.value = true;
  try {
    const res = await api.get(`/quizzes/${route.params.id}/study/public`);
    quiz.value = res.data;
  } catch (err) {
    console.error(err);
    alert('Failed to load practice quiz. It may no longer be available.');
  } finally {
    loading.value = false;
  }
};

onMounted(fetchQuiz);

const selectAnswer = (option) => {
  if (answered.value) return;
  selectedOption.value = option;
  answered.value = true;
  if (option.isCorrect) score.value++;
};

const nextQuestion = () => {
  if (currentIndex.value < quiz.value.questions.length - 1) {
    currentIndex.value++;
    answered.value = false;
    selectedOption.value = null;
  } else {
    finished.value = true;
  }
};

const resetPractice = () => {
  currentIndex.value = 0;
  score.value = 0;
  answered.value = false;
  selectedOption.value = null;
  finished.value = false;
};

const getOptionClass = (option) => {
  if (!answered.value) {
    return 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 hover:border-black dark:hover:border-white cursor-pointer';
  }
  if (option.isCorrect) {
    return 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-500 text-emerald-700 dark:text-emerald-400 cursor-default';
  }
  if (selectedOption.value?._id === option._id && !option.isCorrect) {
    return 'bg-red-50 dark:bg-red-950/20 border-red-500 text-red-700 dark:text-red-400 cursor-default';
  }
  return 'bg-zinc-50 dark:bg-zinc-900 border-zinc-100 dark:border-zinc-800 opacity-50 cursor-default';
};

const getLabelClass = (option) => {
  if (!answered.value) {
    return 'border-zinc-200 dark:border-zinc-800 text-zinc-400 group-hover:border-black group-hover:text-black dark:group-hover:text-white';
  }
  if (option.isCorrect) {
    return 'bg-emerald-500 border-emerald-500 text-white';
  }
  if (selectedOption.value?._id === option._id && !option.isCorrect) {
    return 'bg-red-500 border-red-500 text-white';
  }
  return 'border-zinc-200 dark:border-zinc-800 text-zinc-400';
};

const feedbackClass = computed(() => {
  if (!isCorrect.value) return 'bg-red-50 dark:bg-red-950/10 border-red-100 dark:border-red-900/30 text-red-900 dark:text-red-300';
  return 'bg-emerald-50 dark:bg-emerald-950/10 border-emerald-100 dark:border-emerald-900/30 text-emerald-900 dark:text-emerald-300';
});
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.4s ease-out forwards;
}
.animate-bounce-in {
  animation: bounceIn 0.5s cubic-bezier(0.18, 0.89, 0.32, 1.28) forwards;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes bounceIn {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}
</style>
