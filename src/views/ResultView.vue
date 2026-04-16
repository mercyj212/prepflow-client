<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import NeoAppShell from '../components/layout/NeoAppShell.vue';

const route = useRoute();
const score = ref(route.query.score || 0);
const total = ref(route.query.total || 0);

const metrics = [
  { label: 'Accuracy', value: `${Math.round((score.value / total.value) * 100)}%`, status: 'Excellent' },
  { label: 'Mastery Index', value: '8.4', status: 'Stable' },
  { label: 'Response Time', value: '1.2s', status: 'Nominal' },
  { label: 'Success Rate', value: '92%', status: 'High' }
];

const mockQuestions = [
  { id: 1, text: 'What is the SI unit of Force?', result: 'SUCCESS', response: 'Newton (N)' },
  { id: 2, text: 'If 2x + 4 = 12, what is x?', result: 'SUCCESS', response: '4' },
  { id: 3, text: 'Which element has the symbol Au?', result: 'ERROR', response: 'Silver (Correct: Gold)' },
  { id: 4, text: 'Calculate the area of a circle...', result: 'SUCCESS', response: 'πr²' }
];

onMounted(() => {
  window.scrollTo(0, 0);
});
</script>
<template>
  <NeoAppShell>
    <div class="min-h-screen bg-white dark:bg-zinc-950 p-4 sm:p-8 md:p-12 font-sans py-24 md:py-32">
      <div class="max-w-7xl mx-auto">
        
        <!-- Intelligence Header -->
        <div class="flex flex-col md:flex-row justify-between items-start md:items-end gap-10 mb-20 px-4">
          <div class="animate-in fade-in slide-in-from-left-4 duration-700">
            <div class="inline-flex items-center gap-3 mb-6">
              <span class="w-12 h-px bg-brand"></span>
              <span class="text-[10px] font-black tracking-[0.4em] uppercase text-brand">Session Review</span>
            </div>
            <h1 class="text-[clamp(48px,8vw,104px)] font-black leading-[0.85] tracking-tighter uppercase">
              Performance <br/> <span class="text-zinc-200 dark:text-zinc-800">Report</span>
            </h1>
          </div>
          
          <div class="flex flex-col items-end animate-in fade-in slide-in-from-right-4 duration-700">
            <div class="text-[12px] font-bold tracking-[0.2em] text-zinc-400 mb-4 uppercase">Performance Score: 82.4</div>
            <div class="px-8 py-4 bg-zinc-900 text-white dark:bg-white dark:text-black text-[13px] font-black uppercase tracking-widest rounded-full shadow-lg">
              Verified Session
            </div>
          </div>
        </div>

        <!-- Performance Matrix -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 border border-zinc-100 dark:border-zinc-800 rounded-none overflow-hidden bg-white/5 backdrop-blur-xl shadow-2xl mb-32 animate-in fade-in zoom-in-95 duration-1000">
          <div v-for="metric in metrics" :key="metric.label" class="p-12 border-b md:border-b-0 md:border-r border-zinc-100 dark:border-zinc-800 last:border-0 group hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all duration-500 flex flex-col justify-between min-h-[220px]">
            <p class="text-[10px] font-bold uppercase tracking-[0.4em] text-zinc-400 mb-10">{{ metric.label }}</p>
            <div>
              <div class="text-6xl font-black tracking-tighter mb-6 group-hover:translate-x-1 transition-transform">{{ metric.value }}</div>
              <div class="flex items-center gap-3">
                <div class="w-2 h-2 rounded-none bg-brand animate-pulse shadow-[0_0_10px_rgba(20,184,166,0.5)]"></div>
                <span class="text-[9px] font-black text-zinc-500 uppercase tracking-[0.2em]">{{ metric.status }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Question Log Data Stream -->
        <div class="space-y-6 max-w-5xl mx-auto px-4">
          <div class="flex items-center gap-6 mb-12">
            <span class="text-[12px] font-black uppercase tracking-[0.4em] text-zinc-400">Response Analysis</span>
            <div class="flex-1 h-px bg-zinc-100 dark:bg-zinc-800"></div>
          </div>
          
          <div v-for="q in mockQuestions" :key="q.id" 
            class="group flex flex-col md:flex-row gap-8 p-10 bg-white dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800 rounded-none hover:border-brand/40 hover:shadow-2xl hover:scale-[1.01] transition-all duration-500 animate-in fade-in slide-in-from-bottom-4"
            :style="{ animationDelay: `${q.id * 100}ms` }">
            <div class="w-12 text-[11px] font-mono text-zinc-300 group-hover:text-brand transition-colors font-bold">#{{ q.id.toString().padStart(3, '0') }}</div>
            <div class="flex-1">
              <h3 class="text-base font-black tracking-tight mb-3 uppercase group-hover:text-brand transition-colors">{{ q.text }}</h3>
              <p class="text-[11px] text-zinc-500 font-bold tracking-wide uppercase">RESPONSE: <span class="text-zinc-900 dark:text-white">{{ q.response }}</span></p>
            </div>
            <div class="flex items-center">
              <span class="px-5 py-2 text-[10px] font-black rounded-full border shadow-sm transition-all" 
                :class="q.result === 'SUCCESS' ? 'text-brand border-brand/20 bg-brand/5 group-hover:bg-brand group-hover:text-white' : 'text-red-500 border-red-500/20 bg-red-500/5 group-hover:bg-red-500 group-hover:text-white'">
                {{ q.result }}
              </span>
            </div>
          </div>
        </div>

        <div class="mt-32 flex flex-col sm:flex-row gap-8 justify-center items-center pb-20">
          <router-link to="/subjects" class="w-full sm:w-auto px-12 py-5 bg-zinc-900 text-white dark:bg-white dark:text-black text-[13px] font-black uppercase tracking-widest hover:scale-105 rounded-none transition-all shadow-xl text-center">
            New Practice Session
          </router-link>
          <router-link to="/dashboard" class="w-full sm:w-auto px-12 py-5 border-2 border-zinc-900 dark:border-white text-zinc-900 dark:text-white text-[13px] font-black uppercase tracking-widest hover:bg-zinc-900 hover:text-white dark:hover:bg-white dark:hover:text-black rounded-none transition-all text-center">
            View Analytics
          </router-link>
        </div>

      </div>
    </div>
  </NeoAppShell>
</template>
