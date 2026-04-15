<template>
  <div class="bg-white dark:bg-zinc-900 rounded-[24px] border border-zinc-200 dark:border-white/5 p-6 sm:p-8 shadow-sm transition-colors">
    <div v-if="title" class="flex items-center justify-between mb-6">
      <h2 class="text-xl font-bold tracking-tight text-zinc-900 dark:text-white">{{ title }}</h2>
      <slot name="action"></slot>
    </div>
    <slot></slot>
  </div>
</template>

<script setup>
defineProps({
  title: String
});
</script>
