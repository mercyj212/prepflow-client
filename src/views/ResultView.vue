<template>
  <NeoAppShell>
    <div class="px-4 sm:px-8 py-8 max-w-4xl mx-auto">

      <!-- Header -->
      <header class="mb-8">
        <h1 class="text-2xl sm:text-3xl font-bold text-slate-400 dark:text-zinc-400 uppercase tracking-widest mb-2">Results</h1>
        <p class="text-[15px] font-medium text-slate-500 dark:text-zinc-500">Your latest quiz performance breakdown.</p>
      </header>

      <!-- Main Score Result Card -->
      <section class="relative bg-slate-900 dark:bg-zinc-900/60 rounded-[32px] overflow-hidden p-10 sm:p-14 text-center mb-8 border border-white/10 min-h-[360px] flex flex-col justify-center">
        <div class="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent pointer-events-none"></div>
        
        <div class="relative z-10 flex flex-col items-center">
          <div class="relative w-48 h-48 mx-auto mb-8 flex items-center justify-center">
            <svg class="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 224 224">
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
              <p class="text-[56px] font-black leading-none tracking-tighter text-white">{{ percentage }}<span class="text-[22px] text-white/50">%</span></p>
              <p class="text-[10px] font-bold tracking-[0.2em] text-slate-400 mt-1 uppercase">Accuracy</p>
            </div>
          </div>

          <h2 class="text-3xl sm:text-4xl font-black tracking-tighter uppercase text-white mb-3" :class="percentage < 40 ? 'text-rose-500' : ''">{{ scoreMessage }}</h2>
          <p class="text-[12px] font-bold tracking-widest uppercase text-slate-400">
            You answered {{ score }} out of {{ total }} correctly
          </p>
        </div>
      </section>

      <!-- Analysis Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
        <!-- Performance Breakdown -->
        <div class="bg-[var(--neo-surface)] rounded-[24px] shadow-neo border border-white/20 dark:border-white/5 p-7">
          <p class="text-[11px] font-bold uppercase tracking-widest text-slate-400 dark:text-zinc-500 mb-1">Overview</p>
          <h3 class="text-xl font-bold text-slate-800 dark:text-zinc-100 uppercase tracking-tight mb-6">Performance</h3>
          <div class="space-y-5">
            <div v-for="(item, idx) in breakdownMock" :key="idx" class="flex flex-col gap-2">
              <div class="flex justify-between items-center">
                <p class="text-[12px] font-bold uppercase tracking-widest text-slate-600 dark:text-zinc-300">{{ item.topic }}</p>
                <span class="text-[12px] font-black" :class="item.percent < 50 ? 'text-rose-500' : 'text-emerald-500'">{{ item.percent }}%</span>
              </div>
              <div class="h-1.5 rounded-full bg-slate-100 dark:bg-zinc-800 overflow-hidden">
                <div class="h-full rounded-full transition-all duration-1000 ease-out" :class="item.percent < 50 ? 'bg-rose-500' : 'bg-emerald-500'" :style="{ width: `${item.percent}%` }"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Areas to Review -->
        <div class="bg-[var(--neo-surface)] rounded-[24px] shadow-neo border border-white/20 dark:border-white/5 p-7 flex flex-col justify-between" :class="{ 'opacity-50 pointer-events-none': weakTopics.length === 0 }">
          <div>
            <p class="text-[11px] font-bold uppercase tracking-widest text-slate-400 dark:text-zinc-500 mb-1">Analysis</p>
            <h3 class="text-xl font-bold text-slate-800 dark:text-zinc-100 uppercase tracking-tight mb-6">Areas to Review</h3>
            <div v-if="weakTopics.length > 0" class="flex flex-wrap gap-2 mb-6">
              <span v-for="topic in weakTopics" :key="topic" class="px-3 py-1.5 rounded-xl border border-black/10 dark:border-white/10 bg-slate-50 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 text-[11px] font-bold uppercase tracking-widest">
                {{ topic }}
              </span>
            </div>
            <p v-else class="text-[13px] text-slate-500 dark:text-zinc-500">No major weaknesses detected. 🎉</p>
          </div>
          <button v-if="weakTopics.length > 0" @click="retryWeak" class="w-full py-3.5 rounded-xl bg-slate-900 dark:bg-zinc-100 text-white dark:text-slate-900 text-[11px] font-black uppercase tracking-[0.2em] transition-all hover:scale-[1.02] active:scale-[0.98]">
            Review Weak Topics
          </button>
        </div>
      </div>

      <!-- Final Actions -->
      <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
        <button @click="goHome" class="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[var(--neo-surface)] shadow-neo border border-white/20 dark:border-white/5 text-[11px] font-black uppercase tracking-[0.2em] text-slate-800 dark:text-zinc-100 hover:shadow-neo-md transition-all active:scale-[0.98]">
          Return to Dashboard
        </button>
        <button @click="shareResult" class="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-slate-900 dark:bg-zinc-100 text-white dark:text-slate-900 text-[11px] font-black uppercase tracking-[0.2em] hover:opacity-90 transition-all active:scale-[0.98]">
          Share Result
        </button>
      </div>
    </div>
  </NeoAppShell>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import NeoAppShell from '../components/layout/NeoAppShell.vue';

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

const scoreMessage = computed(() => {
  if (percentage.value >= 70) return 'Excellent Performance';
  if (percentage.value >= 40) return 'Needs Improvement';
  return 'Review Recommended';
});

const breakdownMock = [
  { topic: 'General knowledge', total: 10, percent: Math.min(100, score > 0 ? Math.round((score/total)*100) + 5 : 0) },
  { topic: 'Subject fundamentals', total: 8, percent: Math.max(0, score > 0 ? Math.round((score/total)*100) - 10 : 0) },
  { topic: 'Logical reasoning', total: 7, percent: score > 0 ? Math.round((score/total)*100) : 0 }
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