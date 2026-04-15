<template>
  <NeoAppShell>
    <div class="px-4 sm:px-8 py-8">

      <!-- Header -->
      <header class="mb-8">
        <h1 class="text-2xl sm:text-3xl font-bold text-zinc-400 dark:text-zinc-400 uppercase tracking-widest mb-2">Flashcards</h1>
        <p class="text-[15px] font-medium text-zinc-500 dark:text-zinc-500">Select a course to start your flashcard session.</p>
      </header>

      <!-- Loading -->
      <NeoLoader v-if="quizStore.loading" label="Loading decks..." />

      <!-- Empty State -->
      <div v-else-if="quizStore.quizzes.length === 0" class="flex flex-col items-center justify-center py-20 text-center">
        <div class="w-20 h-20 rounded-[20px] bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-3xl mb-5">✧</div>
        <h2 class="text-xl font-semibold text-zinc-700 dark:text-zinc-300 mb-2">No decks available</h2>
        <p class="text-[13px] text-zinc-400 dark:text-zinc-500">Courses added by your admin will appear here.</p>
      </div>

      <!-- Course Card Grid -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
        <div
          v-for="quiz in quizStore.quizzes"
          :key="quiz._id"
          @click="$router.push(`/flashcards/${quiz._id}`)"
          class="group cursor-pointer bg-[var(--neo-surface)] rounded-[24px] shadow-neo border border-white/20 dark:border-white/5 p-6 hover:shadow-neo-md transition-all duration-300 hover:-translate-y-0.5"
        >
          <!-- Icon + card count -->
          <div class="flex items-start justify-between mb-5">
            <div class="w-12 h-12 rounded-[16px] bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-[22px]">
              {{ getIcon(quiz.title) }}
            </div>
            <div class="flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800">
              <span class="text-[10px] font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">{{ quiz.questions?.length || 0 }} cards</span>
            </div>
          </div>

          <!-- Title + description -->
          <h3 class="text-[17px] font-semibold text-zinc-800 dark:text-zinc-100 mb-1">{{ quiz.title }}</h3>
          <p class="text-[13px] text-zinc-500 dark:text-zinc-500 mb-5">{{ quiz.description || 'Tap to review the full flashcard deck.' }}</p>

          <!-- Footer row -->
          <div class="pt-4 border-t border-dashed border-black/10 dark:border-white/10 flex items-center justify-between">
            <div class="flex items-center gap-2">
              <!-- Mini card preview stack -->
              <div class="flex -space-x-1">
                <div v-for="n in Math.min(3, quiz.questions?.length || 0)" :key="n"
                  class="w-5 h-7 rounded-md border border-white/30 dark:border-white/10 shadow-sm"
                  :class="n === 1 ? 'bg-zinc-300 dark:bg-zinc-600' : n === 2 ? 'bg-zinc-200 dark:bg-zinc-700' : 'bg-zinc-100 dark:bg-zinc-800'">
                </div>
              </div>
              <span class="text-[12px] text-zinc-400 dark:text-zinc-500">Flashcard deck</span>
            </div>
            <span class="text-[13px] font-medium text-zinc-500 group-hover:translate-x-1 transition-transform">Study →</span>
          </div>
        </div>
      </div>
    </div>
  </NeoAppShell>
</template>

<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useQuizStore } from '../store/quiz';
import NeoAppShell from '../components/layout/NeoAppShell.vue';
import NeoLoader from '../components/common/NeoLoader.vue';

const router = useRouter();
const quizStore = useQuizStore();

const getIcon = (title) => {
  const icons = {
    'Mathematics': '🧮', 'English': '📘', 'Physics': '🧪',
    'Biology': '🌿', 'Chemistry': '⚗️', 'Economics': '📈', 'Government': '🏛️'
  };
  return icons[title] || '📚';
};

onMounted(() => {
  quizStore.fetchQuizzes();
});
</script>
