<template>
  <button 
    @click="toggleTheme" 
    class="p-2 rounded-lg bg-zinc-100 text-zinc-600 hover:bg-zinc-200 hover:text-black dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700 dark:hover:text-white transition-colors border border-transparent dark:border-zinc-700 shadow-sm"
    aria-label="Toggle Dark Mode"
  >
    <!-- Sun icon for Dark Mode (to switch to light) -->
    <Sun v-if="isDark" :size="20" />
    <!-- Moon icon for Light Mode (to switch to dark) -->
    <Moon v-else :size="20" />
  </button>
</template>

<script setup>
import { Sun, Moon } from 'lucide-vue-next';
import { useTheme } from '../composables/useTheme';

const { isDark, toggleTheme } = useTheme();
</script>
