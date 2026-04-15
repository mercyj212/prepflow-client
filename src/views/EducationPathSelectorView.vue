<template>
  <NeoAppShell>
    <div class="px-6 sm:px-12 py-16 flex flex-col items-center min-h-[80vh]">
      <!-- Header Section -->
      <header class="mb-16 text-center">
        <h1 class="text-[48px] font-medium text-zinc-900 dark:text-zinc-100 tracking-tighter leading-none mb-4">Choose Your Path</h1>
        <p class="text-[18px] font-normal text-zinc-500 dark:text-zinc-500 max-w-xl leading-relaxed mx-auto">Select the type of education or exam track you want to prepare for today.</p>
      </header>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl">
        <!-- University Path -->
        <div 
          @click="selectPath('university')"
          class="group cursor-pointer relative"
        >
          <NeoCard variant="hoverable" class="p-10 h-full flex flex-col items-center text-center group-hover:bg-zinc-900 dark:group-hover:bg-white transition-all duration-500">
            <div class="w-20 h-20 rounded-[32px] bg-zinc-50 dark:bg-zinc-800/50 flex items-center justify-center shadow-neo-inner group-hover:scale-110 group-hover:bg-zinc-800 dark:group-hover:bg-zinc-100 transition-all duration-500 mb-8">
              <School :size="36" :stroke-width="1.2" class="text-zinc-600 dark:text-zinc-400 group-hover:text-white dark:group-hover:text-zinc-900 transition-colors" />
            </div>
            <h3 class="text-[24px] font-medium text-zinc-900 dark:text-zinc-100 tracking-tight leading-none mb-4 group-hover:text-white dark:group-hover:text-zinc-900 transition-colors">
              University
            </h3>
            <p class="text-[14px] font-normal text-zinc-400 dark:text-zinc-500 leading-relaxed group-hover:text-zinc-300 dark:group-hover:text-zinc-600 transition-colors">
              Degree-focused preparation with 100L—500L course structures.
            </p>
          </NeoCard>
          <div class="absolute -z-10 -bottom-2 -right-2 w-full h-full bg-zinc-900/5 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity rounded-[32px]"></div>
        </div>

        <!-- Polytechnic Path -->
        <div 
          @click="selectPath('polytechnic')"
          class="group cursor-pointer relative"
        >
          <NeoCard variant="hoverable" class="p-10 h-full flex flex-col items-center text-center group-hover:bg-zinc-900 dark:group-hover:bg-white transition-all duration-500">
            <div class="w-20 h-20 rounded-[32px] bg-zinc-50 dark:bg-zinc-800/50 flex items-center justify-center shadow-neo-inner group-hover:scale-110 group-hover:bg-zinc-800 dark:group-hover:bg-zinc-100 transition-all duration-500 mb-8">
              <Building2 :size="36" :stroke-width="1.2" class="text-zinc-600 dark:text-zinc-400 group-hover:text-white dark:group-hover:text-zinc-900 transition-colors" />
            </div>
            <h3 class="text-[24px] font-medium text-zinc-900 dark:text-zinc-100 tracking-tight leading-none mb-4 group-hover:text-white dark:group-hover:text-zinc-900 transition-colors">
              Polytechnic
            </h3>
            <p class="text-[14px] font-normal text-zinc-400 dark:text-zinc-500 leading-relaxed group-hover:text-zinc-300 dark:group-hover:text-zinc-600 transition-colors">
              Technical focus with ND & HND categorization for all subjects.
            </p>
          </NeoCard>
          <div class="absolute -z-10 -bottom-2 -right-2 w-full h-full bg-zinc-900/5 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity rounded-[32px]"></div>
        </div>

        <!-- Entrance Exams Path -->
        <div 
          @click="selectPath('entrance')"
          class="group cursor-pointer relative"
        >
          <NeoCard variant="hoverable" class="p-10 h-full flex flex-col items-center text-center group-hover:bg-zinc-900 dark:group-hover:bg-white transition-all duration-500">
            <div class="w-20 h-20 rounded-[32px] bg-zinc-50 dark:bg-zinc-800/50 flex items-center justify-center shadow-neo-inner group-hover:scale-110 group-hover:bg-zinc-800 dark:group-hover:bg-zinc-100 transition-all duration-500 mb-8">
              <FileEdit :size="36" :stroke-width="1.2" class="text-zinc-600 dark:text-zinc-400 group-hover:text-white dark:group-hover:text-zinc-900 transition-colors" />
            </div>
            <h3 class="text-[24px] font-medium text-zinc-900 dark:text-zinc-100 tracking-tight leading-none mb-4 group-hover:text-white dark:group-hover:text-zinc-900 transition-colors">
              Entrance Exams
            </h3>
            <p class="text-[14px] font-normal text-zinc-400 dark:text-zinc-500 leading-relaxed group-hover:text-zinc-300 dark:group-hover:text-zinc-600 transition-colors">
              JAMB, WAEC, NECO, and other external competitive assessments.
            </p>
          </NeoCard>
          <div class="absolute -z-10 -bottom-2 -right-2 w-full h-full bg-zinc-900/5 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity rounded-[32px]"></div>
        </div>
      </div>
    </div>
  </NeoAppShell>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { 
  School, 
  Building2, 
  FileEdit 
} from 'lucide-vue-next';
import { useQuizStore } from '../store/quiz';
import NeoAppShell from '../components/layout/NeoAppShell.vue';
import NeoCard from '../components/common/NeoCard.vue';

const router = useRouter();
const quizStore = useQuizStore();

const selectPath = (path) => {
  quizStore.setEducationPath(path);
  router.push(`/subjects/${path}`);
};
</script>
