<template>
  <div class="p-6 md:p-10 max-w-[1600px] mx-auto animate-fade-inShadow">
    <div class="absolute -right-20 -top-20 w-64 h-64 bg-zinc-900/5 dark:bg-white/5 rounded-full blur-[80px] pointer-events-none"></div>
    <div class="absolute -left-20 -bottom-20 w-64 h-64 bg-zinc-800/5 dark:bg-zinc-100/5 rounded-full blur-[80px] pointer-events-none"></div>
    <div v-if="adminStore.loading && adminStore.courses.length === 0" class="h-[40vh] flex items-center justify-center">
      <NeoLoader label="Loading Analytics..." class="text-zinc-400 dark:text-zinc-600" />
    </div>
    <div v-else>
      <AnalyticsGrid 
        :loading="adminStore.loading"
        :courses-count="adminStore.courses.length"
        :quizzes-count="adminStore.quizzes.length"
        :students-count="adminStore.totalStudents"
        :submissions-count="adminStore.allSubmissions.length"
        :global-average="adminStore.globalAverage"
        class="mb-12"
      />
      <div class="grid grid-cols-1 gap-8">
        <AIGenerator :loading="generatingAI" :quizzes="adminStore.quizzes" @generate="handleGenerativeAI" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAdminStore } from '../../store/admin';
import api from '../../api/axios';
import AnalyticsGrid from '../../components/Admin/AnalyticsGrid.vue';
import AIGenerator from '../../components/Admin/AIGenerator.vue';
import NeoLoader from '../../components/common/NeoLoader.vue';

const adminStore = useAdminStore();
const generatingAI = ref(false);

const handleGenerativeAI = async (formData) => {
  generatingAI.value = true;
  const data = new FormData();
  formData.files.forEach(f => data.append('files', f));
  if (formData.material) data.append('material', formData.material);
  data.append('count', formData.count);
  if (formData.level) data.append('level', formData.level);

  try {
    await api.post(`/quizzes/${formData.quizId}/generate`, data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    alert('AI Generation Complete');
    adminStore.fetchCoreData();
  } catch (err) {
    alert('AI Generation Failed');
  } finally {
    generatingAI.value = false;
  }
};
</script>
