<template>
  <div 
    class="flex items-end group cursor-pointer transition-all duration-300 active:scale-95"
    :class="[gapClass, customClass]"
    @click="$router.push('/')"
  >
    <span 
      class="font-black tracking-tighter text-zinc-900 dark:text-white leading-none capitalize"
      :class="primarySizeClass"
    >
      PrepUp
    </span>
    <span 
      class="font-bold uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500"
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
    case 'sm': return 'text-[8px]';
    case 'lg': return 'text-[12px]';
    case 'xl': return 'text-[14px] lg:text-[16px]';
    default: return 'text-[10px]';
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
