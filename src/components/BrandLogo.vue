<template>
  <div 
    class="flex items-end group cursor-pointer transition-all duration-300 active:scale-95"
    :class="[gapClass, customClass]"
    @click="$router.push('/')"
  >
    <span class="mr-2 text-brand drop-shadow-[0_0_8px_rgba(20,184,166,0.3)]" :class="primarySizeClass">✳</span>
    <span 
      class="font-black tracking-tighter text-black dark:text-white leading-none capitalize"
      :class="primarySizeClass"
    >
      PrepUp
    </span>
    <span 
      class="font-bold uppercase tracking-[0.2em] text-zinc-400"
      :class="[secondarySizeClass, mbClass]"
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
  }
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
