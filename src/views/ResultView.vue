<template>
  <NeoAppShell>
    <div class="h-full flex px-2 sm:px-4 lg:px-8 py-4 gap-8">
      
      <!-- Main Content Column -->
      <section class="flex-1 flex flex-col min-w-0 h-full overflow-y-auto pb-10 custom-scrollbar pr-4 pt-1">
        
        <header class="mb-12">
          <div class="flex items-center gap-3 mb-2">
            <span class="text-[10px] font-black uppercase tracking-[0.3em] text-brand bg-brand/10 px-3 py-1 rounded-lg">Analysis Mode</span>
            <span class="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Session #{{ sessionDisplayId }}</span>
          </div>
          <h1 class="text-2xl sm:text-3xl font-bold text-zinc-800 dark:text-zinc-100 uppercase tracking-widest">{{ result?.quizTitle || 'Practice' }} Results</h1>
          <p class="text-[15px] font-medium text-zinc-500 dark:text-zinc-500 mt-2">A high-fidelity breakdown of your performance and academic rationales.</p>
        </header>

        <div v-if="loading && !result" class="flex-1 flex flex-col items-center justify-center py-20 gap-6">
          <NeoLoader color="#14b8a6" size="large" />
          <p class="text-[11px] font-black uppercase tracking-widest text-zinc-400">Syncing Intelligence Data...</p>
        </div>

        <template v-else>
          <div class="flex flex-col xl:flex-row gap-12 lg:gap-16">
            
            <!-- Left Side: Hero Score & Metrics -->
            <div class="flex-[1.2] min-w-0 flex flex-col gap-14">
              
              <!-- Core Score Card (Dashboard Style) -->
              <div>
                <h2 class="text-[18px] font-normal text-zinc-800 dark:text-zinc-100 mb-4 px-1">Performance Overview</h2>
                <NeoCard variant="extruded" :glass="true" class="!rounded-[28px] p-10 relative group overflow-hidden">
                  <div class="absolute inset-0 bg-gradient-to-br from-brand/5 via-transparent to-transparent"></div>
                  
                  <div class="flex flex-col md:flex-row items-center gap-12 relative z-10">
                    <!-- Circular Performance Ring (Premium) -->
                    <div class="relative w-48 h-48 flex items-center justify-center shrink-0">
                      <svg class="absolute inset-0 w-full h-full -rotate-90">
                        <circle class="text-zinc-200 dark:text-zinc-800" stroke-width="6" stroke="currentColor" fill="transparent" r="88" cx="96" cy="96" />
                        <circle 
                          :class="percentage >= 70 ? 'text-brand' : (percentage >= 40 ? 'text-amber-500' : 'text-rose-500')" 
                          stroke-width="6" 
                          :stroke-dasharray="CIRCUMFERENCE" 
                          :stroke-dashoffset="dashOffset" 
                          stroke-linecap="round" 
                          stroke="currentColor" 
                          fill="transparent" 
                          r="88" cx="96" cy="96" 
                          class="transition-all duration-[2000ms] ease-out-expo drop-shadow-[0_0_8px_rgba(20,184,166,0.3)]"
                        />
                      </svg>
                      <div class="text-center">
                        <p class="text-5xl font-light tracking-tighter text-zinc-800 dark:text-zinc-100">{{ percentage }}<span class="text-xl opacity-30">%</span></p>
                      </div>
                    </div>

                    <div class="flex-1 text-center md:text-left">
                      <div class="px-3 py-1.5 rounded-lg border border-brand/20 bg-brand/5 inline-flex items-center justify-center mb-6">
                        <span class="text-[11px] font-black text-brand uppercase tracking-widest">{{ scoreStatus }}</span>
                      </div>
                      <h3 class="text-4xl font-light tracking-tighter text-zinc-800 dark:text-zinc-100 mb-2">
                        {{ displayScore }} <span class="text-2xl text-zinc-400">/ {{ displayTotal }} Correct</span>
                      </h3>
                      <p class="text-[13px] font-medium text-zinc-500 leading-relaxed max-w-sm">
                        Great work on this session. You've demonstrated consistent mastery in core concepts. Check the Intelligence Log below for deeper insights.
                      </p>
                    </div>
                  </div>
                </NeoCard>
              </div>

              <!-- Metric Area (Dashboard Tab Pattern) -->
              <div class="flex flex-col gap-6">
                <div class="flex items-center justify-between px-1">
                  <h2 class="text-[18px] font-normal text-zinc-800 dark:text-zinc-100">Session Metrics</h2>
                  <div v-if="!result" class="flex items-center gap-2">
                    <AlertCircle :size="14" class="text-amber-500" />
                    <span class="text-[10px] font-bold text-amber-500 uppercase tracking-widest">Offline Mode</span>
                  </div>
                </div>
                
                <div class="flex items-center gap-8 border-b border-zinc-300/60 dark:border-zinc-800 pb-[10px] mb-2 px-2">
                   <button @click="currentTab = 'log'" :class="[currentTab === 'log' ? 'text-zinc-800 dark:text-zinc-100' : 'text-zinc-400 hover:text-zinc-600']" class="text-[14px] font-medium relative transition-colors">
                     Intelligence Log
                     <span v-if="currentTab === 'log'" class="absolute -bottom-[11px] left-0 w-full h-[3px] bg-brand rounded-t-full shadow-sm"></span>
                   </button>
                   <button @click="currentTab = 'weakness'" :class="[currentTab === 'weakness' ? 'text-zinc-800 dark:text-zinc-100' : 'text-zinc-400 hover:text-zinc-600']" class="text-[14px] font-medium relative transition-colors">
                     Weak Areas
                     <span v-if="currentTab === 'weakness'" class="absolute -bottom-[11px] left-0 w-full h-[3px] bg-brand rounded-t-full shadow-sm"></span>
                   </button>
                </div>

                <!-- Tab Content: Log -->
                <div v-if="currentTab === 'log'" class="space-y-6 mt-4 animate-in fade-in duration-700">
                  <div v-if="result && result.questionResults" class="space-y-6">
                    <NeoCard v-for="(q, idx) in result.questionResults" :key="idx" variant="depressed" class="!rounded-[24px] p-8 border-[0.5px] border-black/5 dark:border-white/5 group hover:border-brand/20 transition-colors">
                      <div class="flex gap-6">
                        <div class="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 font-black text-[12px] shadow-sm tracking-tighter transition-all"
                          :class="q.isCorrect ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-500 border border-rose-500/20'">
                          {{ idx + 1 }}
                        </div>
                        <div class="flex-1 space-y-6">
                          <p class="text-[17px] font-bold text-zinc-800 dark:text-zinc-100 leading-tight">{{ q.questionText }}</p>
                          
                          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div class="p-4 rounded-xl bg-zinc-50 dark:bg-black/20 border border-white/40 dark:border-white/5">
                              <p class="text-[9px] font-black uppercase tracking-widest text-zinc-400 mb-2">Selection</p>
                              <p class="text-[13px] font-bold" :class="q.isCorrect ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'">{{ q.yourAnswer }}</p>
                            </div>
                            <div v-if="!q.isCorrect" class="p-4 rounded-xl bg-emerald-50/30 dark:bg-emerald-500/5 border border-emerald-500/10">
                              <p class="text-[9px] font-black uppercase tracking-widest text-emerald-500/60 mb-2">Correct Response</p>
                              <p class="text-[13px] font-bold text-emerald-600 dark:text-emerald-400">{{ q.correctAnswer }}</p>
                            </div>
                            <!-- Subject Tag -->
                            <div class="px-3 py-1 bg-zinc-100 dark:bg-white/5 rounded-lg border border-black/5 dark:border-white/5 flex items-center justify-center sm:justify-start">
                              <span class="text-[9px] font-black uppercase tracking-widest text-zinc-400">{{ q.subject }}</span>
                            </div>
                          </div>

                          <div v-if="q.explanation" class="pt-4 border-t border-zinc-100 dark:border-white/5">
                            <h4 class="text-[10px] font-black uppercase tracking-widest text-brand mb-2 italic">Academic Rationale</h4>
                            <p class="text-[14px] font-medium text-zinc-600 dark:text-zinc-400 leading-relaxed italic">"{{ q.explanation }}"</p>
                          </div>
                        </div>
                      </div>
                    </NeoCard>
                  </div>
                  <div v-else class="text-center py-20 opacity-40">
                    <p class="text-[11px] font-black uppercase tracking-[0.3em]">No detailed log available</p>
                    <button @click="loadResult" class="mt-4 text-[10px] font-black text-brand uppercase underline">Retry Sync</button>
                  </div>
                </div>

                <!-- Tab Content: Weakness -->
                <div v-else-if="currentTab === 'weakness'" class="mt-4 animate-in fade-in duration-700 space-y-4">
                  <div class="mb-8 px-1">
                    <h3 class="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 mb-2">{{ result?.analysisLabel || 'Course Analysis' }}</h3>
                    <p class="text-sm text-zinc-500 font-medium tracking-tight">Focus your studies on the areas with the lowest proficiency scores below.</p>
                  </div>
                  
                  <div v-if="result && result.subjectAnalysis && result.subjectAnalysis.length > 0" class="space-y-3">
                    <NeoCard v-for="item in result.subjectAnalysis" :key="item.subject" variant="depressed" class="!rounded-[24px] p-6 border-[0.5px] border-black/5 dark:border-white/5">
                      <div class="flex flex-col gap-4">
                        <div class="flex items-center justify-between">
                          <div class="flex items-center gap-3">
                            <div class="w-8 h-8 rounded-xl bg-brand/10 flex items-center justify-center">
                              <Zap :size="14" class="text-brand" />
                            </div>
                            <span class="text-[14px] font-bold text-zinc-800 dark:text-zinc-100 uppercase tracking-tight">{{ item.subject }}</span>
                          </div>
                          <span class="text-[12px] font-black" :class="item.percentage >= 70 ? 'text-emerald-500' : (item.percentage >= 40 ? 'text-amber-500' : 'text-rose-500')">
                            {{ item.correct }} / {{ item.total }} <span class="opacity-40 ml-1">{{ item.percentage }}%</span>
                          </span>
                        </div>
                        
                        <!-- Mini Brutalist Progress Bar -->
                        <div class="h-3 w-full bg-zinc-100 dark:bg-zinc-900 rounded-full overflow-hidden border border-black/5 dark:border-white/5 p-[2px]">
                          <div 
                            class="h-full rounded-full transition-all duration-[1.5s] ease-out-expo"
                            :class="item.percentage >= 70 ? 'bg-emerald-500' : (item.percentage >= 40 ? 'bg-amber-500' : 'bg-rose-500')"
                            :style="{ width: `${item.percentage}%` }"
                          ></div>
                        </div>

                        <div v-if="item.percentage < 50" class="flex items-center gap-2 mt-1">
                          <AlertCircle :size="12" class="text-rose-500" />
                          <span class="text-[9px] font-black text-rose-500 uppercase tracking-widest">Priority Study Recommended</span>
                        </div>
                      </div>
                    </NeoCard>
                  </div>
                  <div v-else class="text-center py-20 opacity-40">
                    <div class="w-16 h-16 bg-brand/10 text-brand rounded-3xl flex items-center justify-center mx-auto mb-6">
                      <Zap :size="24" :stroke-width="3" />
                    </div>
                    <p class="text-[11px] font-black uppercase tracking-[0.3em]">No categorical data present</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Right Side / Meta Column -->
            <div class="flex-[0.8] min-w-0 flex flex-col gap-8">
               
               <div>
                 <h2 class="text-[18px] font-normal text-zinc-800 dark:text-zinc-100 mb-4 px-1">Session Data</h2>
                 <div class="rounded-[32px] bg-zinc-50 border border-zinc-200 dark:bg-zinc-800/30 dark:border-white/5 shadow-inner p-8 flex flex-col relative overflow-hidden">
                    <div class="absolute top-4 left-4 w-3 h-3 border-t border-l border-zinc-300"></div>
                    <div class="absolute bottom-4 left-4 w-3 h-3 border-b border-l border-zinc-300"></div>
                    <div class="absolute top-4 right-4 w-3 h-3 border-t border-r border-zinc-300"></div>
                    <div class="absolute bottom-4 right-4 w-3 h-3 border-b border-r border-zinc-300"></div>

                    <div class="space-y-10 relative z-10">
                      <div>
                        <p class="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-3">Time Efficiency</p>
                        <p class="text-4xl font-light tracking-tighter text-zinc-800 dark:text-zinc-100">{{ displayTime }}</p>
                      </div>
                      
                      <div>
                        <p class="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-3">Mastery Rank</p>
                        <p class="text-4xl font-light tracking-tighter" :class="percentage >= 70 ? 'text-brand' : 'text-zinc-400'">
                          {{ percentage >= 85 ? 'ELITE' : (percentage >= 70 ? 'CORE' : 'BASE') }}
                        </p>
                      </div>

                      <div class="pt-8 flex flex-col gap-3">
                        <button @click="retryQuiz" class="w-full py-4 rounded-[20px] bg-zinc-900 dark:bg-white text-white dark:text-black font-black uppercase tracking-widest text-[11px] shadow-lg hover:-translate-y-1 transition-all">Retry Assessment</button>
                        <button @click="router.push('/dashboard')" class="w-full py-4 rounded-[20px] bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/5 text-zinc-500 font-black uppercase tracking-widest text-[11px] hover:bg-zinc-50 transition-all">Back to Command</button>
                      </div>
                    </div>
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
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useQuizStore } from '../store/quiz';
import { AlertCircle, Zap } from 'lucide-vue-next';
import NeoAppShell from '../components/layout/NeoAppShell.vue';
import NeoCard from '../components/common/NeoCard.vue';
import NeoLoader from '../components/common/NeoLoader.vue';

const route = useRoute();
const router = useRouter();
const quizStore = useQuizStore();

const result = ref(null);
const loading = ref(true);
const currentTab = ref('log');
const CIRCUMFERENCE = 2 * Math.PI * 88;

// Fallback Data from URL
const urlScore = computed(() => Number(route.query.score || 0));
const urlTotal = computed(() => Number(route.query.total || 0));

const displayScore = computed(() => result.value?.score ?? urlScore.value);
const displayTotal = computed(() => result.value?.totalQuestions ?? urlTotal.value);
const displayTime = computed(() => result.value ? formatTime(result.value.timeTaken) : "--");
const sessionDisplayId = computed(() => {
  if (route.query.submissionId) return route.query.submissionId.slice(-6);
  if (result.value?._id) return result.value._id.toString().slice(-6);
  return "PENDING";
});

const percentage = computed(() => {
  if (!displayTotal.value) return 0;
  return Math.round((displayScore.value / displayTotal.value) * 100);
});

const dashOffset = computed(() => {
  return CIRCUMFERENCE - (percentage.value / 100) * CIRCUMFERENCE;
});

const scoreStatus = computed(() => {
  if (percentage.value >= 85) return 'Exceptional Mastery';
  if (percentage.value >= 70) return 'Distinguished Performance';
  if (percentage.value >= 50) return 'Standard Competency';
  return 'Review Essential';
});

function formatTime(seconds) {
  if (!seconds) return '0s';
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
}

async function loadResult() {
  const submissionId = route.query.submissionId;
  const quizId = route.query.quizId;
  
  if (!submissionId && !quizId) {
    loading.value = false;
    return;
  }
  
  loading.value = true;
  try {
    let data;
    if (submissionId) {
      data = await quizStore.fetchSubmissionById(submissionId);
    } else if (quizId) {
      data = await quizStore.fetchLatestSubmission(quizId);
    }
    
    if (data) result.value = data;
  } catch (err) {
    console.error('[RESULT_SYNC_ERR]:', err);
  } finally {
    loading.value = false;
  }
}

function retryQuiz() {
  const quizId = route.query.quizId;
  if (quizId) {
    router.push(`/quiz/${quizId}`);
  }
}

onMounted(() => {
  loadResult();
  window.scrollTo({ top: 0, behavior: 'smooth' });
});
</script>

<style scoped>
.ease-out-expo {
  transition-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
}

.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: rgba(150, 150, 150, 0.3);
  border-radius: 20px;
}
.dark .custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.1);
}

.animate-in {
  animation: fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
