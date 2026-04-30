<template>
  <NeoAppShell>
    <!-- Simplified 2-column paradigm -->
    <div class="h-full flex px-2 sm:px-4 lg:px-8 py-4 gap-4 md:gap-8">
      
      <!-- Main Content Column -->
      <section class="flex-1 flex flex-col min-w-0 h-full overflow-y-auto pb-10 custom-scrollbar pr-4 pt-1">
        
        <header class="mb-12">
          <h1 class="text-2xl sm:text-3xl font-bold text-zinc-400 dark:text-zinc-400 uppercase tracking-widest mb-2">Dashboard</h1>
          <p class="text-[15px] font-medium text-zinc-500 dark:text-zinc-500">A summary of your recent study history and progress.</p>
        </header>

        <div v-if="loading" class="flex flex-col lg:flex-row gap-12 lg:gap-16">
            <!-- Left Side / Stats Skeleton -->
            <div class="flex-[1.2] min-w-0 flex flex-col gap-14">
                <div>
                    <BaseSkeleton height="24px" width="120px" customClass="mb-4" />
                    <BaseSkeleton height="280px" customClass="!rounded-[28px]" />
                </div>
                <div class="flex flex-col gap-6">
                    <BaseSkeleton height="24px" width="100px" />
                    <div class="flex gap-8 border-b border-zinc-800 pb-[10px]">
                        <BaseSkeleton height="14px" width="60px" />
                        <BaseSkeleton height="14px" width="60px" />
                        <BaseSkeleton height="14px" width="60px" />
                    </div>
                    <div class="flex gap-6 mt-4">
                        <BaseSkeleton height="100px" customClass="flex-1 !rounded-[18px]" />
                        <BaseSkeleton height="100px" customClass="flex-1 !rounded-[18px]" />
                    </div>
                </div>
            </div>

            <!-- Right Side Skeleton -->
            <div class="flex-[1] min-w-0 flex flex-col gap-4">
                <BaseSkeleton height="45px" customClass="!rounded-[18px]" />
                <BaseSkeleton height="400px" customClass="!rounded-[32px]" />
            </div>
        </div>

        <template v-else>
          <div class="flex flex-col lg:flex-row gap-12 lg:gap-16">
            
            <!-- Left Side / Stats -->
            <div class="flex-[1.2] min-w-0 flex flex-col gap-14">
               
               <!-- Massive Stat Card -->
               <div>
                 <h2 class="text-[18px] font-normal text-zinc-800 dark:text-zinc-100 mb-4 px-1">My Progress</h2>
                 <NeoCard variant="extruded" :glass="true" class="!rounded-[28px] p-6 sm:p-10 relative group">
                   
                   <!-- The "+204%" glowing pill -->
                   <div class="absolute right-8 top-[4.5rem]">
                      <div class="px-2.5 py-1.5 rounded-lg border shadow-neo-inner flex items-center justify-center" :class="progressDeltaClass">
                       <span class="text-[12px] font-bold tracking-wide">
                         {{ progressDeltaLabel }}
                       </span>
                     </div>
                   </div>

                   <h3 class="text-[15px] font-medium text-zinc-600 dark:text-zinc-300 mb-2">Questions Passed</h3>
                   <div class="flex items-end gap-6 mb-10">
                     <div class="text-[clamp(4rem,15vw,6rem)] font-light leading-[1] tracking-tighter text-[#1f2937] dark:text-zinc-100 -ml-1">{{ totalQuestionsDone }}</div>
                   </div>
                   
                   <router-link to="/progress" class="text-[14px] font-medium text-zinc-700 dark:text-zinc-200 hover:text-zinc-900 transition-colors flex items-center gap-2 group-hover:gap-3">
                     See Report <ArrowRight :size="18" :stroke-width="2" class="transition-transform group-hover:translate-x-1" />
                   </router-link>
                 </NeoCard>
               </div>

               <!-- Lower Metric Area -->
               <div class="flex flex-col gap-6">
                 <h2 class="text-[18px] font-normal text-zinc-800 dark:text-zinc-100 mb-2 px-1">Metrics</h2>
                 
                 <!-- Underline Tabs -->
                 <div class="flex items-center gap-8 border-b border-zinc-300/60 dark:border-zinc-800 pb-[10px] mb-2 px-2">
                    <button @click="currentTab = 'progress'" :class="[currentTab === 'progress' ? 'text-zinc-800 dark:text-zinc-100' : 'text-zinc-400 hover:text-zinc-600']" class="text-[14px] font-medium relative transition-colors">
                      Progress
                      <span v-if="currentTab === 'progress'" class="absolute -bottom-[11px] left-0 w-full h-[3px] bg-zinc-800 dark:bg-zinc-300 rounded-t-full shadow-sm"></span>
                    </button>
                    <button @click="currentTab = 'details'" :class="[currentTab === 'details' ? 'text-zinc-800 dark:text-zinc-100' : 'text-zinc-400 hover:text-zinc-600']" class="text-[14px] font-medium relative transition-colors">
                      Details
                      <span v-if="currentTab === 'details'" class="absolute -bottom-[11px] left-0 w-full h-[3px] bg-zinc-800 dark:bg-zinc-300 rounded-t-full shadow-sm"></span>
                    </button>
                    <button @click="currentTab = 'history'" :class="[currentTab === 'history' ? 'text-zinc-800 dark:text-zinc-100' : 'text-zinc-400 hover:text-zinc-600']" class="text-[14px] font-medium relative transition-colors">
                      History
                      <span v-if="currentTab === 'history'" class="absolute -bottom-[11px] left-0 w-full h-[3px] bg-zinc-800 dark:bg-zinc-300 rounded-t-full shadow-sm"></span>
                    </button>
                 </div>

                 <!-- Metric details -->
                 <div v-if="currentTab === 'progress'" class="flex flex-col sm:flex-row items-center gap-6 mt-4 w-full animate-fade-in">
                   <div class="flex-1 flex flex-col gap-2 w-full">
                     <span class="text-[12px] font-bold uppercase tracking-widest text-zinc-400 px-2">Average Score</span>
                     <NeoCard variant="depressed" class="!rounded-[18px] flex flex-col p-5 border-[0.5px] border-black/5 dark:border-white/5">
                        <span class="text-3xl font-medium text-zinc-800 dark:text-zinc-200">{{ averageScore }}%</span>
                     </NeoCard>
                   </div>
                   


                   <div class="flex-1 flex flex-col gap-2 w-full">
                     <span class="text-[12px] font-bold uppercase tracking-widest text-zinc-400 px-2">Learning Streak</span>
                     <NeoCard variant="depressed" class="!rounded-[18px] flex flex-col p-5 border-[0.5px] border-black/5 dark:border-white/5">
                        <span class="text-3xl font-medium text-zinc-800 dark:text-zinc-200">{{ streakDays }} <span class="text-lg text-zinc-400 font-normal">days</span></span>
                     </NeoCard>
                   </div>
                 </div>

                 <!-- Details View -->
                 <div v-else-if="currentTab === 'details'" class="mt-4 w-full animate-fade-in">
                   <NeoCard variant="depressed" class="!rounded-[20px] p-6 border-[0.5px] border-black/5 dark:border-white/5">
                     <div class="space-y-4">
                       <div class="flex justify-between items-center text-[13px]">
                         <span class="text-zinc-500">Total Sessions</span>
                         <span class="font-bold text-zinc-800 dark:text-zinc-200">{{ quizStore.mySubmissions.length }}</span>
                       </div>
                       <div class="flex justify-between items-center text-[13px]">
                         <span class="text-zinc-500">Active Subjects</span>
                         <span class="font-bold text-zinc-800 dark:text-zinc-200">{{ subjects.length }}</span>
                       </div>
                       <div class="flex justify-between items-center text-[13px]">
                         <span class="text-zinc-500">Member Since</span>
                         <span class="font-bold text-zinc-800 dark:text-zinc-200">{{ formatDate(authStore.user?.createdAt) }}</span>
                       </div>
                     </div>
                   </NeoCard>
                 </div>

                 <!-- History View -->
                 <div v-else-if="currentTab === 'history'" class="mt-4 w-full animate-fade-in h-[140px] overflow-y-auto custom-scrollbar pr-2">
                   <div v-if="quizStore.mySubmissions.length === 0" class="text-center py-10 opacity-40 text-xs uppercase tracking-widest">No history found</div>
                   <div v-else class="space-y-3">
                     <div v-for="(sub, i) in quizStore.mySubmissions" :key="i" 
                          class="flex items-center justify-between p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/30 border border-zinc-100 dark:border-white/5 cursor-pointer hover:bg-zinc-200/60 dark:hover:bg-zinc-800/80 transition-all group/item shadow-sm"
                          @click="openSubmission(sub)">
                       <div class="flex flex-col">
                         <span class="text-[12px] font-bold text-zinc-500 dark:text-zinc-400 group-hover/item:text-zinc-900 dark:group-hover/item:text-white transition-colors truncate max-w-[140px]">{{ sub.quiz?.title || 'Practice' }}</span>
                         <span class="text-[9px] text-zinc-400 uppercase tracking-widest">{{ formatDate(sub.createdAt) }}</span>
                       </div>
                       <span class="text-[11px] font-black text-zinc-500 dark:text-zinc-400 bg-white/80 dark:bg-zinc-900 px-2.5 py-1 rounded shadow-sm border border-black/5 dark:border-white/5">{{ sub.score }}/{{ sub.totalQuestions }}</span>
                     </div>
                   </div>
                 </div>
               </div>
            </div>

            <!-- Right Side / Deep Card Details -->
            <div class="flex-[1] min-w-0 flex flex-col gap-4">
               
               <NeoCard variant="depressed" class="!rounded-[18px] mb-2 p-[10px] border-[0.5px] border-black/5 dark:border-white/5">
                 <div class="flex items-center gap-2 w-full h-full">
                   <Search :size="18" :stroke-width="1.5" class="text-zinc-400 ml-1 shrink-0" />
                   <input type="text" placeholder="Search courses..." class="bg-transparent border-none outline-none text-[13px] text-zinc-700 dark:text-zinc-300 w-full placeholder:text-zinc-400 placeholder:font-normal focus:ring-0" />
                 </div>
               </NeoCard>
               
               <!-- Main Inset Context Card -->
               <div class="flex-1 min-h-[400px] rounded-[32px] bg-zinc-50 border border-zinc-200 dark:bg-zinc-800/30 dark:border-white/5 shadow-inner p-6 flex flex-col overflow-hidden relative">
                   <div class="absolute top-4 left-4 w-3 h-3 border-t border-l border-zinc-300"></div>
                   <div class="absolute bottom-4 left-4 w-3 h-3 border-b border-l border-zinc-300"></div>
                   <div class="absolute top-4 right-4 w-3 h-3 border-t border-r border-zinc-300"></div>
                   <div class="absolute bottom-4 right-4 w-3 h-3 border-b border-r border-zinc-300"></div>

                   <h3 class="text-[13px] font-medium text-zinc-500 mb-6 px-2 text-center uppercase tracking-widest">Recent Practice Sessions</h3>
                 
                   <div v-if="quizStore.mySubmissions.length === 0" class="flex-1 flex flex-col items-center justify-center opacity-50 text-center px-8">
                     <Inbox :size="48" :stroke-width="1" class="text-zinc-300 mb-4" />
                     <p class="text-[13px] font-medium text-zinc-500">Where your hard work shows up.</p>
                   </div>
                   
                   <div v-else class="flex flex-col gap-3 relative z-10 w-full max-w-[340px] mx-auto overflow-y-auto custom-scrollbar pr-2">
                       <NeoCard v-for="(sub, i) in quizStore.mySubmissions.slice(0, 5)" :key="i"
                          variant="extruded" 
                          class="!rounded-2xl p-4 flex items-center justify-between cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800/80 transition-colors border border-white/40 dark:border-white/5 group"
                          @click="openSubmission(sub)"
                        >
                           <div class="flex items-center gap-2 md:gap-3 min-w-0">
                               <div class="w-7 h-7 md:w-8 md:h-8 rounded-full bg-zinc-200 dark:bg-zinc-900 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform shrink-0">
                                 <FileText :size="14" md:size="16" :stroke-width="1.5" class="text-zinc-500 dark:text-zinc-400" />
                               </div>
                               <div class="flex flex-col min-w-0">
                                 <span class="text-[12px] md:text-[13px] font-medium text-zinc-800 dark:text-zinc-200 truncate">{{ sub.quiz?.title || 'Unknown Test' }}</span>
                                 <span class="text-[9px] md:text-[10px] font-medium text-zinc-400 mt-0.5">{{ formatDate(sub.createdAt) }}</span>
                               </div>
                            </div>
                            <div class="px-2 py-0.5 md:px-2.5 md:py-1 rounded border border-black/5 dark:border-white/10 text-[9px] md:text-[10px] font-bold text-zinc-600 bg-black/5 dark:bg-white/5 shadow-inner shrink-0">
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
import { 
  ref, 
  computed, 
  onMounted 
} from 'vue';
import { 
  ArrowRight, 
  Search, 
  Inbox, 
  FileText 
} from 'lucide-vue-next';
import { useAuthStore } from '../store/auth';
import { useQuizStore } from '../store/quiz';
import { useRouter } from 'vue-router';
import NeoAppShell from '../components/layout/NeoAppShell.vue';
import NeoCard from '../components/common/NeoCard.vue';
import BaseSkeleton from '../components/common/BaseSkeleton.vue';

const authStore = useAuthStore();
const quizStore = useQuizStore();
const router = useRouter();

const loading = ref(true);
const currentTab = ref('progress');

const user = computed(() => authStore.user);

const totalQuestionsDone = computed(() => {
  return quizStore.mySubmissions.reduce((acc, sub) => acc + (sub.totalQuestions || 0), 0);
});

const sortedSubmissions = computed(() => {
  return [...quizStore.mySubmissions].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
});

const getSubmissionPercent = (submission) => {
  if (!submission?.totalQuestions) return 0;
  return Math.round((submission.score / submission.totalQuestions) * 100);
};

const progressDelta = computed(() => {
  if (sortedSubmissions.value.length < 2) return 0;
  const latest = sortedSubmissions.value[sortedSubmissions.value.length - 1];
  const previous = sortedSubmissions.value[sortedSubmissions.value.length - 2];
  return getSubmissionPercent(latest) - getSubmissionPercent(previous);
});

const progressDeltaLabel = computed(() => {
  if (sortedSubmissions.value.length < 2) return '0%';
  if (progressDelta.value > 0) return `↑ ${progressDelta.value}%`;
  if (progressDelta.value < 0) return `↓ ${Math.abs(progressDelta.value)}%`;
  return '0%';
});

const progressDeltaClass = computed(() => {
  if (progressDelta.value > 0) return 'border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400';
  if (progressDelta.value < 0) return 'border-rose-500/20 bg-rose-500/10 text-rose-600 dark:text-rose-400';
  return 'border-zinc-300 bg-zinc-100 text-zinc-700 dark:border-white/10 dark:bg-zinc-800 dark:text-zinc-200';
});

const averageScore = computed(() => {
  if (quizStore.mySubmissions.length === 0) return 0;
  const totalPercentage = quizStore.mySubmissions.reduce((acc, sub) => {
    return acc + ((sub.score / sub.totalQuestions) * 100);
  }, 0);
  return Math.round(totalPercentage / quizStore.mySubmissions.length);
});

const streakDays = computed(() => {
  if (!quizStore.mySubmissions.length) return 0;
  
  const uniqueDays = [...new Set(
    quizStore.mySubmissions.map(sub => new Date(sub.createdAt).toISOString().split('T')[0])
  )].sort((a, b) => b.localeCompare(a));

  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

  if (uniqueDays[0] !== today && uniqueDays[0] !== yesterday) return 0;

  let streak = 0;
  let currentCheck = new Date(uniqueDays[0]);

  for (const dayStr of uniqueDays) {
    const day = new Date(dayStr);
    const diff = Math.floor((currentCheck - day) / (1000 * 60 * 60 * 24));
    
    if (diff <= 1) {
      streak++;
      currentCheck = day;
    } else {
      break;
    }
  }

  return streak;
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

onMounted(async () => {
  loading.value = true;
  await Promise.all([
    quizStore.fetchQuizzes(),
    quizStore.fetchMySubmissions(),
    new Promise(resolve => setTimeout(resolve, 400)) // Artificial delay for visual stability
  ]);
  loading.value = false;
});

const formatDate = (value) => {
  if (!value) return 'Unknown date';
  return new Date(value).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' });
};

const openSubmission = (submission) => {
  router.push({
    path: '/result',
    query: {
      submissionId: submission._id || '',
      score: submission.score ?? 0,
      total: submission.totalQuestions ?? 0,
      quizId: submission.quiz?._id || submission.quizId || ''
    }
  });
};
</script>
