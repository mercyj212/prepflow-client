<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 px-1">
    <div v-for="(stat, idx) in statsList" :key="idx" 
         class="relative group isolate p-7 rounded-[28px] border border-zinc-200 dark:border-zinc-800/50 overflow-hidden transition-all duration-500 hover:shadow-neo-md hover:-translate-y-1 bg-[var(--neo-surface)]">
      
      <!-- Premium Accent Backgrounds -->
      <div class="absolute inset-0 opacity-[0.02] dark:opacity-[0.05] group-hover:opacity-[0.07] transition-opacity" :class="stat.bgClass"></div>
      <div class="absolute -right-12 -top-12 w-32 h-32 blur-3xl opacity-0 group-hover:opacity-10 transition-opacity bg-current" :class="stat.textClass"></div>

      <div class="relative z-10 flex flex-col h-full">
        <header class="flex items-center justify-between mb-8">
          <div class="p-3 rounded-2xl transition-all duration-500 shadow-neo-pill" :class="stat.iconWrapperClass">
            <div v-html="stat.icon" class="w-5 h-5 flex items-center justify-center"></div>
          </div>
          <div class="flex items-center gap-1.5 px-2.5 py-1 bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-full">
            <span class="w-1 h-1 rounded-full animate-pulse" :class="loading ? 'bg-amber-400' : 'bg-brand'"></span>
            <span class="text-[8px] font-black uppercase tracking-widest text-zinc-400">{{ loading ? 'Syncing' : 'Real-time' }}</span>
          </div>
        </header>

        <h3 class="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-400 mb-1.5">{{ stat.label }}</h3>
        
        <div class="flex items-baseline gap-1.5">
          <span class="text-4xl font-black tracking-tighter text-zinc-900 dark:text-zinc-100 group-hover:scale-105 transition-transform duration-500">
            <template v-if="loading">
              <span class="inline-block w-12 h-8 bg-zinc-100 dark:bg-zinc-800 animate-pulse rounded-lg"></span>
            </template>
            <template v-else>
              {{ stat.value }}
            </template>
          </span>
          <span v-if="stat.suffix" class="text-lg font-black text-zinc-300 dark:text-zinc-700 tracking-tighter">{{ stat.suffix }}</span>
        </div>

        <div class="mt-8 pt-6 border-t border-zinc-100 dark:border-white/5 flex items-center justify-between">
          <p class="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">{{ stat.description }}</p>
          <div class="w-2 h-2 rounded-full opacity-20 group-hover:opacity-100 transition-all" :class="stat.bgClass"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  loading: Boolean,
  coursesCount: Number,
  quizzesCount: Number,
  studentsCount: Number,
  submissionsCount: Number,
  globalAverage: Number
});

const statsList = computed(() => [
  { 
    label: 'Knowledge Assets', 
    value: props.coursesCount,
    description: 'Total Active Curriculums',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.168.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>',
    bgClass: 'bg-brand',
    textClass: 'text-brand',
    iconWrapperClass: 'bg-brand/10 text-brand'
  },
  { 
    label: 'Evaluation Gateways', 
    value: props.quizzesCount,
    description: 'Active Assessment Paths',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>',
    bgClass: 'bg-emerald-500',
    textClass: 'text-emerald-500',
    iconWrapperClass: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
  },
  { 
    label: 'Scholar Registry', 
    value: props.studentsCount,
    description: 'Verified Active Users',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>',
    bgClass: 'bg-rose-500',
    textClass: 'text-rose-500',
    iconWrapperClass: 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400'
  },
  { 
    label: 'Global Performance', 
    value: props.globalAverage,
    suffix: '%',
    description: 'Platform Assessment Avg',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>',
    bgClass: 'bg-amber-500',
    textClass: 'text-amber-500',
    iconWrapperClass: 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400'
  }
]);
</script>
