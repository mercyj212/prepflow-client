<template>
  <div class="mt-24">
    <!-- Header Section -->
    <div class="flex flex-col lg:flex-row lg:items-end justify-between mb-12 border-b border-slate-200 dark:border-zinc-800 pb-10 gap-8">
      <div class="space-y-4">
        <div class="flex flex-col sm:flex-row sm:items-center gap-6">
          <h2 class="text-[32px] font-medium text-slate-800 dark:text-zinc-100 tracking-tighter italic">Scholarly Registry</h2>
          <button @click="emit('email-blast')" class="w-fit h-12 flex items-center gap-3 px-8 bg-brand hover:brightness-110 text-white rounded-full text-[10px] font-black uppercase tracking-[0.3em] transition-all shadow-neo-pill active:scale-95 shrink-0">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"/></svg>
            Global Broadcast System
          </button>
        </div>
        <p class="text-slate-500 dark:text-zinc-500 text-[11px] font-black uppercase tracking-[0.3em] ml-1">Observing individual progression nodes within the synthesis collective.</p>
      </div>
      <div class="w-fit px-8 py-3 bg-[var(--neo-bg)] text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] rounded-full border border-slate-200 dark:border-zinc-800 shadow-neo-inner whitespace-nowrap">
        {{ students.length }} Verified Entities
      </div>
    </div>

    <!-- Desktop View: High-Fidelity Table -->
    <NeoCard variant="depressed" class="hidden lg:block overflow-hidden mb-16">
      <div class="overflow-x-auto">
        <table class="w-full text-left font-sans text-sm">
          <thead>
            <tr class="bg-slate-50/50 dark:bg-zinc-800/20 border-b border-slate-100 dark:border-zinc-800/50">
              <th class="px-10 py-7 text-[9px] font-black uppercase tracking-[0.3em] text-slate-400">Entity Matrix</th>
              <th class="px-10 py-7 text-[9px] font-black uppercase tracking-[0.3em] text-slate-400 text-center">Protocol Link</th>
              <th class="px-10 py-7 text-[9px] font-black uppercase tracking-[0.3em] text-slate-400 text-center">Last Synced</th>
              <th class="px-10 py-7 text-[9px] font-black uppercase tracking-[0.3em] text-slate-400 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 dark:divide-zinc-800/30">
            <tr v-for="student in students" :key="student._id" class="hover:bg-slate-50/80 dark:hover:bg-zinc-800/10 transition-all group">
              <td class="px-10 py-8">
                <div class="flex items-center gap-6">
                  <div class="w-14 h-14 rounded-[24px] bg-zinc-900 dark:bg-zinc-100 flex items-center justify-center text-white dark:text-zinc-900 font-black text-[13px] uppercase shadow-neo group-hover:scale-105 transition-transform">
                    {{ student.fullName.split(' ').map(n => n[0]).join('').slice(0, 2) }}
                  </div>
                  <div>
                    <p class="font-medium text-slate-900 dark:text-zinc-100 text-[17px] tracking-tight leading-none mb-1 italic">{{ student.fullName }}</p>
                    <p class="text-[9px] text-slate-400 font-black uppercase tracking-[0.3em]">Signature Node: {{ student._id.slice(-8) }}</p>
                  </div>
                </div>
              </td>
              <td class="px-10 py-8 text-center">
                <div class="inline-flex flex-col items-center">
                  <span class="text-[12px] font-medium text-slate-600 dark:text-zinc-400 tracking-tight lowercase">{{ student.email }}</span>
                  <div v-if="student.phone" class="text-[9px] font-black text-slate-300 dark:text-zinc-600 uppercase tracking-widest mt-1">Uplink: {{ student.phone }}</div>
                </div>
              </td>
              <td class="px-10 py-8 text-center">
                <div class="inline-flex flex-col items-center">
                  <span class="text-[12px] font-black text-slate-900 dark:text-zinc-100 tracking-tighter">
                    {{ new Date(student.lastLogin || student.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) }}
                  </span>
                  <div class="flex items-center gap-2 mt-1">
                    <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.3)]"></span>
                    <span class="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">
                      {{ formatTime(student.lastLogin || student.createdAt) }}
                    </span>
                  </div>
                </div>
              </td>
              <td class="px-10 py-8 text-right whitespace-nowrap">
                <div class="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button @click="emit('email-direct', student)" class="w-11 h-11 flex items-center justify-center text-slate-400 hover:text-brand bg-slate-50 dark:bg-zinc-800/50 rounded-2xl shadow-neo-pill transition-all" title="Direct Transmission">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                  </button>
                  <button @click="emit('delete', student._id)" class="w-11 h-11 flex items-center justify-center text-rose-400 hover:bg-rose-500 hover:text-white rounded-2xl shadow-neo-pill transition-all" title="Purge Record">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </NeoCard>

    <!-- Mobile/Tablet View: Protocol Cards -->
    <div class="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-8 mb-16">
      <div v-for="student in students" :key="student._id" class="group">
        <NeoCard variant="hoverable" class="p-8">
          <div class="flex items-center gap-5 mb-8">
            <div class="w-14 h-14 rounded-[22px] bg-zinc-900 dark:bg-zinc-100 flex items-center justify-center text-white dark:text-zinc-900 font-black text-sm uppercase shadow-neo">
              {{ student.fullName.split(' ').map(n => n[0]).join('').slice(0, 2) }}
            </div>
            <div class="min-w-0">
              <h3 class="font-medium text-slate-900 dark:text-zinc-100 text-lg tracking-tight truncate italic">{{ student.fullName }}</h3>
              <p class="text-[9px] text-slate-400 font-black uppercase tracking-widest">Node {{ student._id.slice(-8) }}</p>
            </div>
          </div>

          <div class="space-y-4 mb-10">
            <div class="flex items-center justify-between py-4 border-b border-slate-100 dark:border-zinc-800/50">
              <span class="text-[9px] font-black text-slate-400 uppercase tracking-widest">Protocol</span>
              <span class="text-[12px] font-medium text-slate-600 dark:text-zinc-300 truncate ml-4 lowercase">{{ student.email }}</span>
            </div>
            <div class="flex items-center justify-between py-4 border-b border-slate-100 dark:border-zinc-800/50">
              <span class="text-[9px] font-black text-slate-400 uppercase tracking-widest">Last Sync</span>
              <div class="text-right">
                <p class="text-[11px] font-black text-slate-900 dark:text-white tracking-widest">{{ new Date(student.lastLogin || student.createdAt).toLocaleDateString() }}</p>
                <p class="text-[9px] font-black text-brand uppercase tracking-widest mt-1">{{ formatTime(student.lastLogin || student.createdAt) }}</p>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <button @click="emit('email-direct', student)" class="flex items-center justify-center gap-3 h-12 bg-[var(--neo-bg)] text-slate-900 dark:text-zinc-100 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-slate-200 dark:border-zinc-800 hover:border-brand hover:text-brand transition-all shadow-neo-inner">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
              Direct
            </button>
            <button @click="emit('delete', student._id)" class="flex items-center justify-center gap-3 h-12 bg-rose-50 dark:bg-rose-500/5 text-rose-500 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-rose-100 dark:border-rose-500/10 hover:bg-rose-500 hover:text-white transition-all">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
              Purge
            </button>
          </div>
        </NeoCard>
      </div>
    </div>
  </div>
</template>

<script setup>
import NeoCard from '../common/NeoCard.vue';
const props = defineProps({
  students: Array
});

const emit = defineEmits(['email-blast', 'email-direct', 'delete']);

const formatTime = (date) => {
  return new Date(date).toLocaleTimeString(undefined, { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true 
  });
};
</script>
