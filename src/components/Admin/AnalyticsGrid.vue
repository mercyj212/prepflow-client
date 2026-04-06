<template>
  <div v-if="!loading" class="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
    <div v-for="stat in statsList" :key="stat.label" 
         class="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-2xl relative overflow-hidden group shadow-sm transition-colors">
      <div class="absolute inset-0 bg-gradient-to-br from-zinc-500/5 dark:from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
      <h3 class="text-zinc-500 dark:text-zinc-400 text-sm font-medium flex items-center gap-2">
        <component :is="stat.icon" v-if="stat.icon" class="w-4 h-4" />
        {{ stat.label }}
      </h3>
      <p class="text-4xl font-bold mt-2 text-zinc-900 dark:text-white">{{ stat.value }}{{ stat.suffix || '' }}</p>
    </div>
  </div>
  <div v-else class="text-center py-6 text-zinc-500 animate-pulse">Loading platform metrics...</div>
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
  { label: 'Total Courses', value: props.coursesCount },
  { label: 'Active Quizzes', value: props.quizzesCount },
  { 
    label: 'Total Scholars', 
    value: props.studentsCount,
    icon: {
      template: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>'
    }
  },
  { label: 'Submissions', value: props.submissionsCount },
  { label: 'Global Average', value: props.globalAverage, suffix: '%' }
]);
</script>
