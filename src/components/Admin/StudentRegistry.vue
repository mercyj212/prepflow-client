<template>
  <div class="mt-20">
    <div class="flex items-center justify-between mb-8 border-b border-zinc-200 dark:border-zinc-800 pb-8 transition-colors">
      <div>
        <div class="flex items-center gap-6">
          <h2 class="text-3xl font-black text-zinc-900 dark:text-white tracking-tighter uppercase font-sans">Scholarly Registry</h2>
          <button @click="emit('email-blast')" class="flex items-center gap-3 px-6 py-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all shadow-lg shadow-indigo-500/20 active:scale-95">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"/></svg>
            Fire Global Dispatch 📣
          </button>
        </div>
        <p class="text-zinc-500 dark:text-zinc-400 text-[11px] font-bold uppercase tracking-widest mt-2 ml-1">Monitoring platform engagement & enrollment</p>
      </div>
      <div class="px-6 py-3 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[11px] font-black uppercase tracking-[0.25em] rounded-2xl border border-indigo-100 dark:border-indigo-500/20 shadow-sm">
        {{ students.length }} Verified Scholars
      </div>
    </div>

    <div class="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[32px] overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,0,0,0.05)] dark:shadow-none transition-colors mb-12">
      <div class="overflow-x-auto">
        <table class="w-full text-left font-sans">
          <thead>
            <tr class="bg-zinc-50/50 dark:bg-zinc-800/50 border-b border-zinc-100 dark:border-zinc-800/50">
              <th class="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Student Profile</th>
              <th class="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Connectivity</th>
              <th class="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 text-center">Last Engagement</th>
              <th class="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 text-center">Signature</th>
              <th class="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-zinc-100 dark:divide-zinc-800/50">
            <tr v-for="student in students" :key="student._id" class="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition-all group">
              <td class="px-10 py-8">
                <div class="flex items-center gap-5">
                  <div class="w-14 h-14 rounded-[22px] bg-zinc-900 dark:bg-white flex items-center justify-center text-white dark:text-zinc-900 font-black text-sm uppercase shadow-2xl shadow-zinc-900/10 dark:shadow-none group-hover:scale-105 transition-transform">
                    {{ student.fullName.split(' ').map(n => n[0]).join('').slice(0, 2) }}
                  </div>
                  <div>
                    <p class="font-black text-zinc-900 dark:text-white text-lg tracking-tighter leading-none">{{ student.fullName }}</p>
                    <p class="text-[9px] text-zinc-400 font-black uppercase tracking-[0.3em] mt-2">UUID: {{ student._id.slice(-8) }}</p>
                  </div>
                </div>
              </td>
              <td class="px-10 py-8">
                <div class="space-y-2">
                  <div class="flex items-center gap-3 group/text">
                    <div class="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.4)]"></div>
                    <span class="text-xs font-bold text-zinc-600 dark:text-zinc-400 lowercase tracking-tight">{{ student.email }}</span>
                  </div>
                  <div v-if="student.phone" class="flex items-center gap-3">
                    <span class="text-[10px] font-black text-zinc-300 dark:text-zinc-600 uppercase tracking-widest">{{ student.phone }}</span>
                  </div>
                </div>
              </td>
              <td class="px-10 py-8 text-center">
                <div class="inline-flex flex-col items-center">
                  <span class="text-[12px] font-black text-zinc-900 dark:text-zinc-100 tracking-tighter">
                    {{ new Date(student.lastLogin || student.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) }}
                  </span>
                  <span class="text-[9px] font-black text-indigo-500 uppercase tracking-[0.2em] mt-1">
                    {{ formatTime(student.lastLogin || student.createdAt) }}
                  </span>
                </div>
              </td>
              <td class="px-10 py-8 text-center">
                <div class="px-3 py-1.5 bg-zinc-100 dark:bg-zinc-800/50 text-zinc-600 dark:text-zinc-400 text-[9px] font-black uppercase tracking-[0.2em] rounded-xl border border-zinc-200/50 dark:border-zinc-700/50 inline-block">
                  {{ student.deviceInfo?.split(' ')[0] || 'Web-Node' }}
                </div>
              </td>
              <td class="px-10 py-8 text-right">
                <div class="flex items-center justify-end gap-3">
                  <button @click="emit('email-direct', student)" class="p-3 text-zinc-400 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 rounded-[18px] transition-all" title="Secure Message">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                  </button>
                  <button @click="emit('delete', student._id)" class="p-3 text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-[18px] transition-all" title="Liquidate Profile">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
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
