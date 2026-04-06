<template>
  <div class="min-h-screen bg-[#FBFBFB] dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 font-sans selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black transition-colors duration-300 px-4 py-8 sm:px-6 lg:px-8">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 border-b border-zinc-200 dark:border-zinc-800 pb-6 transition-colors gap-4">
        <BrandLogo size="lg" />
        <div class="flex gap-4 items-center">
          <ThemeToggle />
          <router-link to="/dashboard" class="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 hover:text-black dark:hover:text-white transition underline decoration-2 underline-offset-4">
            Student View
          </router-link>
          <button @click="logout" class="px-6 py-2.5 bg-zinc-100 dark:bg-transparent border border-zinc-200 dark:border-zinc-700 rounded-xl hover:bg-zinc-200 dark:hover:bg-zinc-800 transition text-[10px] font-black uppercase tracking-[0.2em] text-red-600 dark:text-red-400">
            Secure Logout
          </button>
        </div>
      </div>

      <!-- Analytics Section -->
      <AnalyticsGrid 
        :loading="loadingStats"
        :courses-count="courses.length"
        :quizzes-count="quizzes.length"
        :students-count="totalStudents"
        :submissions-count="allSubmissions.length"
        :global-average="globalAverage"
      />

      <!-- Content Creation Hub -->
      <h2 class="text-[11px] font-black mb-8 text-zinc-400 uppercase tracking-[0.3em] border-b border-zinc-100 dark:border-zinc-900 pb-4 text-center">Architect & Engineering Hub</h2>
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-16">
        <AIGenerator :loading="generatingAI" :quizzes="quizzes" @generate="handleGenerativeAI" />
        <CourseCreator :loading="creatingCourse" @create="handleCreateCourse" />
        <QuizCreator :loading="creatingQuiz" :courses="courses" @create="handleCreateQuiz" />
        <BatchImporter class="lg:col-span-2" :quizzes="quizzes" @imported="fetchCoreData" />
      </div>

      <!-- Management Hub -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        <!-- Course Inventory -->
        <section>
          <div class="flex items-center justify-between mb-8">
            <h2 class="text-2xl font-black text-zinc-900 dark:text-white tracking-tighter uppercase">Course Assets</h2>
            <div v-if="successMsg" class="text-[10px] font-bold text-emerald-500 uppercase tracking-widest animate-pulse">{{ successMsg }}</div>
          </div>
          <CourseInventory 
            :courses="courses" 
            :quizzes="quizzes"
            @upload="toggleUpload"
            @rename="startRename"
            @delete="handleDeleteCourse"
            @delete-material="handleDeleteMaterial"
          />
        </section>

        <!-- Quiz Inventory -->
        <section>
          <h2 class="text-2xl font-black text-zinc-900 dark:text-white tracking-tighter uppercase mb-8">Assessment Paths</h2>
          <QuizInventory 
            :quizzes="quizzes"
            @rename="startQuizRename"
            @delete="handleDeleteQuiz"
            @copy="copyLink"
          />
        </section>
      </div>

      <!-- Student Registry -->
      <StudentRegistry 
        :students="incomingScholars"
        @email-blast="openEmailModal()"
        @email-direct="openEmailModal"
        @delete="handleDeleteStudent"
      />
    </div>

    <!-- 📧 EMAIL COMPOSER MODAL -->
    <div v-if="emailModalVisible" class="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div class="bg-white dark:bg-zinc-900 w-full max-w-xl rounded-[32px] border border-zinc-100 dark:border-zinc-800 shadow-2xl overflow-hidden">
        <div class="px-10 py-8 border-b border-zinc-50 dark:border-zinc-800 flex items-center justify-between">
          <div>
            <h2 class="text-[10px] font-black uppercase tracking-[0.2em] mb-1" 
                :class="isBlastMode ? 'text-red-500' : 'text-indigo-500'">
              {{ isBlastMode ? 'Global Announcement' : 'Direct Message' }}
            </h2>
            <p class="text-xl font-black text-zinc-900 dark:text-zinc-100 tracking-tight">
              {{ isBlastMode ? `Dispatch to ${incomingScholars.length} Scholars` : `Target: ${emailTargetName}` }}
            </p>
          </div>
          <button @click="emailModalVisible = false" class="p-3 text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-2xl transition-all">&times;</button>
        </div>

        <div class="p-10 space-y-6">
          <input v-model="emailSubject" type="text" class="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 rounded-2xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20" placeholder="Transmission Subject">
          <textarea v-model="emailMessage" rows="6" class="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 rounded-3xl p-6 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 resize-none" placeholder="Draft your briefing here..."></textarea>
          
          <button @click="handleSendEmail" 
            :disabled="emailLoading"
            class="w-full py-5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-[22px] font-black text-[11px] uppercase tracking-[0.2em] shadow-lg shadow-zinc-900/10 hover:translate-y-[-2px] transition-all disabled:opacity-50">
            {{ emailLoading ? 'Dispatching...' : 'Execute Dispatch 🚀' }}
          </button>
        </div>
      </div>
    </div>

    <!-- 🛡️ CONFIRMATION MODAL -->
    <ConfirmModal
      :show="confirmModal.show"
      :title="confirmModal.title"
      :message="confirmModal.message"
      :confirmText="confirmModal.confirmText"
      :isDanger="confirmModal.isDanger"
      @confirm="handleModalConfirm"
      @cancel="confirmModal.show = false"
    />

    <!-- Hidden File Input for Course Materials -->
    <input 
      type="file" 
      ref="materialInput" 
      class="hidden" 
      accept="image/*,.pdf"
      @change="handleMaterialUpload"
    >

    <AppFooter />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import api from '../api/axios'; // Centralized axios instance
import { useAuthStore } from '../store/auth';
import { useQuizStore } from '../store/quiz';
import { useRouter } from 'vue-router';

// Sub-Components
import BrandLogo from '../components/BrandLogo.vue';
import ThemeToggle from '../components/ThemeToggle.vue';
import ConfirmModal from '../components/ConfirmModal.vue';
import AppFooter from '../components/AppFooter.vue';
import AnalyticsGrid from '../components/Admin/AnalyticsGrid.vue';
import CourseCreator from '../components/Admin/CourseCreator.vue';
import QuizCreator from '../components/Admin/QuizCreator.vue';
import AIGenerator from '../components/Admin/AIGenerator.vue';
import CourseInventory from '../components/Admin/CourseInventory.vue';
import QuizInventory from '../components/Admin/QuizInventory.vue';
import StudentRegistry from '../components/Admin/StudentRegistry.vue';
import BatchImporter from '../components/Admin/BatchImporter.vue';

const authStore = useAuthStore();
const quizStore = useQuizStore();
const router = useRouter();

// ── Shared State ──────────────────────────────────────────────
const courses = ref([]);
const quizzes = ref([]);
const allSubmissions = ref([]);
const totalStudents = ref(0);
const incomingScholars = ref([]);
const loadingStats = ref(true);
const materialInput = ref(null);
const currentUploadingCourseId = ref(null);

// 🛡️ MODAL SYSTEM
const confirmModal = ref({
  show: false, title: '', message: '', confirmText: 'Confirm', isDanger: true, onConfirm: null
});

const openConfirm = (options) => {
  confirmModal.value = {
    show: true,
    title: options.title || 'Execute Protocol?',
    message: options.message || 'This operation is irreversible.',
    confirmText: options.confirmText || 'Confirm',
    isDanger: options.isDanger !== undefined ? options.isDanger : true,
    onConfirm: options.onConfirm
  };
};

const handleModalConfirm = async () => {
  if (confirmModal.value.onConfirm) {
    try { await confirmModal.value.onConfirm(); } catch (err) { console.error('[ADM_ERR]:', err); }
  }
  confirmModal.value.show = false;
};

// ── CRUD Operations ──────────────────────────────────────────
const creatingCourse = ref(false);
const creatingQuiz = ref(false);
const generatingAI = ref(false);
const successMsg = ref('');

const handleCreateCourse = async (formData) => {
  creatingCourse.value = true;
  try {
    await api.post('/courses', formData);
    successMsg.value = 'Course Initialized';
    fetchCoreData();
  } catch (err) { alert(err.response?.data?.message || 'Initialization Failed'); }
  finally { 
    creatingCourse.value = false;
    setTimeout(() => successMsg.value = '', 3000);
  }
};

const handleCreateQuiz = async (formData) => {
  creatingQuiz.value = true;
  try {
    await api.post('/quizzes', formData);
    fetchCoreData();
  } catch (err) { alert(err.response?.data?.message || 'Assembly Failed'); }
  finally { creatingQuiz.value = false; }
};

const handleGenerativeAI = async (formData) => {
  generatingAI.value = true;
  const data = new FormData();
  formData.files.forEach(f => data.append('files', f));
  if (formData.material) data.append('material', formData.material);
  data.append('count', formData.count);

  try {
    await api.post(`/quizzes/${formData.quizId}/generate`, data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    fetchCoreData();
  } catch (err) { alert('AI Synthesis Failed'); }
  finally { generatingAI.value = false; }
};

// ── Core Data Logic ──────────────────────────────────────────
const fetchCoreData = async () => {
  loadingStats.value = true;
  try {
    const [cRes, qRes, sCountRes, sListRes] = await Promise.all([
      api.get('/courses'),
      api.get('/quizzes'),
      api.get('/students/count'),
      api.get('/students')
    ]);
    courses.value = cRes.data;
    quizzes.value = qRes.data;
    totalStudents.value = sCountRes.data.count;
    incomingScholars.value = sListRes.data;
    
    const subsData = await quizStore.fetchAllSubmissions();
    allSubmissions.value = subsData || [];
  } catch (err) { console.error('[DATA_FCH_ERR]:', err); }
  finally { loadingStats.value = false; }
};

const globalAverage = computed(() => {
  if (allSubmissions.value.length === 0) return 0;
  const total = allSubmissions.value.reduce((acc, sub) => acc + ((sub.score / sub.totalQuestions) * 100), 0);
  return Math.round(total / allSubmissions.value.length);
});

// ── Email System ──────────────────────────────────────────────
const emailModalVisible = ref(false);
const emailLoading = ref(false);
const emailSubject = ref('');
const emailMessage = ref('');
const emailTargetId = ref(null);
const emailTargetName = ref('');
const isBlastMode = ref(false);

const openEmailModal = (student = null) => {
  isBlastMode.value = !student;
  emailTargetId.value = student?._id || null;
  emailTargetName.value = student?.fullName || 'All Scholars';
  emailSubject.value = isBlastMode.value ? 'Global Briefing: PrepUp' : 'Scholar Update: PrepUp';
  emailMessage.value = '';
  emailModalVisible.value = true;
};

const handleSendEmail = async () => {
  if (!emailMessage.value) return;
  emailLoading.value = true;
  try {
    const endpoint = isBlastMode.value ? '/students/email-blast' : '/students/email';
    const payload = isBlastMode.value 
      ? { subject: emailSubject.value, message: emailMessage.value }
      : { id: emailTargetId.value, subject: emailSubject.value, message: emailMessage.value };
    await api.post(endpoint, payload);
    emailModalVisible.value = false;
  } catch (err) { alert('Dispatch Failed'); }
  finally { emailLoading.value = false; }
};

// ── Inventory Actions ─────────────────────────────────────────
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
    successMsg.value = 'Uploading Material...';
    await api.post(`/courses/${currentUploadingCourseId.value}/materials`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    successMsg.value = 'Material Uplinked';
    fetchCoreData();
  } catch (err) {
    alert(err.response?.data?.message || 'Upload failed');
  } finally {
    setTimeout(() => successMsg.value = '', 3000);
    event.target.value = ''; // Reset input
  }
};

const startRename = async (course) => {
  const newTitle = prompt('Enter new course title:', course.title);
  if (!newTitle || newTitle === course.title) return;

  try {
    await api.put(`/courses/${course._id}/rename`, { title: newTitle });
    successMsg.value = 'Course Renamed';
    fetchCoreData();
  } catch (err) {
    alert(err.response?.data?.message || 'Rename failed');
  } finally {
    setTimeout(() => successMsg.value = '', 3000);
  }
};

const startQuizRename = async (quiz) => {
  const newTitle = prompt('Enter new quiz title:', quiz.title);
  if (!newTitle || newTitle === quiz.title) return;

  try {
    await api.put(`/quizzes/${quiz._id}/rename`, { title: newTitle });
    successMsg.value = 'Quiz Renamed';
    fetchCoreData();
  } catch (err) {
    alert(err.response?.data?.message || 'Rename failed');
  } finally {
    setTimeout(() => successMsg.value = '', 3000);
  }
};

const handleDeleteCourse = (id) => {
  openConfirm({
    title: 'Decommission Course?',
    message: 'Remove this curriculum asset? All materials will be purged from Cloudinary.',
    onConfirm: async () => { await api.delete(`/courses/${id}`); fetchCoreData(); }
  });
};

const handleDeleteMaterial = (courseId, materialId) => {
  openConfirm({
    title: 'Remove Resource?',
    message: 'This document will be permanently deleted from the cloud.',
    onConfirm: async () => { await api.delete(`/courses/${courseId}/materials/${materialId}`); fetchCoreData(); }
  });
};

const handleDeleteQuiz = (id) => {
  openConfirm({
    title: 'Erase Assessment?',
    message: 'This will purge all questions and submission history.',
    onConfirm: async () => { await api.delete(`/quizzes/${id}`); fetchCoreData(); }
  });
};

const handleDeleteStudent = (id) => {
  openConfirm({
    title: 'Purge Profile?',
    message: 'Liquidate this scholar account? Access will be revoked immediately.',
    onConfirm: async () => { await api.delete(`/students/${id}`); fetchCoreData(); }
  });
};

const copyLink = (id) => {
  navigator.clipboard.writeText(`${window.location.origin}/practice/${id}`);
};

const logout = () => { authStore.logout(); router.push('/login'); };

onMounted(fetchCoreData);
</script>

<style scoped>
.animate-fade-in { animation: fadeIn 0.3s ease-in forwards; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 10px; }
</style>
