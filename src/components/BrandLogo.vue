<template>
  <div 
    class="flex items-end group cursor-pointer transition-all duration-300 active:scale-95"
    :class="[gapClass, customClass]"
    @click="$router.push('/')"
  >
    <span 
      class="font-black tracking-tight leading-none capitalize transition-colors duration-500"
      :class="[primarySizeClass, logoColorClass]"
    >
      PrepUp
    </span>
    <span 
      class="font-black uppercase tracking-[0.3em] transition-colors duration-500"
      :class="[secondarySizeClass, mbClass, subColorClass]"
    >
      CBT
    </span>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  size: {
    type: String,
    default: 'md' // sm, md, lg, xl
  },
  customClass: {
    type: String,
    default: ''
  },
  // 'light' (on light bg -> dark text), 'dark' (on dark bg -> white text), 'auto' (theme-aware)
  theme: {
    type: String,
    default: 'auto'
  },
  // Deprecated prop compatibility
  isLight: {
    type: Boolean,
    default: null
  }
});

const calculatedTheme = computed(() => {
  if (props.isLight !== null) return props.isLight ? 'light' : 'dark';
  return props.theme;
});

const logoColorClass = computed(() => {
  if (calculatedTheme.value === 'light') return 'text-zinc-950';
  if (calculatedTheme.value === 'dark') return 'text-white';
  return 'text-zinc-900 dark:text-white';
});

const subColorClass = computed(() => {
  if (calculatedTheme.value === 'light') return 'text-zinc-900/40';
  if (calculatedTheme.value === 'dark') return 'text-zinc-400';
  return 'text-zinc-500 dark:text-zinc-400';
});

const primarySizeClass = computed(() => {
  switch (props.size) {
    case 'sm': return 'text-xl';
    case 'lg': return 'text-3xl';
    case 'xl': return 'text-4xl lg:text-5xl';
    default: return 'text-2xl';
  }
});

const secondarySizeClass = computed(() => {
  switch (props.size) {
    case 'sm': return 'text-[7px]';
    case 'lg': return 'text-[10px]';
    case 'xl': return 'text-[12px] lg:text-[14px]';
    default: return 'text-[9px]';
  }
});

const gapClass = computed(() => {
  return props.size === 'xl' ? 'gap-3' : 'gap-1.5';
});

const mbClass = computed(() => {
  switch (props.size) {
    case 'sm': return 'mb-0';
    case 'lg': return 'mb-1';
    case 'xl': return 'mb-1.5 lg:mb-2';
    default: return 'mb-0.5';
  }
});
</script>
