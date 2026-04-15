<template>
  <NeoAppShell>
    <div class="px-6 sm:px-12 py-10 max-w-7xl mx-auto">
      <!-- HERO SECTION -->
      <header class="mb-14">
          <div class="flex items-center gap-3 mb-4">
            <span class="w-1.5 h-1.5 rounded-full bg-brand"></span>
            <span class="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400">Diagnostic Hub</span>
          </div>
          <h1 class="text-4xl md:text-5xl font-black text-slate-900 dark:text-zinc-100 tracking-tight mb-4">Refine your knowledge.</h1>
          <p class="text-[16px] text-slate-500 dark:text-zinc-500 max-w-xl leading-relaxed">
            Select a specialized module to begin an precision diagnostic session. Your path to academic mastery starts with a single subject.
          </p>
      </header>

      <!-- FEATURED GRID -->
      <div v-if="quizStore.loading" class="flex flex-col items-center justify-center py-20 gap-6">
        <NeoLoader color="#14b8a6" size="large" />
        <p class="text-[11px] font-black uppercase tracking-widest text-slate-400">Synchronizing curriculum nodes...</p>
      </div>

      <div v-else class="space-y-16">
        <!-- RECENT ACTIVITY (IF ANY) -->
        <section v-if="recentSubmissions.length > 0">
           <h2 class="text-[12px] font-black uppercase tracking-[0.2em] text-slate-400 mb-8 px-1">Continuous Progress</h2>
           <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <NeoCard 
                v-for="sub in recentSubmissions.slice(0, 3)" 
                :key="sub._id"
                variant="depressed"
                class="p-6 group cursor-pointer hover:border-brand/30 transition-all"
                @click="router.push(`/quiz/${sub.quiz._id}`)"
              >
                <div class="flex items-start justify-between mb-6">
                  <div class="w-10 h-10 rounded-xl bg-brand/10 text-brand flex items-center justify-center text-xl">
                    {{ getIcon(sub.quiz?.title) }}
                  </div>
                  <div class="text-[13px] font-bold text-slate-400">
                    {{ Math.round((sub.score / sub.totalQuestions) * 100) }}% <span class="text-[10px] font-black uppercase text-slate-300 ml-1">Score</span>
                  </div>
                </div>
                <h3 class="text-[17px] font-bold text-slate-800 dark:text-zinc-100 mb-1">{{ sub.quiz?.title }}</h3>
                <p class="text-[12px] text-slate-500 dark:text-zinc-500 line-clamp-1 mb-4">Resume diagnostic for {{ sub.quiz?.title }}.</p>
                <div class="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-zinc-800/50">
                    <span class="text-[11px] font-black uppercase tracking-widest text-slate-400">Module active</span>
                    <span class="text-brand text-xs font-bold group-hover:translate-x-1 transition-transform">Resume -></span>
                </div>
              </NeoCard>
           </div>
        </section>

        <!-- CORE CURRICULUM -->
        <section>
          <div class="flex items-center justify-between mb-8 px-1">
            <h2 class="text-[12px] font-black uppercase tracking-[0.2em] text-slate-400">Available Subjects</h2>
            <router-link to="/subjects" class="text-[11px] font-black uppercase tracking-widest text-brand hover:underline transition-all">View All Modules -></router-link>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div 
              v-for="quiz in quizStore.quizzes.slice(0, 6)" 
              :key="quiz._id"
              class="group relative bg-[var(--neo-surface)] rounded-[32px] p-8 border border-slate-200 dark:border-zinc-800 shadow-neo hover:shadow-neo-md transition-all duration-500 cursor-pointer overflow-hidden"
              @click="router.push(`/quiz/${quiz._id}`)"
            >
              <!-- Background Ambient Glow -->
              <div class="absolute -right-10 -top-10 w-32 h-32 bg-brand/5 rounded-full blur-3xl group-hover:bg-brand/10 transition-colors"></div>

              <div class="flex items-start justify-between mb-8 relative z-10">
                <div class="w-14 h-14 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                  {{ getIcon(quiz.title) }}
                </div>
                <div class="px-3 py-1 rounded-full bg-slate-100 dark:bg-zinc-800 text-[10px] font-black uppercase tracking-widest text-slate-400">
                  {{ quiz.questions?.length || 0 }} Items
                </div>
              </div>

              <h3 class="text-xl font-bold text-slate-800 dark:text-zinc-100 mb-2 relative z-10">{{ quiz.title }}</h3>
              <p class="text-[14px] text-slate-500 dark:text-zinc-500 mb-8 leading-relaxed line-clamp-2">{{ quiz.description || 'Comprehensive practice set organized by core curriculum standards.' }}</p>
              
              <div class="pt-6 border-t border-white/5 flex items-center justify-between relative z-10">
                <div class="text-[11px] font-black uppercase tracking-widest text-slate-400 group-hover:text-brand transition-colors">
                  Diagnostic Ready
                </div>
                <div class="w-10 h-10 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-black flex items-center justify-center group-hover:translate-x-2 transition-all">
                  →
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  </NeoAppShell>
</template>

<script setup>
import { onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useQuizStore } from '../store/quiz';
import NeoAppShell from '../components/layout/NeoAppShell.vue';
import NeoCard from '../components/common/NeoCard.vue';
import NeoLoader from '../components/common/NeoLoader.vue';

const router = useRouter();
const quizStore = useQuizStore();

onMounted(() => {
  quizStore.fetchQuizzes();
  quizStore.fetchMySubmissions();
});

const recentSubmissions = computed(() => {
  return [...quizStore.mySubmissions].reverse();
});

const getIcon = (title) => {
  const icons = {
    'Mathematics': '🧮', 'English': '📘', 'Physics': '🧪',
    'Biology': '🌿', 'Chemistry': '⚗️', 'Economics': '📈', 'Government': '🏛️'
  };
  return icons[title] || '📚';
};
</script>

<style scoped>
.shadow-neo {
  box-shadow: 
    -4px -4px 10px rgba(255, 255, 255, 0.02),
    4px 4px 10px rgba(0, 0, 0, 0.2);
}
.dark .shadow-neo {
  box-shadow: 
    -4px -4px 10px rgba(255, 255, 255, 0.01),
    4px 4px 10px rgba(0, 0, 0, 0.4);
}
</style>
