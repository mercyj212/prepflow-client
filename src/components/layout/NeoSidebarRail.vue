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
          
          <!-- Icon Rendering -->
          <div v-if="item.svg" v-html="item.svg" class="w-5 h-5 z-10 opacity-70 group-hover:opacity-100 transition-opacity"></div>
          <span v-else class="text-[19px] md:text-xl z-10 font-normal">{{ item.icon }}</span>
          
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
  { 
    name: 'Dashboard', 
    path: '/dashboard', 
    svg: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>`
  },
  { 
    name: 'Courses', 
    path: '/subjects', 
    svg: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>`
  },
  { 
    name: 'Flashcards', 
    path: '/flashcards', 
    svg: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>`
  },
  { 
    name: 'Chat', 
    path: '/chat', 
    svg: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path></svg>`
  },
  { 
    name: 'Games', 
    path: '/games', 
    svg: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z"></path></svg>`
  },
  { 
    name: 'Results', 
    path: '/result', 
    svg: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"></path></svg>`
  },
  { 
    name: 'Progress', 
    path: '/progress', 
    svg: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>`
  },
  { 
    name: 'Notifications', 
    path: '/notifications', 
    svg: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>`
  },
  { name: 'Help', path: '/help', icon: '?' }
];
</script>

<style scoped>
/* Ensure physical scrollbars are completely suppressed on mobile horizontal overflow */
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}
</style>
