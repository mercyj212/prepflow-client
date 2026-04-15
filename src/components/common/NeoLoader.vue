<template>
  <div class="flex flex-col items-center justify-center gap-3 py-16">
    <!-- Three staggered pulsing dots -->
    <div class="flex items-center gap-2">
      <span class="neo-dot" style="animation-delay: 0ms"></span>
      <span class="neo-dot" style="animation-delay: 150ms"></span>
      <span class="neo-dot" style="animation-delay: 300ms"></span>
    </div>
    <p v-if="label" class="text-[11px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">{{ label }}</p>
  </div>
</template>

<script setup>
defineProps({
  label: {
    type: String,
    default: ''
  }
});
</script>

<style scoped>
.neo-dot {
  display: inline-block;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background-color: currentColor;
  color: var(--neo-pill-bg, #94a3b8);
  opacity: 0.3;
  animation: neo-pulse 1.2s ease-in-out infinite;
}

@keyframes neo-pulse {
  0%, 100% { opacity: 0.2; transform: scale(0.85); }
  50%       { opacity: 1;   transform: scale(1.15); }
}
</style>
