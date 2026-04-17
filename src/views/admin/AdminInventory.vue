<template>
  <div class="p-6 md:p-10 max-w-[1600px] mx-auto animate-fade-inShadow">
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
      <CourseCreator :loading="creatingCourse" @create="handleCreateCourse" />
      <QuizCreator :loading="creatingQuiz" :courses="adminStore.courses" @create="handleCreateQuiz" />
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-20">
      <!-- Course Inventory -->
      <section>
        <div class="flex items-center justify-between mb-8 pl-2 border-l-4 border-emerald-500">
          <div>
            <h2 class="text-[12px] font-black text-zinc-900 dark:text-white tracking-[0.4em] uppercase mb-1">Courses</h2>
            <p class="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Manage materials</p>
          </div>
        </div>
        <CourseInventory 
          :courses="adminStore.courses" 
          :quizzes="adminStore.quizzes"
          @upload="toggleUpload"
          @preview="handlePreviewExisting"
          @rename="startRename"
          @delete="handleDeleteCourse"
          @delete-material="handleDeleteMaterial"
        />
      </section>

      <!-- Quiz Inventory -->
      <section>
        <div class="flex items-center justify-between mb-8 pl-2 border-l-4 border-purple-500">
          <div>
            <h2 class="text-[12px] font-black text-zinc-900 dark:text-white tracking-[0.4em] uppercase mb-1">Practice Tests</h2>
            <p class="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Manage practice tests</p>
          </div>
        </div>
        <QuizInventory 
          :quizzes="adminStore.quizzes"
          @rename="startQuizRename"
          @delete="handleDeleteQuiz"
          @copy="copyLink"
        />
      </section>
    </div>

    <!-- Hidden File Input for Course Materials -->
    <input type="file" ref="materialInput" class="hidden" accept="image/*,.pdf" @change="handleMaterialUpload">

    <!-- CONFIRMATION MODAL -->
    <ConfirmModal
      :show="confirmModal.show"
      :title="confirmModal.title"
      :message="confirmModal.message"
      :confirmText="confirmModal.confirmText"
      :isDanger="confirmModal.isDanger"
      @confirm="handleModalConfirm"
      @cancel="confirmModal.show = false"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAdminStore } from '../../store/admin';
import api from '../../api/axios';
import CourseCreator from '../../components/Admin/CourseCreator.vue';
import QuizCreator from '../../components/Admin/QuizCreator.vue';
import CourseInventory from '../../components/Admin/CourseInventory.vue';
import QuizInventory from '../../components/Admin/QuizInventory.vue';
import ConfirmModal from '../../components/ConfirmModal.vue';

const adminStore = useAdminStore();

const creatingCourse = ref(false);
const creatingQuiz = ref(false);
const materialInput = ref(null);
const currentUploadingCourseId = ref(null);

const confirmModal = ref({
  show: false, title: '', message: '', confirmText: 'Confirm', isDanger: true, onConfirm: null
});

const openConfirm = (options) => {
  confirmModal.value = {
    show: true,
    title: options.title || 'Are you sure?',
    message: options.message || 'Irreversible operation.',
    confirmText: options.confirmText || 'Confirm',
    isDanger: options.isDanger !== undefined ? options.isDanger : true,
    onConfirm: options.onConfirm
  };
};

const handleModalConfirm = async () => {
  if (confirmModal.value.onConfirm) {
    try { await confirmModal.value.onConfirm(); } catch (err) { console.error(err); }
  }
  confirmModal.value.show = false;
};

const handleCreateCourse = async (formData) => {
  creatingCourse.value = true;
  try {
    await api.post('/courses', formData);
    adminStore.fetchCoreData();
  } catch (err) { alert(err.response?.data?.message || 'Failed'); }
  finally { creatingCourse.value = false; }
};

const handleCreateQuiz = async (formData) => {
  creatingQuiz.value = true;
  try {
    await api.post('/quizzes', formData);
    adminStore.fetchCoreData();
  } catch (err) { alert(err.response?.data?.message || 'Failed'); }
  finally { creatingQuiz.value = false; }
};

const handleDeleteCourse = (id) => {
  openConfirm({
    title: 'Delete Course?',
    message: 'Remove this course? All materials will be deleted.',
    onConfirm: async () => { await api.delete(`/courses/${id}`); adminStore.fetchCoreData(); }
  });
};

const handleDeleteQuiz = (id) => {
  openConfirm({
    title: 'Delete Test?',
    message: 'This will delete all questions and history.',
    onConfirm: async () => { await api.delete(`/quizzes/${id}`); adminStore.fetchCoreData(); }
  });
};

const startRename = async (course) => {
  const newTitle = prompt('Enter new course title:', course.title);
  if (!newTitle || newTitle === course.title) return;
  try {
    await api.put(`/courses/${course._id}/rename`, { title: newTitle });
    adminStore.fetchCoreData();
  } catch (err) { alert(err.response?.data?.message || 'Rename failed'); }
};

const startQuizRename = async (quiz) => {
  const newTitle = prompt('Enter new quiz title:', quiz.title);
  if (!newTitle || newTitle === quiz.title) return;
  try {
    await api.put(`/quizzes/${quiz._id}/rename`, { title: newTitle });
    adminStore.fetchCoreData();
  } catch (err) { alert(err.response?.data?.message || 'Rename failed'); }
};

const toggleUpload = (courseId) => {
  currentUploadingCourseId.value = courseId;
  materialInput.value?.click();
};

const handleMaterialUpload = async (event) => {
  const file = event.target.files[0];
  if (!file || !currentUploadingCourseId.value) return;

  const formData = new FormData();
  formData.append('file', file);
  try {
    await api.post(`/courses/${currentUploadingCourseId.value}/materials`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    adminStore.fetchCoreData();
  } catch (err) {
    alert(err.response?.data?.message || 'Upload failed');
  } finally {
    if (materialInput.value) materialInput.value.value = '';
  }
};

const handleDeleteMaterial = (courseId, materialId) => {
  openConfirm({
    title: 'Remove Resource?',
    message: 'This document will be permanently deleted from the cloud.',
    onConfirm: async () => { await api.delete(`/courses/${courseId}/materials/${materialId}`); adminStore.fetchCoreData(); }
  });
};

const handlePreviewExisting = (mat) => {
  window.open(mat.url, '_blank');
};

const copyLink = (id) => {
  navigator.clipboard.writeText(`${window.location.origin}/practice/${id}`);
};
</script>
