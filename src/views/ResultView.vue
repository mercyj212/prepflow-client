<template>
  <div class="min-h-screen bg-surface-primary dark:bg-zinc-950 text-slate-900 dark:text-zinc-100 pb-12">
    <nav class="bg-white dark:bg-zinc-950 border-b border-border-light dark:border-border-dark px-4 sm:px-6 py-4">
      <div class="max-w-5xl mx-auto flex items-center justify-between">
        <BrandLogo />
        <button @click="goHome" class="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500 hover:text-brand transition-colors">Back to dashboard</button>
      </div>
    </nav>

    <main class="max-w-5xl mx-auto px-4 sm:px-6 py-12">
      <!-- Main Score Result Card -->
      <section class="relative bg-slate-900 dark:bg-zinc-900/40 border border-slate-800 dark:border-white/5 rounded-[42px] overflow-hidden p-10 sm:p-16 text-center mb-10 shadow-2xl shadow-indigo-900/10 dark:shadow-none min-h-[400px] flex flex-col justify-center">
        <!-- Background Glow -->
        <div class="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent"></div>
        
        <div class="relative z-10 flex flex-col items-center">
           <div class="relative w-56 h-56 mx-auto mb-10 flex items-center justify-center">
             <!-- Circular Progress Background -->
             <svg class="absolute inset-0 w-full h-full -rotate-90">
               <circle class="text-white/5" stroke-width="12" stroke="currentColor" fill="transparent" r="96" cx="112" cy="112" />
               <circle 
                 :class="percentage >= 70 ? 'text-emerald-500' : (percentage >= 40 ? 'text-amber-400' : 'text-rose-500')" 
                 stroke-width="12" 
                 :stroke-dasharray="CIRCUMFERENCE" 
                 :stroke-dashoffset="dashOffset" 
                 stroke-linecap="round" 
                 stroke="currentColor" 
                 fill="transparent" 
                 r="96" cx="112" cy="112" 
               />
             </svg>
             <div class="text-center relative z-10">
               <p class="text-[64px] font-black leading-none tracking-tighter text-white">{{ percentage }}<span class="text-[24px] text-white/50">%</span></p>
               <p class="text-[10px] font-bold tracking-[0.2em] text-slate-400 mt-2 uppercase">Accuracy</p>
             </div>
           </div>

           <h1 class="text-3xl sm:text-5xl font-black tracking-tighter uppercase text-white mb-4" :class="percentage < 40 ? 'text-rose-500' : ''">{{ scoreMessage }}</h1>
           <p class="text-[12px] font-bold tracking-widest uppercase text-slate-400">
             You answered {{ score }} out of {{ total }} correctly
           </p>
        </div>
      </section>

      <!-- Analysis and Weak Topics (Grid) -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <!-- Subject Breakdown -->
        <section class="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-white/5 rounded-[32px] p-8 sm:p-10">
          <p class="text-slate-500 font-bold tracking-[0.2em] uppercase text-[10px] mb-2">Overview</p>
          <h2 class="text-2xl font-black uppercase tracking-tighter text-slate-900 dark:text-white mb-8">Performance</h2>
          <div class="space-y-6">
            <div v-for="(item, idx) in breakdownMock" :key="idx" class="flex flex-col gap-3">
              <div class="flex justify-between items-center">
                <p class="text-[12px] font-bold uppercase tracking-widest text-slate-700 dark:text-zinc-300">{{ item.topic }}</p>
                <span class="text-[12px] font-black" :class="item.percent < 50 ? 'text-rose-500' : 'text-emerald-500'">{{ item.percent }}%</span>
              </div>
              <div class="h-1.5 rounded-full bg-slate-100 dark:bg-zinc-800 overflow-hidden w-full">
                  <div class="h-full rounded-full transition-all duration-1000 ease-out" :class="item.percent < 50 ? 'bg-rose-500' : 'bg-emerald-500'" :style="{ width: `${item.percent}%` }"></div>
              </div>
            </div>
          </div>
        </section>

        <!-- Weak Topics Section -->
        <section class="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-white/5 rounded-[32px] p-8 sm:p-10 flex flex-col justify-between" :class="{ 'opacity-50 grayscale pointer-events-none': weakTopics.length === 0 }">
           <div>
              <p class="text-slate-500 dark:text-zinc-500 font-bold tracking-[0.2em] uppercase text-[10px] mb-2">Analysis</p>
              <h2 class="text-2xl font-black uppercase tracking-tighter text-slate-900 dark:text-white mb-8">Areas to Review</h2>
              
              <div v-if="weakTopics.length > 0" class="flex flex-wrap gap-2 mb-8">
                <span v-for="topic in weakTopics" :key="topic" class="px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 text-[11px] font-bold uppercase tracking-widest shadow-sm">
                  {{ topic }}
                </span>
              </div>
              <p v-else class="text-[12px] font-bold tracking-widest uppercase text-slate-500">No major weaknesses detected.</p>
           </div>
           
           <button v-if="weakTopics.length > 0" @click="retryWeak" class="w-full py-4 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-[11px] font-black uppercase tracking-[0.2em] transition-all active:scale-[0.98]">
              Review Weak Topics
           </button>
        </section>
      </div>

      <!-- Final Actions -->
      <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
        <button @click="goHome" class="w-full sm:w-auto px-10 py-4 rounded-2xl bg-white dark:bg-zinc-800 border-[0.5px] border-slate-200 dark:border-zinc-700 text-[11px] font-black uppercase tracking-[0.2em] text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-zinc-700 hover:scale-[1.02] transition-all cursor-pointer">
          Return to Dashboard
        </button>
        <button @click="shareResult" class="w-full sm:w-auto px-10 py-4 rounded-2xl bg-brand hover:opacity-90 text-white text-[11px] font-black uppercase tracking-[0.2em] hover:scale-[1.02] transition-all shadow-xl shadow-brand/20 cursor-pointer">
          Share Result
        </button>
      </div>
    </main>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import BrandLogo from '../components/BrandLogo.vue';

const route = useRoute();
const router = useRouter();

const score = Number(route.query.score || 0);
const total = Number(route.query.total || 0);
const CIRCUMFERENCE = 2 * Math.PI * 96;

const percentage = computed(() => {
  if (!total) return 0;
  return Math.round((score / total) * 100);
});

const dashOffset = computed(() => {
  return CIRCUMFERENCE - (percentage.value / 100) * CIRCUMFERENCE;
});

const scoreColorClass = computed(() => {
  if (percentage.value >= 70) return 'text-success';
  if (percentage.value >= 40) return 'text-warning';
  return 'text-danger';
});

const scoreMessage = computed(() => {
  if (percentage.value >= 70) return 'Excellent Performance';
  if (percentage.value >= 40) return 'Needs Improvement';
  return 'Review Recommended';
});

const breakdownMock = [
  { topic: 'General knowledge', total: 10, percent: Math.min(100, percentage.value + 5) },
  { topic: 'Subject fundamentals', total: 8, percent: Math.max(0, percentage.value - 10) },
  { topic: 'Logical reasoning', total: 7, percent: percentage.value }
];

const weakTopics = computed(() => {
  return breakdownMock.filter(i => i.percent < 50).map(i => i.topic);
});

function goHome() {
  router.push('/dashboard');
}

function retryWeak() {
  const quizId = route.query.quizId;
  router.push(`/quiz/${quizId}`);
}

function shareResult() {
  if (navigator.share) {
    navigator.share({
      title: 'PrepUp CBT Result',
      text: `I just scored ${percentage.value}% on PrepUp CBT!`,
      url: window.location.href
    }).catch(console.error);
  } else {
    alert('Copied link to clipboard!');
  }
}
</script>