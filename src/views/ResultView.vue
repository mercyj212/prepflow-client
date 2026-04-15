<template>
  <NeoAppShell>
    <div class="px-6 md:px-12 py-12 max-w-5xl mx-auto">
      
      <!-- HEADER -->
      <header class="mb-12 text-center md:text-left">
          <div class="flex items-center justify-center md:justify-start gap-3 mb-4">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span class="text-[11px] font-black uppercase tracking-[0.3em] text-zinc-400">Your Results</span>
          </div>
          <h1 class="text-4xl md:text-5xl font-black text-zinc-900 dark:text-zinc-100 tracking-tight mb-2">Finished!</h1>
          <p class="text-[16px] text-zinc-500 dark:text-zinc-500 max-w-xl leading-relaxed">
            We've checked your answers against the course. Here is a summary of how you did.
          </p>
      </header>

      <!-- MAIN SCORE DISPLAY -->
      <section class="relative bg-zinc-900 rounded-[40px] overflow-hidden p-12 md:p-16 mb-12 shadow-2xl border border-white/5 group">
        <!-- Background Ambient Glows -->
        <div class="absolute -right-20 -bottom-20 w-80 h-80 bg-brand/10 rounded-full blur-[100px] group-hover:bg-brand/20 transition-colors"></div>
        <div class="absolute -left-20 -top-20 w-80 h-80 bg-brand/5 rounded-full blur-[100px]"></div>

        <div class="relative z-10 flex flex-col md:flex-row items-center gap-12 md:gap-20">
          <!-- Circular Progress -->
          <div class="relative w-56 h-56 flex items-center justify-center shrink-0">
             <!-- Outer Ring -->
             <svg class="absolute inset-0 w-full h-full -rotate-90 scale-110" viewBox="0 0 224 224">
                <circle class="text-white/5" stroke-width="4" stroke="currentColor" fill="transparent" r="100" cx="112" cy="112" />
                <circle 
                    :class="percentage >= 70 ? 'text-emerald-500' : (percentage >= 40 ? 'text-amber-500' : 'text-rose-500')"
                    stroke-width="8" 
                    :stroke-dasharray="CIRCUMFERENCE" 
                    :stroke-dashoffset="dashOffset" 
                    stroke-linecap="round" 
                    stroke="currentColor" 
                    fill="transparent" 
                    r="100" cx="112" cy="112" 
                    class="transition-all duration-1000 ease-out"
                />
             </svg>
             <!-- Inner Circle -->
             <div class="w-40 h-40 rounded-full bg-zinc-800/50 backdrop-blur-md flex flex-col items-center justify-center shadow-2xl border border-white/10">
                <span class="text-6xl font-black text-white tracking-tighter">{{ percentage }}<span class="text-2xl text-white/40">%</span></span>
                <span class="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 mt-2">Accuracy</span>
             </div>
          </div>

          <div class="text-center md:text-left flex-1">
             <div class="inline-block px-4 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-6">Final Score</div>
             <h2 class="text-3xl md:text-5xl font-black tracking-tight text-white mb-6 uppercase" :class="percentage < 40 ? 'text-rose-400' : ''">{{ scoreMessage }}</h2>
              <p class="text-zinc-400 text-[15px] leading-relaxed mb-8 max-w-sm">
                 You got {{ score }} out of {{ total }} questions correct in this area. 
                 <span class="block mt-2 text-zinc-500" v-if="percentage >= 70">Great job! You've successfully mastered this subject.</span>
                 <span class="block mt-2 text-zinc-500" v-else>A few things to work on. We suggest practicing these topics again.</span>
              </p>

             <div class="flex flex-wrap gap-4 justify-center md:justify-start">
                <button @click="shareResult" class="px-8 h-12 bg-white text-black font-black uppercase tracking-widest text-[11px] rounded-xl hover:-translate-y-1 transition-all active:translate-y-0">Share credentials</button>
             </div>
          </div>
        </div>
      </section>

      <!-- ANALYSIS GRID -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
         <!-- Breakdown -->
         <NeoCard variant="depressed" class="p-8">
            <h3 class="text-[12px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-8">How you did</h3>
            <div class="space-y-8">
               <div v-for="(item, idx) in breakdownMock" :key="idx" class="space-y-3">
                  <div class="flex justify-between items-end">
                     <span class="text-[13px] font-bold text-zinc-700 dark:text-zinc-200">{{ item.topic }}</span>
                     <span class="text-xs font-black" :class="item.percent < 50 ? 'text-rose-500' : 'text-emerald-500'">{{ item.percent }}%</span>
                  </div>
                  <div class="h-2 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden border border-white/5">
                     <div class="h-full rounded-full transition-all duration-1000 ease-out" :class="item.percent < 50 ? 'bg-rose-500' : 'bg-emerald-500'" :style="{ width: `${item.percent}%` }"></div>
                  </div>
               </div>
            </div>
         </NeoCard>

         <!-- Recommendation -->
         <NeoCard variant="depressed" class="p-8 flex flex-col">
            <h3 class="text-[12px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-8">Our Tips</h3>
            
            <div v-if="weakTopics.length > 0" class="flex-1">
                <p class="text-[14px] text-zinc-500 dark:text-zinc-500 mb-6 leading-relaxed font-medium">
                   Based on your answers, we suggest looking at these topics again to boost your confidence:
                </p>
                <div class="flex flex-wrap gap-2 mb-10">
                   <span v-for="topic in weakTopics" :key="topic" class="px-4 py-2 rounded-2xl bg-zinc-900 text-white dark:bg-zinc-100 dark:text-black text-[10px] font-black uppercase tracking-widest shadow-xl">
                      {{ topic }}
                   </span>
                </div>
            </div>
            <div v-else class="flex-1 flex flex-col items-center justify-center text-center">
                <div class="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center text-2xl mb-4">✨</div>
                <p class="text-[14px] text-zinc-400 dark:text-zinc-400 font-medium">Perfect score! Feel free to explore other subjects.</p>
            </div>

            <button @click="retryWeak" class="w-full h-14 rounded-2xl bg-brand text-white font-black uppercase tracking-widest text-[11px] hover:-translate-y-1 transition-all shadow-neo-pill flex items-center justify-center gap-3 mt-auto">
               <span v-if="weakTopics.length > 0">Practice these again</span>
               <span v-else>Keep learning</span>
               →
            </button>
         </NeoCard>
      </div>

      <!-- FOOTER ACTIONS -->
      <div class="flex flex-col sm:flex-row items-center justify-center gap-6">
         <button @click="goHome" class="w-full sm:w-auto px-10 h-14 rounded-2xl border-2 border-zinc-200 dark:border-zinc-800 text-[11px] font-black uppercase tracking-widest text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all">
            Go back to Dashboard
         </button>
         <button @click="retryWeak" class="w-full sm:w-auto px-10 h-14 rounded-2xl bg-zinc-900 dark:bg-white text-white dark:text-black text-[11px] font-black uppercase tracking-widest hover:-translate-y-1 transition-all shadow-2xl">
            Start Over
         </button>
      </div>
    </div>
  </NeoAppShell>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import NeoAppShell from '../components/layout/NeoAppShell.vue';
import NeoCard from '../components/common/NeoCard.vue';

const route = useRoute();
const router = useRouter();

const score = Number(route.query.score || 0);
const total = Number(route.query.total || 0);
const CIRCUMFERENCE = 2 * Math.PI * 100;

const percentage = computed(() => total ? Math.round((score / total) * 100) : 0);
const dashOffset = computed(() => CIRCUMFERENCE - (percentage.value / 100) * CIRCUMFERENCE);

const scoreMessage = computed(() => {
  if (percentage.value >= 70) return 'Excellent!';
  if (percentage.value >= 40) return 'Good Progress';
  return 'Keep Practicing';
});

const breakdownMock = [
  { topic: 'Conceptual Layer', percent: Math.min(100, score > 0 ? Math.round((score/total)*100) + 5 : 0) },
  { topic: 'Data Retrieval', percent: Math.max(0, score > 0 ? Math.round((score/total)*100) - 10 : 0) },
  { topic: 'Logic Synthesis', percent: score > 0 ? Math.round((score/total)*100) : 0 }
];

const weakTopics = computed(() => breakdownMock.filter(i => i.percent < 50).map(i => i.topic));

const goHome = () => router.push('/dashboard');
const retryWeak = () => {
  const quizId = route.query.quizId;
  if (quizId) router.push(`/quiz/${quizId}`);
  else router.push('/subjects');
};

const shareResult = () => {
  if (navigator.share) {
    navigator.share({
      title: 'PrepUp CBT Diagnostic Result',
      text: `My academic integrity rating is ${percentage.value}% on the PrepUp CBT platform.`,
      url: window.location.href
    }).catch(console.error);
  } else {
    navigator.clipboard.writeText(window.location.href);
    alert('Credential link copied to terminal.');
  }
};
</script>

<style scoped>
.animate-in { animation: fadeIn 1s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
</style>
