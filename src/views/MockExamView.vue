<template>
  <NeoAppShell>
    <div class="h-full flex px-2 sm:px-4 lg:px-8 py-4 gap-8">
      <section class="flex-1 flex flex-col min-w-0 h-full overflow-y-auto pb-10 custom-scrollbar pr-4 pt-1">
        <header class="mb-12">
          <h1 class="text-[34px] font-medium text-slate-800 dark:text-zinc-100 tracking-tight mb-1">Mock Exams</h1>
          <p class="text-[15px] font-normal text-slate-500 dark:text-zinc-500">Scheduled full-length simulation exams.</p>
        </header>

        <div class="flex-1 flex items-center justify-center">
            <div class="flex flex-col items-center justify-center opacity-60 text-center px-8 max-w-md">
                <span class="text-6xl mb-6">⚑</span>
                <h2 class="text-xl font-medium text-slate-800 dark:text-zinc-200 mb-2">No Mock Exams Scheduled</h2>
                <p class="text-[14px] font-normal text-slate-500">Your upcoming official mock exams will appear here. Keep practicing topics to prepare.</p>
            </div>
        </div>
      </section>
    </div>
  </NeoAppShell>
</template>

<script setup>
import NeoAppShell from '../components/layout/NeoAppShell.vue';
</script>
