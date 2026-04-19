<template>
  <NeoAppShell>
    <div class="h-full flex px-2 sm:px-4 lg:px-8 py-4 gap-8">
      <section class="flex-1 flex flex-col min-w-0 h-full overflow-y-auto pb-10 custom-scrollbar pr-4 pt-1">
        <header class="mb-12">
          <h1 class="text-[34px] font-medium text-zinc-800 dark:text-zinc-100 tracking-tight mb-1">Progress & Mastery</h1>
          <p class="text-[15px] font-normal text-zinc-500 dark:text-zinc-500">Analyze your historical performance matrices.</p>
        </header>

        <NeoLoader v-if="quizStore.loading && !metrics" label="Loading analytics..." />

        <div v-else-if="metrics" class="grid grid-cols-1 md:grid-cols-2 gap-8">
           <!-- Chart 1: Performance Over Time -->
           <NeoCard variant="extruded" class="!rounded-[28px] p-6 h-80 flex flex-col relative overflow-hidden">
             <div class="flex items-center gap-3 mb-4">
               <div class="w-10 h-10 rounded-[14px] bg-zinc-50 dark:bg-zinc-800/50 flex items-center justify-center shadow-neo-inner">
                 <LineChartIcon :size="20" :stroke-width="1.5" class="text-zinc-600 dark:text-zinc-400" />
               </div>
               <p class="text-[11px] font-black uppercase tracking-widest text-zinc-400">Performance Over Time</p>
             </div>
             
             <div class="flex-1 w-full min-h-0 relative">
               <Line v-if="hasTimelineData" :data="timelineChartData" :options="lineChartOptions" />
               <div v-else class="absolute inset-0 flex items-center justify-center text-xs text-zinc-400 uppercase tracking-widest opacity-50">Not enough data</div>
             </div>
           </NeoCard>
           
           <!-- Chart 2: Subject Mastery -->
           <NeoCard variant="extruded" class="!rounded-[28px] p-6 h-80 flex flex-col relative overflow-hidden">
             <div class="flex items-center gap-3 mb-4">
               <div class="w-10 h-10 rounded-[14px] bg-zinc-50 dark:bg-zinc-800/50 flex items-center justify-center shadow-neo-inner">
                 <Target :size="20" :stroke-width="1.5" class="text-zinc-600 dark:text-zinc-400" />
               </div>
               <p class="text-[11px] font-black uppercase tracking-widest text-zinc-400">Subject Mastery</p>
             </div>
             
             <div class="flex-1 w-full min-h-0 relative">
               <Bar v-if="hasSubjectData" :data="subjectChartData" :options="barChartOptions" />
               <div v-else class="absolute inset-0 flex items-center justify-center text-xs text-zinc-400 uppercase tracking-widest opacity-50">Not enough data</div>
             </div>
           </NeoCard>
           
           <!-- Summary Stats -->
           <NeoCard variant="depressed" class="!rounded-[28px] p-8 md:col-span-2 flex flex-col sm:flex-row gap-6 justify-around items-center border shadow-inner">
              <div class="text-center">
                <p class="text-[11px] font-black uppercase tracking-widest text-zinc-400 mb-2">Total Questions</p>
                <p class="text-4xl font-light text-zinc-800 dark:text-zinc-100 tracking-tighter">{{ metrics.totalQuestionsDone }}</p>
              </div>
              <div class="w-px h-16 bg-zinc-200 dark:bg-zinc-800"></div>
              <div class="text-center">
                <p class="text-[11px] font-black uppercase tracking-widest text-zinc-400 mb-2">Average Score</p>
                <p class="text-4xl font-light text-zinc-800 dark:text-zinc-100 tracking-tighter">{{ metrics.averageScore }}<span class="text-xl text-zinc-400">%</span></p>
              </div>
              <div class="w-px h-16 bg-zinc-200 dark:bg-zinc-800"></div>
              <div class="text-center">
                <p class="text-[11px] font-black uppercase tracking-widest text-zinc-400 mb-2">Active Streak</p>
                <p class="text-4xl font-light text-zinc-800 dark:text-zinc-100 tracking-tighter">{{ metrics.streakDays }} <span class="text-[14px] text-zinc-400 uppercase tracking-widest font-normal">Days</span></p>
              </div>
           </NeoCard>
        </div>
      </section>
    </div>
  </NeoAppShell>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { LineChart as LineChartIcon, Target, Microscope } from 'lucide-vue-next';
import NeoAppShell from '../components/layout/NeoAppShell.vue';
import NeoCard from '../components/common/NeoCard.vue';
import NeoLoader from '../components/common/NeoLoader.vue';
import { useQuizStore } from '../store/quiz';

import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Filler
} from 'chart.js';
import { Line, Bar } from 'vue-chartjs';

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend, Filler);

const quizStore = useQuizStore();

onMounted(async () => {
  await quizStore.fetchProgressMetrics();
});

const metrics = computed(() => quizStore.progressMetrics);

// --- Timeline Chart (Line) ---
const hasTimelineData = computed(() => metrics.value?.performanceOverTime?.length > 0);

const timelineChartData = computed(() => {
  const data = metrics.value?.performanceOverTime || [];
  return {
    labels: data.map(d => {
      const parts = d.date.split('-'); // YYYY-MM-DD
      return `${parts[1]}/${parts[2]}`; // MM/DD
    }),
    datasets: [{
      label: 'Score %',
      data: data.map(d => d.score),
      borderColor: '#3f3f46', // zinc-700
      backgroundColor: 'rgba(63, 63, 70, 0.1)',
      borderWidth: 2,
      pointBackgroundColor: '#18181b',
      fill: true,
      tension: 0.4
    }]
  };
});

const lineChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: 'rgba(0,0,0,0.8)',
      titleFont: { size: 11, family: 'Outfit' },
      bodyFont: { size: 13, family: 'Outfit', weight: 'bold' },
      padding: 12,
      cornerRadius: 12,
      displayColors: false,
      callbacks: {
        label: (context) => `${context.parsed.y}% Avg`
      }
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      max: 100,
      grid: { color: 'rgba(150, 150, 150, 0.1)' },
      ticks: {
        font: { family: 'Outfit', size: 10 },
        color: '#9ca3af',
        stepSize: 25
      }
    },
    x: {
      grid: { display: false },
      ticks: {
        font: { family: 'Outfit', size: 10 },
        color: '#9ca3af'
      }
    }
  }
};

// --- Subject Mastery (Bar) ---
const hasSubjectData = computed(() => metrics.value?.subjectMastery?.length > 0);

const subjectChartData = computed(() => {
  const data = metrics.value?.subjectMastery || [];
  return {
    labels: data.map(d => d.subject.length > 15 ? d.subject.substring(0, 15) + '...' : d.subject),
    datasets: [{
      label: 'Mastery %',
      data: data.map(d => d.mastery),
      backgroundColor: '#18181b', // zinc-900 (dynamic would be better but this is js)
      borderRadius: 6,
      barThickness: 'flex',
      maxBarThickness: 32
    }]
  };
});

const barChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: 'rgba(0,0,0,0.8)',
      titleFont: { size: 11, family: 'Outfit' },
      bodyFont: { size: 13, family: 'Outfit', weight: 'bold' },
      padding: 12,
      cornerRadius: 12,
      displayColors: false,
      callbacks: {
        label: (context) => `Mastery: ${context.parsed.y}%`
      }
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      max: 100,
      grid: { color: 'rgba(150, 150, 150, 0.1)' },
      ticks: {
        font: { family: 'Outfit', size: 10 },
        color: '#9ca3af',
        stepSize: 20
      }
    },
    x: {
      grid: { display: false },
      ticks: {
        font: { family: 'Outfit', size: 10 },
        color: '#9ca3af'
      }
    }
  }
};
</script>
