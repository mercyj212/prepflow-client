<template>
  <NeoAppShell>
    <div class="h-full flex px-2 sm:px-4 lg:px-8 py-4 gap-8">
      <section class="flex-1 flex flex-col min-w-0 h-full overflow-y-auto pb-10 custom-scrollbar pr-4 pt-1">
        <header class="mb-12">
          <h1 class="text-[34px] font-medium text-zinc-800 dark:text-zinc-100 tracking-tight mb-1">Progress & Mastery</h1>
          <p class="text-[15px] font-normal text-zinc-500 dark:text-zinc-500">Analyze your historical performance matrices.</p>
        </header>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
           <NeoCard variant="extruded" class="!rounded-[28px] p-8 h-64 flex flex-col justify-center items-center opacity-50 relative overflow-hidden">
             <span class="text-3xl mb-4">📈</span>
             <p class="text-sm font-medium text-zinc-500 uppercase tracking-widest">Performance Over Time</p>
             <div class="absolute bottom-0 w-full h-1/2 bg-gradient-to-t from-zinc-200 dark:from-zinc-800 to-transparent"></div>
           </NeoCard>
           
           <NeoCard variant="extruded" class="!rounded-[28px] p-8 h-64 flex flex-col justify-center items-center opacity-50 relative overflow-hidden">
             <span class="text-3xl mb-4">🎯</span>
             <p class="text-sm font-medium text-zinc-500 uppercase tracking-widest">Subject Mastery</p>
             <div class="absolute bottom-0 w-full h-1/2 bg-gradient-to-t from-zinc-200 dark:from-zinc-800 to-transparent"></div>
           </NeoCard>
           
           <NeoCard variant="depressed" class="!rounded-[28px] p-8 h-48 md:col-span-2 flex flex-col justify-center items-center opacity-50 relative border shadow-inner">
             <span class="text-3xl mb-4">🔬</span>
             <p class="text-sm font-medium text-zinc-500 uppercase tracking-widest">Weakness Analysis</p>
           </NeoCard>
        </div>
      </section>
    </div>
  </NeoAppShell>
</template>

<script setup>
import NeoAppShell from '../components/layout/NeoAppShell.vue';
import NeoCard from '../components/common/NeoCard.vue';
</script>
