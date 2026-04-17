<template>
  <div class="mt-24">
    <!-- Header Section -->
    <div class="flex flex-col lg:flex-row lg:items-end justify-between mb-12 border-b border-zinc-200 dark:border-zinc-800 pb-10 gap-8">
      <div class="space-y-4">
        <div class="flex flex-col sm:flex-row sm:items-center gap-6">
          <h2 class="text-[32px] font-medium text-zinc-800 dark:text-zinc-100 tracking-tighter italic">Student List</h2>
          <button @click="emit('email-blast')" class="w-fit h-12 flex items-center gap-3 px-8 bg-brand hover:brightness-110 text-white rounded-full text-[10px] font-black uppercase tracking-[0.3em] transition-all shadow-neo-pill active:scale-95 shrink-0">
            <Megaphone :size="16" />
            Email All Students
          </button>
        </div>
        <p class="text-zinc-500 dark:text-zinc-500 text-[11px] font-black uppercase tracking-[0.3em] ml-1">View and manage all students in your system.</p>
      </div>
      <div class="w-fit px-8 py-3 bg-[var(--neo-bg)] text-zinc-400 text-[10px] font-black uppercase tracking-[0.3em] rounded-full border border-zinc-200 dark:border-zinc-800 shadow-neo-inner whitespace-nowrap">
        {{ students.length }} Students
      </div>
    </div>

    <!-- Desktop View: High-Fidelity Table -->
    <NeoCard variant="depressed" class="hidden lg:block overflow-hidden mb-16">
      <div class="overflow-x-auto">
        <table class="w-full text-left font-sans text-sm">
          <thead>
            <tr class="bg-zinc-50/50 dark:bg-zinc-800/20 border-b border-zinc-100 dark:border-zinc-800/50">
              <th class="px-10 py-7 text-[9px] font-black uppercase tracking-[0.3em] text-zinc-400">Student</th>
              <th class="px-10 py-7 text-[9px] font-black uppercase tracking-[0.3em] text-zinc-400 text-center">Email</th>
              <th class="px-10 py-7 text-[9px] font-black uppercase tracking-[0.3em] text-zinc-400 text-center">Last Active</th>
              <th class="px-10 py-7 text-[9px] font-black uppercase tracking-[0.3em] text-zinc-400 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-zinc-100 dark:divide-zinc-800/30">
            <tr v-for="student in students" :key="student._id" class="hover:bg-zinc-50/80 dark:hover:bg-zinc-800/10 transition-all group">
              <td class="px-10 py-8">
                <div class="flex items-center gap-6">
                  <div class="w-14 h-14 rounded-[24px] bg-zinc-900 dark:bg-zinc-100 flex items-center justify-center text-white dark:text-zinc-900 font-black text-[13px] uppercase shadow-neo group-hover:scale-105 transition-transform">
                    {{ student.fullName.split(' ').map(n => n[0]).join('').slice(0, 2) }}
                  </div>
                  <div>
                    <p class="font-medium text-zinc-900 dark:text-zinc-100 text-[17px] tracking-tight leading-none mb-1 italic">{{ student.fullName }}</p>
                    <p class="text-[9px] text-zinc-400 font-black uppercase tracking-[0.3em]">Student ID: {{ student._id.slice(-8) }}</p>
                  </div>
                </div>
              </td>
              <td class="px-10 py-8 text-center">
                <div class="inline-flex flex-col items-center">
                  <span class="text-[12px] font-medium text-zinc-600 dark:text-zinc-400 tracking-tight lowercase">{{ student.email }}</span>
                  <div v-if="student.phone" class="text-[9px] font-black text-zinc-300 dark:text-zinc-600 uppercase tracking-widest mt-1">Phone: {{ student.phone }}</div>
                </div>
              </td>
              <td class="px-10 py-8 text-center">
                <div class="inline-flex flex-col items-center">
                  <span class="text-[12px] font-black text-zinc-900 dark:text-zinc-100 tracking-tighter">
                    {{ new Date(student.lastLogin || student.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) }}
                  </span>
                  <div class="flex items-center gap-2 mt-1">
                    <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.3)]"></span>
                    <span class="text-[9px] font-black text-zinc-400 uppercase tracking-[0.2em]">
                      {{ formatTime(student.lastLogin || student.createdAt) }}
                    </span>
                  </div>
                </div>
              </td>
              <td class="px-10 py-8 text-right whitespace-nowrap">
                <div class="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button @click="emit('email-direct', student)" class="w-11 h-11 flex items-center justify-center text-zinc-400 hover:text-brand bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl shadow-neo-pill transition-all" title="Email Student">
                    <Mail :size="18" />
                  </button>
                  <button @click="emit('delete', student._id)" class="w-11 h-11 flex items-center justify-center text-rose-400 hover:bg-rose-500 hover:text-white rounded-2xl shadow-neo-pill transition-all" title="Delete Student">
                    <Trash2 :size="18" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </NeoCard>

    <!-- Mobile/Tablet View: Student Cards -->
    <div class="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-8 mb-16">
      <div v-for="student in students" :key="student._id" class="group">
        <NeoCard variant="hoverable" class="p-8">
          <div class="flex items-center gap-5 mb-8">
            <div class="w-14 h-14 rounded-[22px] bg-zinc-900 dark:bg-zinc-100 flex items-center justify-center text-white dark:text-zinc-900 font-black text-sm uppercase shadow-neo">
              {{ student.fullName.split(' ').map(n => n[0]).join('').slice(0, 2) }}
            </div>
            <div class="min-w-0">
              <h3 class="font-medium text-zinc-900 dark:text-zinc-100 text-lg tracking-tight truncate italic">{{ student.fullName }}</h3>
              <p class="text-[9px] text-zinc-400 font-black uppercase tracking-widest">Student ID {{ student._id.slice(-8) }}</p>
            </div>
          </div>

          <div class="space-y-4 mb-10">
            <div class="flex items-center justify-between py-4 border-b border-zinc-100 dark:border-zinc-800/50">
              <span class="text-[9px] font-black text-zinc-400 uppercase tracking-widest">Email</span>
              <span class="text-[12px] font-medium text-zinc-600 dark:text-zinc-300 truncate ml-4 lowercase">{{ student.email }}</span>
            </div>
            <div class="flex items-center justify-between py-4 border-b border-zinc-100 dark:border-zinc-800/50">
              <span class="text-[9px] font-black text-zinc-400 uppercase tracking-widest">Last Active</span>
              <div class="text-right">
                <p class="text-[11px] font-black text-zinc-900 dark:text-white tracking-widest">{{ new Date(student.lastLogin || student.createdAt).toLocaleDateString() }}</p>
                <p class="text-[9px] font-black text-brand uppercase tracking-widest mt-1">{{ formatTime(student.lastLogin || student.createdAt) }}</p>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <button @click="emit('email-direct', student)" class="flex items-center justify-center gap-3 h-12 bg-[var(--neo-bg)] text-zinc-900 dark:text-zinc-100 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-zinc-200 dark:border-zinc-800 hover:border-brand hover:text-brand transition-all shadow-neo-inner">
              <Mail :size="16" />
              Email
            </button>
            <button @click="emit('delete', student._id)" class="flex items-center justify-center gap-3 h-12 bg-rose-50 dark:bg-rose-500/5 text-rose-500 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-rose-100 dark:rose-500/10 hover:bg-rose-500 hover:text-white transition-all">
              <Trash2 :size="16" />
              Delete
            </button>
          </div>
        </NeoCard>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Megaphone, Mail, Trash2 } from 'lucide-vue-next';
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
