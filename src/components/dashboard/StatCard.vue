<template>
  <article class="flat-card p-5 bg-white/90 dark:bg-zinc-900">
    <div class="flex items-center justify-between mb-3">
      <p class="text-[12px] font-normal text-slate-500 dark:text-zinc-400 uppercase tracking-wide">{{ label }}</p>
      <div class="w-8 h-[1px] bg-slate-200 dark:bg-zinc-700"></div>
    </div>
    <p class="text-[30px] leading-none font-medium text-slate-900 dark:text-white">
      {{ value }}
      <span v-if="suffix" class="text-[14px] font-normal text-slate-500 dark:text-zinc-400 ml-1">{{ suffix }}</span>
    </p>
  </article>
</template>

<script setup>
defineProps({
  label: { type: String, required: true },
  value: { type: [String, Number], required: true },
  suffix: { type: String, default: '' }
});
</script>

