<template>
  <NeoCard variant="extruded" class="!rounded-[28px] p-8">
    <div class="flex items-center justify-between mb-8 pl-2 border-l-4 border-indigo-500">
      <div>
        <h2 class="text-[12px] font-black text-zinc-900 dark:text-white tracking-[0.4em] uppercase mb-1">Academic Levels</h2>
        <p class="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Pre-set levels for courses</p>
      </div>
    </div>

    <div class="space-y-8">
      <!-- University Levels -->
      <div class="space-y-4">
        <div class="flex items-center gap-3">
          <span class="w-2 h-2 rounded-full bg-indigo-500"></span>
          <h3 class="text-[10px] font-black text-zinc-900 dark:text-white uppercase tracking-widest">University Path</h3>
        </div>
        <div class="flex flex-wrap gap-2">
          <div v-for="l in universityLevels" :key="l" 
            class="px-4 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-xl text-[11px] font-black text-zinc-600 dark:text-zinc-400 uppercase tracking-widest shadow-neo-inner">
            {{ l }}
          </div>
        </div>
      </div>

      <!-- Polytechnic Levels -->
      <div class="space-y-4">
        <div class="flex items-center gap-3">
          <span class="w-2 h-2 rounded-full bg-indigo-500"></span>
          <h3 class="text-[10px] font-black text-zinc-900 dark:text-white uppercase tracking-widest">Polytechnic Path</h3>
        </div>
        <div class="flex flex-wrap gap-2">
          <div v-for="l in polytechnicLevels" :key="l" 
            class="px-4 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-xl text-[11px] font-black text-zinc-600 dark:text-zinc-400 uppercase tracking-widest shadow-neo-inner">
            {{ l }}
          </div>
        </div>
      </div>

      <!-- Entrance Exam Levels -->
      <div class="space-y-4">
        <div class="flex items-center gap-3">
          <span class="w-2 h-2 rounded-full bg-indigo-500"></span>
          <h3 class="text-[10px] font-black text-zinc-900 dark:text-white uppercase tracking-widest">Entrance Exams</h3>
        </div>
        <div class="flex flex-wrap gap-2">
          <div v-for="l in entranceLevels" :key="l" 
            class="px-4 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-xl text-[11px] font-black text-zinc-600 dark:text-zinc-400 uppercase tracking-widest shadow-neo-inner">
            {{ l }}
          </div>
        </div>
      </div>
      
      <div class="mt-8 p-4 bg-indigo-500/5 rounded-2xl border border-indigo-500/10">
        <p class="text-[9px] font-black text-indigo-500 uppercase tracking-[0.2em] leading-relaxed">
          Note: Levels are standard across all departments and cannot be modified individually.
        </p>
      </div>
    </div>
  </NeoCard>
</template>

<script setup>
import NeoCard from '../common/NeoCard.vue';

const universityLevels = ['100L', '200L', '300L', '400L', '500L'];
const polytechnicLevels = ['ND1', 'ND2', 'HND1', 'HND2'];
const entranceLevels = ['JAMB', 'WAEC', 'NECO', 'POST-UTME'];
</script>
