<template>
  <div 
    @mouseenter="handleHover(true)"
    @mouseleave="handleHover(false)"
    class="fixed bottom-4 left-3 right-3 md:left-6 md:top-6 md:bottom-6 h-16 md:h-auto flex flex-row md:flex-col gap-2 md:gap-6 z-[60] transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
    :class="[isHovered ? 'md:w-[240px]' : 'md:w-[72px]']"
  >
    <!-- Top Pill (Horizontal on mobile) -->
    <nav class="flex-1 bg-[var(--neo-pill-bg)] dark:bg-zinc-400 rounded-[20px] md:rounded-[32px] md:py-5 px-3 md:px-3 flex flex-row md:flex-col items-center gap-0 sm:gap-1 md:gap-2 shadow-neo-pill dark:shadow-[8px_12px_24px_rgba(0,0,0,0.3)] relative border border-white/5 dark:border-black/5 overflow-x-auto overflow-y-hidden md:overflow-visible hide-scrollbar transition-all duration-500" style="scrollbar-width: none;">
      <!-- Logo Mark (Hidden on Mobile) -->
      <div class="hidden md:flex text-[var(--neo-pill-text)] dark:text-black mb-4 shrink-0 px-2 w-full transition-all" :class="isHovered ? 'justify-start ml-1' : 'justify-center'">
        <Sparkles :size="22" :stroke-width="1.5" />
        <span v-if="isHovered" class="ml-3 text-[13px] font-black uppercase tracking-[0.2em] whitespace-nowrap animate-in fade-in slide-in-from-left-2 duration-500">PrepUp</span>
      </div>
      
      <!-- Primary Navigation -->
      <div class="flex-1 flex flex-row md:flex-col gap-1 md:gap-1.5 w-auto md:w-full items-center justify-around md:justify-start px-2 md:px-0 h-full md:h-auto">
        <router-link v-for="item in navItems" :key="item.path" :to="item.path" 
          class="relative w-12 md:w-full h-9 md:h-12 shrink-0 flex items-center rounded-[14px] md:rounded-[18px] text-zinc-500 dark:text-zinc-900/50 hover:text-white dark:hover:text-black transition-all duration-300 group overflow-hidden"
          :class="isHovered ? 'justify-start px-4' : 'justify-center'"
          active-class="!text-white bg-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] dark:!text-black dark:bg-black/15 dark:shadow-[inset_0_1px_2px_rgba(0,0,0,0.2)]">
          
          <!-- Icon Rendering -->
          <component :is="item.icon" :size="20" class="shrink-0 z-10 opacity-70 group-hover:opacity-100 transition-opacity" />
          
          <!-- Page Name Label -->
          <span 
            v-if="isHovered" 
            class="ml-4 text-[12px] font-bold tracking-tight whitespace-nowrap animate-in fade-in slide-in-from-left-3 duration-500"
          >
            {{ item.name }}
          </span>
          
          <!-- Active Indicator -->
          <span v-if="$route.path.startsWith(item.path) || (item.path === '/dashboard' && ($route.path === '/' || $route.path === '/dashboard'))" 
            class="absolute md:bottom-auto bottom-1 bg-white dark:bg-black rounded-full opacity-80 dark:opacity-100 transition-all duration-500"
            :class="isHovered ? 'left-1 w-1 h-5 rounded-r-lg' : 'md:-left-[1px] md:w-1 w-5 md:h-5 h-1 md:rounded-r-lg'"></span>
          
          <!-- Hover Tooltip (Only show when NOT hovered/expanded) -->
          <span v-if="!isHovered" class="hidden md:block absolute left-[70px] px-3 py-2 rounded-xl bg-zinc-800 text-white text-[11px] font-medium opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all pointer-events-none whitespace-nowrap shadow-xl border border-white/5 z-50 tracking-wide">
            {{ item.name }}
          </span>
        </router-link>
      </div>

       <!-- Decorative Label (Hidden on mobile or when expanded) -->
      <div v-if="!isHovered" class="hidden md:block absolute -right-8 top-1/2 -translate-y-1/2 rotate-90 origin-left text-[9px] font-bold tracking-[0.3em] text-black/20 dark:text-black/30 uppercase whitespace-nowrap pointer-events-none transition-opacity duration-300">
        PREPUP NAV
      </div>
    </nav>

    <!-- Bottom Settings Pill -->
    <div class="h-16 w-16 md:w-full md:h-auto md:py-3 shrink-0 bg-[var(--neo-pill-bg)] dark:bg-zinc-400 rounded-[20px] md:rounded-[32px] flex flex-row md:flex-col items-center justify-center shadow-neo-pill dark:shadow-[8px_12px_24px_rgba(0,0,0,0.3)] relative border border-white/5 dark:border-black/5 transition-all">
      <router-link to="/settings" class="w-10 md:w-full h-10 md:h-12 flex items-center rounded-[16px] md:rounded-[18px] text-zinc-500 dark:text-zinc-900/50 hover:text-white dark:hover:text-black hover:bg-white/10 dark:hover:bg-black/10 transition-all duration-300 group relative"
        :class="isHovered ? 'justify-start px-4 mx-2' : 'justify-center'"
        active-class="!text-white bg-white/10 dark:!text-black dark:bg-black/15">
        <Settings :size="20" class="shrink-0 opacity-80 group-hover:opacity-100" />
        <span v-if="isHovered" class="ml-4 text-[12px] font-bold tracking-tight whitespace-nowrap animate-in fade-in slide-in-from-left-3 duration-500">Settings</span>
        <!-- Hover Tooltip -->
        <span v-if="!isHovered" class="hidden md:block absolute left-[64px] px-3 py-2 rounded-xl bg-zinc-800 text-white text-[11px] font-medium opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all pointer-events-none whitespace-nowrap shadow-xl border border-white/5 z-50 tracking-wide">
          Settings
        </span>
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, markRaw } from 'vue';
import { 
  Home, 
  BookOpen, 
  Layers, 
  MessageSquare, 
  Gamepad2, 
  ClipboardList, 
  BarChart3, 
  HelpCircle,
  Settings,
  Sparkles
} from 'lucide-vue-next';

const isHovered = ref(false);
const emit = defineEmits(['hover']);

const handleHover = (val) => {
  isHovered.value = val;
  emit('hover', val);
};

const navItems = [
  { 
    name: 'Dashboard', 
    path: '/dashboard', 
    icon: markRaw(Home)
  },
  { 
    name: 'Courses', 
    path: '/subjects', 
    icon: markRaw(BookOpen)
  },
  { 
    name: 'Flashcards', 
    path: '/flashcards', 
    icon: markRaw(Layers)
  },
  { 
    name: 'Chat', 
    path: '/chat', 
    icon: markRaw(MessageSquare)
  },
  { 
    name: 'Games', 
    path: '/games', 
    icon: markRaw(Gamepad2)
  },
  { 
    name: 'Results', 
    path: '/result', 
    icon: markRaw(ClipboardList)
  },
  { 
    name: 'Progress', 
    path: '/progress', 
    icon: markRaw(BarChart3)
  },
  { 
    name: 'Help', 
    path: '/help', 
    icon: markRaw(HelpCircle)
  }
];
</script>

<style scoped>
/* Ensure physical scrollbars are completely suppressed on mobile horizontal overflow */
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}
</style>
