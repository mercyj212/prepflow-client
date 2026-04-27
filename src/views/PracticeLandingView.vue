<template>
  <NeoAppShell>
    <div class="px-6 sm:px-12 py-10 max-w-7xl mx-auto">
      <!-- HERO SECTION -->
      <header class="mb-14">
          <div class="flex items-center gap-3 mb-4">
            <span class="w-1.5 h-1.5 rounded-full bg-brand"></span>
            <span class="text-[11px] font-black uppercase tracking-[0.3em] text-zinc-400">Practice Area</span>
          </div>
          <h1 class="text-4xl md:text-5xl font-black text-zinc-900 dark:text-zinc-100 tracking-tight mb-4">Improve your scores.</h1>
          <p class="text-[16px] text-zinc-500 dark:text-zinc-500 max-w-xl leading-relaxed">
            Choose a subject to start a quick practice session. Your path to success starts with a single topic.
          </p>
      </header>

      <!-- FEATURED GRID -->
      <!-- Loading Skeleton -->
      <div v-if="quizStore.loading" class="space-y-16">
        <section>
          <BaseSkeleton width="120px" height="16px" customClass="mb-8" />
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <BaseSkeleton height="180px" customClass="!rounded-[28px]" v-for="i in 3" :key="i" />
          </div>
        </section>
        <section>
          <div class="flex justify-between mb-8">
            <BaseSkeleton width="150px" height="16px" />
            <BaseSkeleton width="100px" height="16px" />
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <BaseSkeleton height="280px" customClass="!rounded-[32px]" v-for="i in 3" :key="i" />
          </div>
        </section>
      </div>

      <div v-else class="space-y-16">
        <!-- RECENT ACTIVITY (IF ANY) -->
        <section v-if="recentSubmissions.length > 0">
           <h2 class="text-[12px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-8 px-1">Your Progress</h2>
           <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <NeoCard 
                v-for="sub in recentSubmissions.slice(0, 3)" 
                :key="sub._id"
                variant="depressed"
                class="p-6 group cursor-pointer hover:border-brand/30 transition-all"
                @click="router.push(`/quiz/${sub.quiz._id}`)"
              >
                <div class="flex items-start justify-between mb-6">
                  <div class="w-10 h-10 rounded-xl bg-brand/10 text-brand flex items-center justify-center">
                    <component :is="getIconComponent(sub.quiz?.title)" :size="20" :stroke-width="2" />
                  </div>
                  <div class="text-[13px] font-bold text-zinc-400">
                    {{ Math.round((sub.score / sub.totalQuestions) * 100) }}% <span class="text-[10px] font-black uppercase text-zinc-300 ml-1">Score</span>
                  </div>
                </div>
                <h3 class="text-[17px] font-bold text-zinc-800 dark:text-zinc-100 mb-1">{{ sub.quiz?.title }}</h3>
                <p class="text-[12px] text-zinc-500 dark:text-zinc-500 line-clamp-1 mb-4">Resume practice for {{ sub.quiz?.title }}.</p>
                <div class="flex items-center justify-between pt-4 border-t border-zinc-100 dark:border-zinc-800/50">
                    <span class="text-[11px] font-black uppercase tracking-widest text-zinc-400">Module active</span>
                    <span class="text-brand text-xs font-bold group-hover:translate-x-1 transition-transform flex items-center gap-1">
                      Resume
                      <ArrowRight :size="14" />
                    </span>
                </div>
              </NeoCard>
           </div>
        </section>

        <!-- CORE CURRICULUM -->
        <section>
          <div class="flex items-center justify-between mb-8 px-1">
            <h2 class="text-[12px] font-black uppercase tracking-[0.2em] text-zinc-400">Available Subjects</h2>
            <router-link to="/subjects" class="text-[11px] font-black uppercase tracking-widest text-brand hover:underline transition-all flex items-center gap-1">
              View All Modules
              <ArrowRight :size="12" />
            </router-link>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div 
              v-for="quiz in quizStore.quizzes.slice(0, 6)" 
              :key="quiz._id"
              class="group relative bg-[var(--neo-surface)] rounded-[32px] p-8 border border-zinc-200 dark:border-zinc-800 shadow-neo hover:shadow-neo-md transition-all duration-500 cursor-pointer overflow-hidden"
              @click="router.push(`/quiz/${quiz._id}`)"
            >
              <!-- Background Ambient Glow -->
              <div class="absolute -right-10 -top-10 w-32 h-32 bg-brand/5 rounded-full blur-3xl group-hover:bg-brand/10 transition-colors"></div>

              <div class="flex items-start justify-between mb-8 relative z-10">
                <div class="w-14 h-14 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <component :is="getIconComponent(quiz.title)" :size="28" :stroke-width="1.5" class="text-zinc-600 dark:text-zinc-400" />
                </div>
                <div class="px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-[10px] font-black uppercase tracking-widest text-zinc-400">
                  {{ quiz.questions?.length || 0 }} Items
                </div>
              </div>

              <h3 class="text-xl font-bold text-zinc-800 dark:text-zinc-100 mb-2 relative z-10">{{ quiz.title }}</h3>
              <p class="text-[14px] text-zinc-500 dark:text-zinc-500 mb-8 leading-relaxed line-clamp-2">{{ quiz.description || 'A clear set of questions based on your course.' }}</p>
              
              <div class="pt-6 border-t border-white/5 flex items-center justify-between relative z-10">
                <div class="text-[11px] font-black uppercase tracking-widest text-zinc-400 group-hover:text-brand transition-colors">
                  Ready to Practice
                </div>
                <div class="w-10 h-10 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-black flex items-center justify-center group-hover:translate-x-2 transition-all">
                  <ArrowRight :size="18" />
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
import { onMounted, computed, defineComponent, h } from 'vue';
import { useRouter } from 'vue-router';
import { 
  ArrowRight, 
  Calculator, 
  Book, 
  FlaskConical, 
  Leaf, 
  Beaker, 
  TrendingUp, 
  Landmark, 
  Library,
  GraduationCap
} from 'lucide-vue-next';
import { useQuizStore } from '../store/quiz';
import NeoAppShell from '../components/layout/NeoAppShell.vue';
import NeoCard from '../components/common/NeoCard.vue';
import BaseSkeleton from '../components/common/BaseSkeleton.vue';

const router = useRouter();
const quizStore = useQuizStore();

onMounted(() => {
  quizStore.fetchQuizzes();
  quizStore.fetchMySubmissions();
});

const recentSubmissions = computed(() => {
  return [...quizStore.mySubmissions].reverse();
});

const getIconComponent = (title) => {
  const name = (title || '').toLowerCase();
  if (name.includes('math')) return Calculator;
  if (name.includes('english')) return Book;
  if (name.includes('physic')) return FlaskConical;
  if (name.includes('biolog')) return Leaf;
  if (name.includes('chemist')) return Beaker;
  if (name.includes('econom')) return TrendingUp;
  if (name.includes('governm')) return Landmark;
  if (name.includes('jamb') || name.includes('waec')) return GraduationCap;
  return Library;
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
