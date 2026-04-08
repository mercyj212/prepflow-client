<template>
  <div class="min-h-screen bg-surface-secondary dark:bg-zinc-950 text-slate-900 dark:text-zinc-100 pb-12">
    <nav class="bg-white dark:bg-zinc-950 border-b border-border-light dark:border-border-dark px-4 sm:px-6 py-4">
      <div class="max-w-4xl mx-auto flex items-center justify-between">
        <BrandLogo />
        <button @click="goHome" class="text-[14px] font-medium text-slate-500 hover:text-brand">Back to dashboard</button>
      </div>
    </nav>

    <main class="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <!-- Main Score Result Card -->
      <section class="flat-card bg-white p-8 sm:p-12 text-center mb-8">
        <div class="relative w-48 h-48 mx-auto mb-6 flex items-center justify-center">
          <!-- Circular Progress Background -->
          <svg class="absolute inset-0 w-full h-full -rotate-90">
            <circle class="text-slate-100 dark:text-zinc-800" stroke-width="8" stroke="currentColor" fill="transparent" r="88" cx="96" cy="96" />
            <circle 
              :class="scoreColorClass" 
              stroke-width="8" 
              :stroke-dasharray="CIRCUMFERENCE" 
              :stroke-dashoffset="dashOffset" 
              stroke-linecap="round" 
              stroke="currentColor" 
              fill="transparent" 
              r="88" cx="96" cy="96" 
            />
          </svg>
          <div class="text-center">
            <p class="text-[52px] font-medium leading-none">{{ percentage }}<span class="text-[24px]">%</span></p>
            <p class="text-[14px] font-normal text-slate-500 mt-1">Overall score</p>
          </div>
        </div>

        <h1 class="text-[28px] font-medium mb-2">{{ scoreMessage }}</h1>
        <p class="text-[16px] font-normal text-slate-500">
          You answered {{ score }} out of {{ total }} questions correctly.
        </p>
      </section>

      <!-- Subject Breakdown Table -->
      <section class="mb-8">
        <h2 class="text-[20px] font-medium mb-4">Performance breakdown</h2>
        <div class="flat-card overflow-hidden">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-slate-50 dark:bg-zinc-800/50 border-b border-border-light dark:border-border-dark">
                <th class="px-6 py-4 text-[13px] font-medium text-slate-500 uppercase tracking-tight">Subject / topic</th>
                <th class="px-6 py-4 text-[13px] font-medium text-slate-500 uppercase tracking-tight text-right">Accuracy</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-border-light dark:divide-border-dark">
              <tr v-for="(item, idx) in breakdownMock" :key="idx" class="hover:bg-slate-50 transition-colors">
                <td class="px-6 py-4">
                  <p class="text-[15px] font-medium">{{ item.topic }}</p>
                  <p class="text-[12px] text-slate-500 font-normal mt-0.5">{{ item.total }} questions</p>
                </td>
                <td class="px-6 py-4 text-right">
                  <span class="text-[15px] font-medium" :class="item.percent < 50 ? 'text-danger' : 'text-success'">{{ item.percent }}%</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <!-- Weak Topics Section -->
      <section v-if="weakTopics.length > 0" class="mb-10">
        <div class="flat-card p-6 border-danger/20 bg-danger/[0.02]">
          <h3 class="flex items-center gap-2 text-[16px] font-medium text-danger mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            Topics to focus on
          </h3>
          <div class="flex flex-wrap gap-2">
            <span v-for="topic in weakTopics" :key="topic" class="px-3 py-1.5 rounded-lg border-[0.5px] border-danger/20 bg-white text-danger text-[13px] font-medium">
              {{ topic }}
            </span>
          </div>
          <button @click="retryWeak" class="mt-6 w-full py-3 rounded-xl bg-danger text-white text-[14px] font-medium hover:opacity-90 transition-opacity">
            Retry weak topics
          </button>
        </div>
      </section>

      <!-- Final Actions -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button @click="goHome" class="py-3.5 rounded-xl border-[0.5px] border-border-light bg-white text-[14px] font-medium text-slate-700 hover:bg-slate-50 transition-colors">
          Return to dashboard
        </button>
        <button @click="shareResult" class="flex items-center justify-center gap-2 py-3.5 rounded-xl bg-brand text-white text-[14px] font-medium hover:opacity-90 transition-opacity">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>
          Share result
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
const CIRCUMFERENCE = 2 * Math.PI * 88;

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
  if (percentage.value >= 70) return 'Excellent work!';
  if (percentage.value >= 40) return 'Good effort!';
  return 'Keep practicing!';
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