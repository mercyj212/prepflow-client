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
            <component :is="stat.icon" :size="20" />
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
import { computed, markRaw } from 'vue';
import { BookOpen, ClipboardList, Users, Zap } from 'lucide-vue-next';

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
    label: 'Courses', 
    value: props.coursesCount,
    description: 'Total Active Courses',
    icon: markRaw(BookOpen),
    bgClass: 'bg-brand',
    textClass: 'text-brand',
    iconWrapperClass: 'bg-brand/10 text-brand'
  },
  { 
    label: 'Practice Tests', 
    value: props.quizzesCount,
    description: 'Total Practice Tests',
    icon: markRaw(ClipboardList),
    bgClass: 'bg-emerald-500',
    textClass: 'text-emerald-500',
    iconWrapperClass: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
  },
  { 
    label: 'Students', 
    value: props.studentsCount,
    description: 'Total Registered Students',
    icon: markRaw(Users),
    bgClass: 'bg-rose-500',
    textClass: 'text-rose-500',
    iconWrapperClass: 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400'
  },
  { 
    label: 'Average Score', 
    value: props.globalAverage,
    suffix: '%',
    description: 'Average Student Score',
    icon: markRaw(Zap),
    bgClass: 'bg-amber-500',
    textClass: 'text-amber-500',
    iconWrapperClass: 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400'
  }
]);
</script>
