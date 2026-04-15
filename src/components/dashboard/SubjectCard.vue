<template>
  <article class="flat-card p-5 flex flex-col gap-5 bg-white dark:bg-zinc-900 group hover:bg-zinc-50/70 dark:hover:bg-zinc-900 transition-colors">
    <div class="flex items-start justify-between gap-4">
      <div class="flex items-start gap-4">
        <div class="w-12 h-12 rounded-[10px] bg-zinc-100 dark:bg-zinc-800 border-[0.5px] border-border-light dark:border-border-dark flex items-center justify-center text-zinc-700 dark:text-zinc-200">
          <span class="text-[20px] leading-none">{{ icon }}</span>
        </div>
        <div>
          <h3 class="text-[16px] font-medium text-zinc-900 dark:text-white">{{ title }}</h3>
          <p class="text-[13px] font-normal text-zinc-500 dark:text-zinc-400">{{ examType }}</p>
        </div>
      </div>
      <span class="text-[13px] font-medium text-zinc-700 dark:text-zinc-300">{{ progressPercent }}%</span>
    </div>

    <div class="space-y-4">
      <div class="h-1 rounded-full bg-zinc-200 dark:bg-zinc-800 overflow-hidden">
        <div class="h-full rounded-full bg-zinc-700 dark:bg-zinc-200 transition-all duration-500" :style="{ width: `${progressPercent}%` }"></div>
      </div>
      
      <button
        @click="$emit('continue')"
        class="w-full rounded-lg bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-[14px] font-medium py-2.5 border-[0.5px] border-zinc-900 dark:border-zinc-100 hover:opacity-90 active:scale-[0.99] transition-all"
        type="button"
      >
        Continue
      </button>
    </div>
  </article>
</template>

<script setup>
defineEmits(['continue']);

defineProps({
  icon: { type: String, default: '📘' },
  title: { type: String, required: true },
  examType: { type: String, default: 'JAMB' },
  progressPercent: { type: Number, default: 0 }
});
</script>

