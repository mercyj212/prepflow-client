<template>
  <div class="p-4 md:p-10 max-w-[1700px] mx-auto animate-fade-inShadow space-y-10 md:space-y-16">
    <!-- Header Strategy -->
    <div class="max-w-2xl">
      <h1 class="text-3xl font-black text-zinc-900 dark:text-white uppercase tracking-tighter mb-4">Academic <span class="text-brand">Structure</span></h1>
      <p class="text-sm text-zinc-500 font-medium leading-relaxed">
        Manage the foundational taxonomy of your institution. Define Institution Types, Faculties, Schools, and Departments to create a robust structural base for your courses.
      </p>
    </div>

    <!-- Hierarchy Stepper Layout -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
      
      <!-- STEP 01: Structural Base -->
      <div class="lg:col-span-6 space-y-4 md:space-y-6">
        <div class="flex items-center gap-4 pl-1 md:pl-2 font-black">
          <span class="text-2xl md:text-3xl text-zinc-100 dark:text-zinc-800 tabular-nums">01</span>
          <div>
            <h3 class="text-[10px] md:text-[11px] text-zinc-900 dark:text-white tracking-[0.3em] uppercase">Structural Base</h3>
            <p class="text-[8px] md:text-[9px] text-zinc-400 uppercase tracking-widest leading-none">Define Faculties, Schools or Exam Bodies</p>
          </div>
        </div>
        <FacultyManager />
      </div>

      <!-- STEP 02: Entity Mapping -->
      <div class="lg:col-span-6 space-y-4 md:space-y-6">
        <div class="flex items-center gap-4 pl-1 md:pl-2 font-black">
          <span class="text-2xl md:text-3xl text-zinc-100 dark:text-zinc-800 tabular-nums">02</span>
          <div>
            <h3 class="text-[10px] md:text-[11px] text-zinc-900 dark:text-white tracking-[0.3em] uppercase">Entity Mapping</h3>
            <p class="text-[8px] md:text-[9px] text-zinc-400 uppercase tracking-widest leading-none">Map Departments or Exam Subjects</p>
          </div>
        </div>
        <DepartmentManager />
      </div>
    </div>

    <!-- Global Reference Section -->
    <div class="pt-16 border-t border-zinc-100 dark:border-zinc-800">
      <div class="flex items-center gap-4 mb-8">
        <div class="h-px flex-1 bg-zinc-100 dark:bg-zinc-800"></div>
        <span class="text-[10px] font-black text-zinc-400 uppercase tracking-[0.4em]">Global Management</span>
        <div class="h-px flex-1 bg-zinc-100 dark:bg-zinc-800"></div>
      </div>
      
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div class="lg:col-span-2">
          <LevelManager />
        </div>
        
        <div class="space-y-6">
           <NeoCard variant="depressed" class="p-8 border-dashed flex flex-col items-center text-center justify-center min-h-[240px]">
              <div class="w-16 h-16 bg-zinc-100 dark:bg-zinc-800 rounded-3xl flex items-center justify-center mb-6">
                 <Settings2 :size="24" class="text-zinc-400" />
              </div>
              <h4 class="text-[11px] font-black text-zinc-900 dark:text-white uppercase tracking-[0.2em] mb-2">Structure Rules</h4>
              <p class="text-xs text-zinc-500 max-w-[200px]">Hierarchical rules ensure that courses and subjects are correctly mapped to their respective departments and faculties.</p>
           </NeoCard>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Settings2 } from 'lucide-vue-next';
import NeoCard from '../../components/common/NeoCard.vue';
import FacultyManager from '../../components/Admin/FacultyManager.vue';
import DepartmentManager from '../../components/Admin/DepartmentManager.vue';
import LevelManager from '../../components/Admin/LevelManager.vue';
</script>
