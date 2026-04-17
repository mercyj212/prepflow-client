<template>
  <div class="p-6 md:p-10 max-w-[1600px] mx-auto animate-fade-inShadow">
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
      <FacultyManager />
      <DepartmentManager />
      <LevelManager class="lg:col-span-2" />
    </div>
  </div>
</template>

<script setup>
import FacultyManager from '../../components/Admin/FacultyManager.vue';
import DepartmentManager from '../../components/Admin/DepartmentManager.vue';
import LevelManager from '../../components/Admin/LevelManager.vue';
</script>
