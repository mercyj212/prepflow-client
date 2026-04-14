<template>
  <NeoAppShell>
    <div class="h-full flex px-2 sm:px-4 lg:px-8 py-4 gap-8">
      <section class="flex-1 flex flex-col min-w-0 h-full overflow-y-auto pb-10 custom-scrollbar pr-4 pt-1">
        <header class="mb-12">
          <h1 class="text-[34px] font-medium text-slate-800 dark:text-zinc-100 tracking-tight mb-1">Flashcards Directory</h1>
          <p class="text-[15px] font-normal text-slate-500 dark:text-zinc-500">Select a course to review your flashcard deck.</p>
        </header>

        <!-- Redirecting user to courses or showing available courses -->
        <div class="flex-1 flex flex-col items-center justify-center text-center px-4">
             <div class="w-24 h-24 rounded-[24px] bg-slate-100 dark:bg-zinc-800 border border-slate-200 dark:border-white/5 flex items-center justify-center text-4xl mb-6 shadow-neo-inner">
               ✧
             </div>
             <h2 class="text-2xl font-medium text-slate-800 dark:text-zinc-200 mb-2">Ready to study?</h2>
             <p class="text-[14px] text-slate-500 mb-8 max-w-sm">Choose a subject from your courses directory to access its specific flashcard deck.</p>
             
             <button @click="$router.push('/subjects')" class="px-8 py-3 rounded-xl bg-brand text-white font-medium shadow-neo-md hover:scale-[1.02] transition-transform">
               Browse Courses
             </button>
        </div>
      </section>
    </div>
  </NeoAppShell>
</template>

<script setup>
import NeoAppShell from '../components/layout/NeoAppShell.vue';
import { useRouter } from 'vue-router';

const router = useRouter();
</script>
