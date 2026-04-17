<template>
  <div 
    @mouseenter="handleHover(true)"
    @mouseleave="handleHover(false)"
    class="fixed bottom-3 md:bottom-6 left-2 right-2 md:left-6 md:top-6 h-14 md:h-auto flex flex-row md:flex-col gap-2 md:gap-6 z-[60] transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
    :class="[isHovered ? 'md:w-[240px]' : 'md:w-[72px]']"
  >
    <nav class="flex-1 bg-zinc-900 dark:bg-black rounded-2xl md:rounded-[32px] md:py-5 px-2 md:px-3 flex flex-row md:flex-col items-center gap-0 sm:gap-1 md:gap-2 shadow-2xl relative border border-white/10 overflow-x-auto overflow-y-hidden md:overflow-visible hide-scrollbar transition-all duration-500">
      
      <!-- Admin Logo Mark -->
      <div class="hidden md:flex text-emerald-400 mb-4 shrink-0 px-2 w-full transition-all" :class="isHovered ? 'justify-start ml-1' : 'justify-center'">
        <ShieldCheck :size="22" :stroke-width="2" />
        <span v-if="isHovered" class="ml-3 text-[13px] font-black uppercase tracking-[0.2em] text-white whitespace-nowrap animate-in fade-in slide-in-from-left-2 duration-500">Admin Panel</span>
      </div>
      
      <!-- Primary Navigation -->
      <div class="flex-1 flex flex-row md:flex-col gap-0.5 md:gap-1.5 w-auto md:w-full items-center justify-around md:justify-start px-1 md:px-0 h-full md:h-auto mt-0 md:mt-2">
        <router-link v-for="item in navItems" :key="item.path" :to="item.path" 
          class="relative w-11 md:w-full h-8 md:h-12 shrink-0 flex items-center rounded-xl md:rounded-[18px] text-zinc-500 hover:text-white transition-all duration-300 group overflow-hidden"
          :class="[isHovered ? 'justify-start px-4' : 'justify-center', {'!text-emerald-400 bg-emerald-500/10': isActive(item.path)}]"
          >
          
          <component :is="item.icon" :size="20" class="shrink-0 z-10 opacity-70 group-hover:opacity-100 transition-opacity" />
          
          <span 
            v-if="isHovered" 
            class="ml-4 text-[12px] font-bold tracking-tight whitespace-nowrap animate-in fade-in slide-in-from-left-3 duration-500"
          >
            {{ item.name }}
          </span>
          
          <span v-if="isActive(item.path)" 
            class="absolute md:bottom-auto bottom-1 bg-emerald-400 rounded-full transition-all duration-500"
            :class="isHovered ? 'left-1 w-1 h-5 rounded-r-lg' : 'md:-left-[1px] md:w-1 w-5 md:h-5 h-1 md:rounded-r-lg'"></span>
          
          <span v-if="!isHovered" class="hidden md:block absolute left-[70px] px-3 py-2 rounded-xl bg-zinc-800 text-white text-[11px] font-bold opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all pointer-events-none whitespace-nowrap shadow-xl border border-white/5 z-50 tracking-wide">
            {{ item.name }}
          </span>
        </router-link>
      </div>
    </nav>
  </div>
</template>

<script setup>
import { ref, markRaw } from 'vue';
import { useRoute } from 'vue-router';
import { 
  BarChart3, 
  Library, 
  Layers, 
  Users,
  ShieldCheck,
  BookOpen,
  PencilLine
} from 'lucide-vue-next';

const route = useRoute();
const isHovered = ref(false);
const emit = defineEmits(['hover']);

const handleHover = (val) => {
  isHovered.value = val;
  emit('hover', val);
};

const navItems = [
  { name: 'Dashboard', path: '/admin', icon: markRaw(BarChart3), exact: true },
  { name: 'Practice Tests', path: '/admin/practice', icon: markRaw(Library) },
  { name: 'Academic Structure', path: '/admin/structure', icon: markRaw(Layers) },
  { name: 'Courses', path: '/admin/courses', icon: markRaw(BookOpen) },
  { name: 'Entrance Exams', path: '/admin/entrance', icon: markRaw(PencilLine) },
  { name: 'Student List', path: '/admin/students', icon: markRaw(Users) }
];

const isActive = (path) => {
  if (path === '/admin') {
    return route.path === '/admin';
  }
  return route.path.startsWith(path);
};
</script>

<style scoped>
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}
</style>
