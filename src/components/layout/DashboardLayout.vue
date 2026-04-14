<template>
  <div class="min-h-screen bg-[#f6f6f4] dark:bg-zinc-950 flex font-['Inter'] transition-colors">
    <Sidebar />
    <main class="flex-1 ml-20 md:ml-64 transition-all duration-300 min-h-screen flex flex-col">
      <header class="h-20 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-slate-200 dark:border-white/5 flex items-center justify-between px-8 sticky top-0 z-40">
        <div>
          <h1 class="text-xl font-bold tracking-tight text-slate-900 dark:text-white capitalize">{{ title }}</h1>
        </div>
        <div class="flex items-center gap-6">
          <ThemeToggle />
          <div class="flex items-center gap-3 border-l pl-6 border-slate-200 dark:border-white/10">
             <div class="flex flex-col items-end">
               <span class="text-[13px] font-bold text-slate-900 dark:text-white">{{ authStore.user?.fullName || 'Student' }}</span>
               <span class="text-[11px] font-medium text-slate-500 uppercase tracking-widest">Premium</span>
             </div>
             <div class="w-10 h-10 rounded-full bg-indigo-500 text-white flex items-center justify-center font-bold text-sm shadow-md shadow-indigo-500/20 ring-2 ring-white dark:ring-zinc-900">
               {{ authStore.user?.fullName?.charAt(0).toUpperCase() || 'U' }}
             </div>
          </div>
        </div>
      </header>
      <div class="p-6 md:p-10 flex-1 overflow-x-hidden relative">
        <slot></slot>
      </div>
    </main>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from '../../store/auth';
import Sidebar from './Sidebar.vue';
import ThemeToggle from '../ThemeToggle.vue';

const route = useRoute();
const authStore = useAuthStore();

const title = computed(() => {
  if (route.meta.title) return route.meta.title;
  return route.name || 'Dashboard';
});
</script>
