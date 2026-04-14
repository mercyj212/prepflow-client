<template>
  <NeoAppShell>
    <!-- Simplified 2-column paradigm:
         Outer floating rail (NeoSidebarRail) -> Main Content -->
    <div class="h-full flex px-2 sm:px-4 lg:px-8 py-4 gap-8">
      
      <!-- Main Content Column -->
      <section class="flex-1 flex flex-col min-w-0 h-full overflow-y-auto pb-10 custom-scrollbar pr-4 pt-1">
        
        <header class="mb-12">
          <h1 class="text-2xl sm:text-3xl font-bold text-slate-400 dark:text-zinc-400 uppercase tracking-widest mb-2">Dashboard</h1>
          <p class="text-[15px] font-medium text-slate-500 dark:text-zinc-500">Your core workflows and study executions mapping.</p>
        </header>

        <NeoLoader v-if="quizStore.loading" label="Loading dashboard..." />

        <template v-else>
          <div class="flex flex-col lg:flex-row gap-12 lg:gap-16">
            
            <!-- Left Side / Stats -->
            <div class="flex-[1.2] min-w-0 flex flex-col gap-14">
               
               <!-- Massive Stat Card matching "Executions 340" -->
               <div>
                 <h2 class="text-[18px] font-normal text-slate-800 dark:text-zinc-100 mb-4 px-1">Progression</h2>
                 <NeoCard variant="extruded" :glass="true" class="!rounded-[28px] p-10 relative group">
                   
                   <!-- The "+204%" glowing pill -->
                   <div class="absolute right-8 top-[4.5rem]">
                      <div class="px-2.5 py-1.5 rounded-lg border border-emerald-500/20 shadow-neo-inner bg-emerald-50/10 dark:bg-emerald-900/10 flex items-center justify-center">
                       <span class="text-[12px] font-bold text-[#4ade80] drop-shadow-[0_0_8px_rgba(74,222,128,0.6)] tracking-wide">
                         ↑ 12%
                       </span>
                     </div>
                   </div>

                   <h3 class="text-[15px] font-medium text-slate-600 dark:text-zinc-300 mb-2">Questions Passed</h3>
                   <div class="flex items-end gap-6 mb-10">
                     <div class="text-[6rem] font-light leading-[1] tracking-tighter text-[#1f2937] dark:text-zinc-100 -ml-1">{{ totalQuestionsDone }}</div>
                   </div>
                   
                   <button class="text-[14px] font-medium text-slate-700 dark:text-zinc-200 hover:text-slate-900 transition-colors flex items-center gap-2 group-hover:gap-3">
                     See Report <span class="text-xl">→</span>
                   </button>
                 </NeoCard>
               </div>

               <!-- Lower Metric Area -->
               <div class="flex flex-col gap-6">
                 <h2 class="text-[18px] font-normal text-slate-800 dark:text-zinc-100 mb-2 px-1">Metrics</h2>
                 
                 <!-- Underline Tabs -->
                 <div class="flex items-center gap-8 border-b border-slate-300/60 dark:border-zinc-800 pb-[10px] mb-2 px-2">
                    <button class="text-[14px] font-medium text-slate-800 dark:text-zinc-100 relative">
                      Workflow
                      <span class="absolute -bottom-[11px] left-0 w-full h-[3px] bg-slate-800 dark:bg-zinc-300 rounded-t-full shadow-sm"></span>
                    </button>
                    <button class="text-[14px] font-medium text-slate-400 hover:text-slate-600 transition-colors">Permissions</button>
                    <button class="text-[14px] font-medium text-slate-400 hover:text-slate-600 transition-colors">Execution</button>
                 </div>

                 <!-- Metric details using inner depressed cards to match Search bar depth -->
                 <div class="flex flex-col sm:flex-row items-center gap-6 mt-4 w-full">
                   <div class="flex-1 flex flex-col gap-2 w-full">
                     <span class="text-[12px] font-bold uppercase tracking-widest text-slate-400 px-2">Average Score</span>
                     <NeoCard variant="depressed" class="!rounded-[18px] flex flex-col p-5 border-[0.5px] border-black/5 dark:border-white/5">
                        <span class="text-3xl font-medium text-slate-800 dark:text-zinc-200">{{ averageScore }}%</span>
                     </NeoCard>
                   </div>
                   
                   <div class="flex-1 flex flex-col gap-2 w-full">
                     <span class="text-[12px] font-bold uppercase tracking-widest text-slate-400 px-2">Learning Streak</span>
                     <NeoCard variant="depressed" class="!rounded-[18px] flex flex-col p-5 border-[0.5px] border-black/5 dark:border-white/5">
                        <span class="text-3xl font-medium text-slate-800 dark:text-zinc-200">{{ streakDays }} <span class="text-lg text-slate-400 font-normal">days</span></span>
                     </NeoCard>
                   </div>
                 </div>

               </div>
            </div>

            <!-- Right Side / Deep Card Details -->
            <div class="flex-[1] min-w-0 flex flex-col gap-4">
               
               <NeoCard variant="depressed" class="!rounded-[18px] mb-2 p-[10px] border-[0.5px] border-black/5 dark:border-white/5">
                 <div class="flex items-center gap-2 w-full h-full">
                   <span class="text-slate-400 ml-1 text-lg leading-none pt-0.5">⌕</span>
                   <input type="text" placeholder="Search modules..." class="bg-transparent border-none outline-none text-[13px] text-slate-700 dark:text-zinc-300 w-full placeholder:text-slate-400 placeholder:font-normal focus:ring-0" />
                 </div>
               </NeoCard>
               
               <!-- Main Inset Context Card mimicking the blank area at bottom right of image -->
               <div class="flex-1 min-h-[400px] rounded-[32px] bg-slate-50 border border-slate-200 dark:bg-zinc-800/30 dark:border-white/5 shadow-inner p-6 flex flex-col overflow-hidden relative">
                   <div class="absolute top-4 left-4 w-3 h-3 border-t border-l border-slate-300"></div>
                   <div class="absolute bottom-4 left-4 w-3 h-3 border-b border-l border-slate-300"></div>
                   <div class="absolute top-4 right-4 w-3 h-3 border-t border-r border-slate-300"></div>
                   <div class="absolute bottom-4 right-4 w-3 h-3 border-b border-r border-slate-300"></div>

                   <h3 class="text-[13px] font-medium text-slate-500 mb-6 px-2 text-center uppercase tracking-widest">Recent Executions</h3>
                 
                   <div v-if="quizStore.mySubmissions.length === 0" class="flex-1 flex flex-col items-center justify-center opacity-50 text-center px-8">
                     <span class="text-4xl mb-4">📭</span>
                     <p class="text-[13px] font-medium text-slate-500">Where data intersects with your interactions.</p>
                   </div>
                   
                   <div v-else class="flex flex-col gap-3 relative z-10 w-full max-w-[340px] mx-auto overflow-y-auto custom-scrollbar pr-2">
                       <NeoCard v-for="(sub, i) in quizStore.mySubmissions.slice(0, 5)" :key="i"
                          variant="extruded" 
                          class="!rounded-2xl p-4 flex items-center justify-between cursor-pointer hover:bg-slate-100 dark:hover:bg-zinc-800/80 transition-colors border border-white/40 dark:border-white/5 group"
                          @click="openSubmission(sub)"
                        >
                           <div class="flex items-center gap-3">
                              <div class="w-8 h-8 rounded-full bg-slate-200 dark:bg-zinc-900 flex items-center justify-center text-sm shadow-inner group-hover:scale-110 transition-transform">
                                📋
                              </div>
                              <div class="flex flex-col">
                                <span class="text-[13px] font-medium text-slate-800 dark:text-zinc-200">{{ sub.quiz?.title || 'Unknown Test' }}</span>
                                <span class="text-[10px] font-medium text-slate-400 mt-0.5">{{ formatDate(sub.createdAt) }}</span>
                              </div>
                           </div>
                           <div class="px-2.5 py-1 rounded border border-black/5 dark:border-white/10 text-[10px] font-bold text-slate-600 bg-black/5 dark:bg-white/5 shadow-inner">
                             {{ sub.score }}/{{ sub.totalQuestions }}
                           </div>
                       </NeoCard>
                   </div>
               </div>

            </div>
          </div>
        </template>
      </section>
    </div>
  </NeoAppShell>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useAuthStore } from '../store/auth';
import { useQuizStore } from '../store/quiz';
import { useRouter } from 'vue-router';
import NeoAppShell from '../components/layout/NeoAppShell.vue';
import NeoLoader from '../components/common/NeoLoader.vue';
import NeoCard from '../components/common/NeoCard.vue';

const authStore = useAuthStore();
const quizStore = useQuizStore();
const router = useRouter();

const user = computed(() => authStore.user);

const totalQuestionsDone = computed(() => {
  return quizStore.mySubmissions.reduce((acc, sub) => acc + (sub.totalQuestions || 0), 0);
});

const averageScore = computed(() => {
  if (quizStore.mySubmissions.length === 0) return 0;
  const totalPercentage = quizStore.mySubmissions.reduce((acc, sub) => {
    return acc + ((sub.score / sub.totalQuestions) * 100);
  }, 0);
  return Math.round(totalPercentage / quizStore.mySubmissions.length);
});

const streakDays = computed(() => {
  const uniqueDays = new Set(
    quizStore.mySubmissions.map((sub) => new Date(sub.createdAt).toDateString())
  );
  return uniqueDays.size;
});

const subjects = computed(() => {
  return quizStore.quizzes.map((quiz) => {
    return {
      id: quiz._id,
      quizId: quiz._id,
      name: quiz.title || 'Untitled subject',
    };
  });
});

onMounted(() => {
  quizStore.fetchQuizzes();
  quizStore.fetchMySubmissions();
});

const formatDate = (value) => {
  if (!value) return 'Unknown date';
  return new Date(value).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' });
};

const openSubmission = (submission) => {
  router.push({
    path: '/result',
    query: {
      score: submission.score ?? 0,
      total: submission.totalQuestions ?? 0,
      quizId: submission.quiz?._id || submission.quizId || ''
    }
  });
};
</script>
