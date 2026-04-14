<template>
  <div class="fixed bottom-4 left-3 right-3 md:left-6 md:top-6 md:bottom-6 md:w-[72px] h-16 md:h-auto flex flex-row md:flex-col gap-2 md:gap-6 z-50">
    <!-- Top Pill (Horizontal on mobile) -->
    <nav class="flex-1 bg-[var(--neo-pill-bg)] dark:bg-zinc-400 rounded-[20px] md:rounded-[36px] md:py-4 px-2 md:px-0 flex flex-row md:flex-col items-center gap-0 sm:gap-1 md:gap-2 shadow-neo-pill dark:shadow-[8px_12px_24px_rgba(0,0,0,0.3)] relative border border-white/5 dark:border-black/5 overflow-x-auto overflow-y-hidden md:overflow-visible hide-scrollbar" style="scrollbar-width: none;">
      <!-- Logo Mark (Hidden on Mobile) -->
      <div class="hidden md:block text-[var(--neo-pill-text)] dark:text-black mb-2 shrink-0 text-2xl font-light leading-none">
        ✳
      </div>
      
      <!-- Primary Navigation -->
      <div class="flex-1 flex flex-row md:flex-col gap-1 md:gap-1.5 w-auto md:w-full items-center justify-around md:justify-start px-2 md:px-0 h-full md:h-auto">
        <router-link v-for="item in navItems" :key="item.path" :to="item.path" 
          class="relative w-12 h-9 md:h-9 shrink-0 flex items-center justify-center rounded-[14px] md:rounded-[16px] text-zinc-500 dark:text-zinc-900/50 hover:text-white dark:hover:text-black transition-all duration-300 group"
          active-class="!text-white bg-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] dark:!text-black dark:bg-black/15 dark:shadow-[inset_0_1px_2px_rgba(0,0,0,0.2)]">
          <!-- Text sizes differ slightly for mobile tight spaces -->
          <span class="text-[19px] md:text-xl z-10 font-normal material-symbols">{{ item.icon }}</span>
          
          <!-- Active Indicator -->
          <span v-if="$route.path.startsWith(item.path) || (item.path === '/dashboard' && $route.path === '/')" class="absolute md:-left-[1px] md:bottom-auto bottom-1 md:w-1 w-5 md:h-5 h-1 bg-white dark:bg-black rounded-full md:rounded-r-lg opacity-80 dark:opacity-100"></span>
          
          <!-- Hover Tooltip (Hidden on touch devices/mobile) -->
          <span class="hidden md:block absolute left-[70px] px-3 py-2 rounded-xl bg-zinc-800 text-white text-[11px] font-medium opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all pointer-events-none whitespace-nowrap shadow-xl border border-white/5 z-50 tracking-wide">
            {{ item.name }}
          </span>
        </router-link>
      </div>

       <!-- Decorative Label (Hidden on mobile) -->
      <div class="hidden md:block absolute -right-8 top-1/2 -translate-y-1/2 rotate-90 origin-left text-[9px] font-bold tracking-[0.3em] text-black/20 dark:text-black/30 uppercase whitespace-nowrap pointer-events-none">
        PREPUP NAV
      </div>
    </nav>

    <!-- Bottom Settings Pill -->
    <div class="h-16 w-16 md:w-full md:h-14 shrink-0 bg-[var(--neo-pill-bg)] dark:bg-zinc-400 rounded-[20px] md:rounded-[36px] flex flex-row md:flex-col items-center justify-center shadow-neo-pill dark:shadow-[8px_12px_24px_rgba(0,0,0,0.3)] relative border border-white/5 dark:border-black/5">
      <router-link to="/settings" class="w-10 md:w-11 h-10 md:h-11 flex items-center justify-center rounded-[16px] md:rounded-[18px] text-zinc-500 dark:text-zinc-900/50 hover:text-white dark:hover:text-black hover:bg-white/10 dark:hover:bg-black/10 transition-all duration-300 group relative"
        active-class="!text-white bg-white/10 dark:!text-black dark:bg-black/15">
        <span class="text-[19px] md:text-xl font-normal opacity-80 group-hover:opacity-100">⚙️</span>
        <!-- Hover Tooltip -->
        <span class="hidden md:block absolute left-[64px] px-3 py-2 rounded-xl bg-zinc-800 text-white text-[11px] font-medium opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all pointer-events-none whitespace-nowrap shadow-xl border border-white/5 z-50 tracking-wide">
          Settings
        </span>
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

// Exhaustive minimalist icon set mapping (Core + Student + System)
const navItems = [
  { name: 'Dashboard', path: '/dashboard', icon: '⌂' },
  { name: 'Courses', path: '/subjects', icon: '☰' },
  { name: 'Flashcards', path: '/flashcards', icon: '✧' },
  { name: 'Practice Quiz', path: '/practice', icon: '⌬' },
  { name: 'Mock Exam', path: '/mock-exam', icon: '⚑' },
  { name: 'Results', path: '/result', icon: '★' },
  { name: 'Progress', path: '/progress', icon: '◎' },
  { name: 'Notifications', path: '/notifications', icon: '⚂' },
  { name: 'Help', path: '/help', icon: '?' }
];
</script>

<style scoped>
/* Ensure physical scrollbars are completely suppressed on mobile horizontal overflow */
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}
</style>
