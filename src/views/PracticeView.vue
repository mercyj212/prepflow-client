<template>
  <NeoAppShell>
    <div class="max-w-2xl mx-auto px-4 sm:px-8 py-8">
      <!-- Loading State -->
      <NeoLoader v-if="loading" label="Preparing your session..." />

      <!-- Result State -->
      <div v-else-if="finished" class="text-center py-20 animate-fade-in">
        <div class="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 :size="40" />
        </div>
        <h2 class="text-3xl font-bold mb-2 text-zinc-800 dark:text-zinc-100">Practice Complete!</h2>
        <p class="text-zinc-500 dark:text-zinc-400 mb-8">You scored {{ score }} out of {{ quiz.questions.length }}</p>
        <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
           <button @click="resetPractice" class="px-8 py-3 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-semibold rounded-xl hover:opacity-90 transition">
             Practice Again
           </button>
           <router-link to="/subjects" class="px-8 py-3 border border-black/10 dark:border-white/10 text-zinc-600 dark:text-zinc-400 font-semibold rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800 transition">
             Browse Courses
           </router-link>
        </div>
      </div>

      <!-- Quiz State -->
      <div v-else-if="quiz" class="animate-fade-in">
        <header class="mb-8">
          <h1 class="text-2xl sm:text-3xl font-bold text-zinc-400 dark:text-zinc-400 uppercase tracking-widest mb-1">Practice</h1>
          <p class="text-[15px] font-medium text-zinc-500">{{ quiz.title }} · Question {{ currentIndex + 1 }} of {{ quiz.questions.length }}</p>
        </header>

        <div class="mb-8">
          <h3 class="text-xl font-semibold leading-relaxed text-zinc-800 dark:text-zinc-100">{{ currentQuestion.text }}</h3>
        </div>

        <div class="space-y-3">
          <button
            v-for="(option, index) in currentQuestion.options"
            :key="index"
            @click="selectAnswer(option)"
            :disabled="answered"
            :class="[
              'w-full flex items-center p-4 rounded-[18px] border text-left transition-all duration-200 group',
              getOptionClass(option)
            ]"
          >
            <span 
              class="w-9 h-9 rounded-full border flex items-center justify-center mr-4 text-[13px] font-bold transition-colors shrink-0"
              :class="getLabelClass(option)"
            >
              {{ String.fromCharCode(65 + index) }}
            </span>
            <span class="text-[15px]">{{ option.text }}</span>
          </button>
        </div>

        <!-- Feedback & Next Section -->
        <div v-if="answered" class="mt-8 p-6 rounded-[18px] border transition-all animate-bounce-in" :class="feedbackClass">
          <div class="flex items-start gap-4">
            <div class="mt-1">
               <CheckCircle2 v-if="isCorrect" :size="20" class="text-emerald-500" />
               <XCircle v-else :size="20" class="text-red-500" />
            </div>
            <div class="flex-1">
              <h4 class="font-bold mb-1 text-[15px]">{{ isCorrect ? 'Correct!' : 'Incorrect' }}</h4>
              <p class="text-[13px] opacity-90 leading-relaxed">{{ currentQuestion.explanation || 'Check your course materials to learn more about this topic.' }}</p>
            </div>
          </div>
          <button 
            @click="nextQuestion" 
            class="mt-5 w-full py-3 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-bold rounded-xl transition hover:opacity-90 text-[13px] uppercase tracking-widest"
          >
            {{ currentIndex === quiz.questions.length - 1 ? 'Finish Practice' : 'Continue' }}
          </button>
        </div>
      </div>
    </div>
  </NeoAppShell>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { CheckCircle2, XCircle } from 'lucide-vue-next';
import api from '../api/axios';
import NeoAppShell from '../components/layout/NeoAppShell.vue';
import NeoLoader from '../components/common/NeoLoader.vue';

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
