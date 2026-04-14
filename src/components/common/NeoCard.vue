<template>
  <div 
    :class="[
      'rounded-[28px] transition-all duration-500 relative bg-[var(--neo-surface)]',
      variant === 'depressed' ? 'shadow-neo-inner' : 'shadow-neo',
      props.class
    ]"
    :style="bgStyle"
  >
    <!-- Optional Glass overlay -->
    <div v-if="glass" class="absolute inset-0 bg-white/10 dark:bg-black/10 backdrop-blur-md rounded-[28px] pointer-events-none"></div>
    
    <!-- Content Slot -->
    <div class="relative z-10 w-full h-full">
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  variant: {
    type: String,
    default: 'extruded', // 'extruded', 'depressed'
  },
  glass: {
    type: Boolean,
    default: false
  },
  class: {
    type: String,
    default: ''
  }
});

const bgStyle = computed(() => {
  if (props.variant === 'extruded') {
    return {
      background: 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 40%, rgba(0,0,0,0) 60%, rgba(0,0,0,0.02) 100%), var(--neo-surface)'
    };
  } else if (props.variant === 'depressed') {
     return {
      background: 'linear-gradient(135deg, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0) 40%, rgba(255,255,255,0) 60%, rgba(255,255,255,0.2) 100%), var(--neo-surface)'
    };
  }
  return {};
});
</script>
