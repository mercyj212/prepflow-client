<template>
  <NeoAppShell>
    <template #header>
      <div class="flex items-center justify-between w-full">
        <div>
          <h1 class="text-[26px] font-medium text-slate-800 dark:text-zinc-100 tracking-tight leading-none mb-1">Admin Dashboard</h1>
          <div class="flex items-center gap-3">
            <span class="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_12px_rgba(16,185,129,0.4)]"></span>
            <span class="text-[11px] font-black italic text-slate-400 uppercase tracking-widest">System Online</span>
          </div>
        </div>

        <div class="flex items-center gap-4">
          <div v-if="successMsg" class="px-5 py-2.5 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 rounded-2xl text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest animate-fade-inShadow">
            {{ successMsg }}
          </div>
          <button @click="fetchCoreData" class="w-12 h-12 flex items-center justify-center bg-white dark:bg-zinc-800/80 border border-slate-200 dark:border-zinc-700 rounded-2xl shadow-neo text-slate-400 hover:text-brand transition-all">
            <svg class="w-5 h-5" :class="loadingStats ? 'animate-spin' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
          </button>
        </div>
      </div>
    </template>

    <!-- Simplified 2-column paradigm -->
    <div class="h-full px-4 sm:px-8 lg:px-12 py-10">
      
      <!-- Main Content Area -->
      <section v-if="!loadingStats" class="max-w-[1600px] mx-auto animate-fade-inShadow pb-20">

        <!-- Analytics Section -->
        <AnalyticsGrid 
          :loading="loadingStats"
          :courses-count="courses.length"
          :quizzes-count="quizzes.length"
          :students-count="totalStudents"
          :submissions-count="allSubmissions.length"
          :global-average="globalAverage"
          class="mb-12"
        />

        <div class="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-16">
          <AIGenerator class="lg:col-span-2" :loading="generatingAI" :quizzes="quizzes" @generate="handleGenerativeAI" />
          <div class="lg:col-span-2 grid grid-cols-1 gap-8">
            <CourseCreator :loading="creatingCourse" @create="handleCreateCourse" />
            <QuizCreator :loading="creatingQuiz" :courses="courses" @create="handleCreateQuiz" />
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-20 lg:mt-8">
          <!-- Course Inventory -->
          <section>
            <div class="flex items-center justify-between mb-10 pl-2 border-l-4 border-brand">
              <div>
                <h2 class="text-[12px] font-black text-slate-900 dark:text-white tracking-[0.4em] uppercase mb-1">Courses</h2>
                <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Manage your courses and learning materials</p>
              </div>
            </div>
            <CourseInventory 
              :courses="courses" 
              :quizzes="quizzes"
              @upload="toggleUpload"
              @preview="handlePreviewExisting"
              @rename="startRename"
              @delete="handleDeleteCourse"
              @delete-material="handleDeleteMaterial"
            />
          </section>

          <!-- Quiz Inventory -->
          <section>
            <div class="flex items-center justify-between mb-10 pl-2 border-l-4 border-purple-500">
              <div>
                <h2 class="text-[12px] font-black text-slate-900 dark:text-white tracking-[0.4em] uppercase mb-1">Practice Tests</h2>
                <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Manage practice tests and links</p>
              </div>
            </div>
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
      </section>

      <!-- Full-page Loader -->
      <div v-else class="h-[60vh] flex flex-col items-center justify-center">
        <NeoLoader label="Updating information..." class="text-brand" />
      </div>
    </div>

    <!-- 📧 EMAIL COMPOSER MODAL -->
    <div v-if="emailModalVisible" class="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div class="bg-white dark:bg-zinc-900 w-full max-w-xl rounded-[32px] border border-zinc-100 dark:border-zinc-800 shadow-2xl overflow-hidden">
        <div class="px-10 py-8 border-b border-zinc-50 dark:border-zinc-800 flex items-center justify-between">
          <div>
            <h2 class="text-[10px] font-black uppercase tracking-[0.2em] mb-1" 
                :class="isBlastMode ? 'text-red-500' : 'text-indigo-500'">
              {{ isBlastMode ? 'Send Email blast' : 'Direct Message' }}
            </h2>
            <p class="text-xl font-black text-zinc-900 dark:text-zinc-100 tracking-tight">
               {{ isBlastMode ? `Send to ${incomingScholars.length} Students` : `Target: ${emailTargetName}` }}
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
            {{ emailLoading ? 'Sending...' : 'Send Email 🚀' }}
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

    <!-- 🖼️ PREVIEW MODAL -->
    <div v-if="previewModal.show" class="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md animate-fade-in">
      <div class="bg-white dark:bg-zinc-900 w-full max-w-2xl rounded-[32px] border border-zinc-100 dark:border-zinc-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div class="px-8 py-6 border-b border-zinc-50 dark:border-zinc-800 flex items-center justify-between shrink-0">
          <div>
            <h2 class="text-[10px] font-black uppercase tracking-[0.2em] text-brand mb-1">
              {{ previewModal.isLocal ? 'Upload Preview' : 'Resource View' }}
            </h2>
            <p class="text-lg font-black text-zinc-900 dark:text-zinc-100 tracking-tight truncate max-w-md">
              {{ previewModal.title }}
            </p>
          </div>
          <button @click="closePreview" class="p-3 text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-2xl transition-all">&times;</button>
        </div>

        <div class="flex-1 overflow-auto p-8 flex items-center justify-center min-h-0 bg-zinc-50 dark:bg-zinc-950">
          <div v-if="previewModal.type === 'image'" class="relative group">
            <img :src="previewModal.url" class="max-w-full max-h-[50vh] rounded-2xl shadow-2xl transition-transform duration-500 group-hover:scale-[1.02]" />
            <div class="absolute inset-0 rounded-2xl shadow-inner pointer-events-none"></div>
          </div>
          <div v-else class="text-center py-20 px-10 bg-white dark:bg-zinc-900 rounded-[32px] border border-dashed border-zinc-200 dark:border-zinc-800 shadow-neo-inner">
            <div class="text-6xl mb-6">📄</div>
            <p class="text-sm font-black text-slate-500 uppercase tracking-widest">Document Preview Not Available</p>
            <p class="text-[10px] text-slate-400 mt-2">Reference file metadata for verification</p>
          </div>
        </div>

        <div class="p-8 border-t border-zinc-50 dark:border-zinc-800 bg-white dark:bg-zinc-900 shrink-0">
          <div v-if="previewModal.isLocal" class="flex gap-4">
            <button @click="closePreview" class="flex-1 py-4 bg-zinc-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 rounded-[20px] font-black text-[11px] uppercase tracking-[0.2em] hover:bg-zinc-200 transition-all">
              Cancel
            </button>
            <button @click="confirmMaterialUpload" 
              :disabled="emailLoading"
              class="flex-[2] py-4 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-[20px] font-black text-[11px] uppercase tracking-[0.2em] shadow-lg hover:shadow-brand/20 transition-all">
              Confirm & Upload 🚀
            </button>
          </div>
          <button v-else @click="closePreview" class="w-full py-4 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-[20px] font-black text-[11px] uppercase tracking-[0.2em] shadow-lg transition-all">
            Done
          </button>
        </div>
      </div>
    </div>
  </NeoAppShell>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import api from '../api/axios'; // Centralized axios instance
import { useAuthStore } from '../store/auth';
import { useQuizStore } from '../store/quiz';
import { useRouter } from 'vue-router';
import NeoAppShell from '../components/layout/NeoAppShell.vue';
import NeoCard from '../components/common/NeoCard.vue';

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
import NeoLoader from '../components/common/NeoLoader.vue';

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
const previewModal = ref({
  show: false, title: '', url: '', isLocal: false, file: null, type: ''
});

// 🛡️ MODAL SYSTEM
const confirmModal = ref({
  show: false, title: '', message: '', confirmText: 'Confirm', isDanger: true, onConfirm: null
});

const openConfirm = (options) => {
  confirmModal.value = {
    show: true,
    title: options.title || 'Are you sure?',
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
    successMsg.value = 'Course Created';
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
  emailTargetName.value = student?.fullName || 'All Students';
  emailSubject.value = isBlastMode.value ? 'New Update: PrepUp' : 'Student Update: PrepUp';
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
  } catch (err) { alert('Failed to send email'); }
  finally { emailLoading.value = false; }
};

// ── Inventory Actions ─────────────────────────────────────────
const toggleUpload = (courseId) => {
  currentUploadingCourseId.value = courseId;
  materialInput.value?.click();
};

const handleMaterialUpload = (event) => {
  const file = event.target.files[0];
  if (!file || !currentUploadingCourseId.value) return;

  const isImage = file.type.startsWith('image/');
  const url = isImage ? URL.createObjectURL(file) : '';
  
  previewModal.value = {
    show: true,
    title: file.name,
    url: url,
    isLocal: true,
    file: file,
    type: isImage ? 'image' : 'pdf'
  };
};

const handlePreviewExisting = (mat) => {
  previewModal.value = {
    show: true,
    title: mat.name,
    url: mat.url,
    isLocal: false,
    file: null,
    type: mat.type || (mat.url.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? 'image' : 'pdf')
  };
};

const closePreview = () => {
  if (previewModal.value.isLocal && previewModal.value.url) {
    URL.revokeObjectURL(previewModal.value.url);
  }
  previewModal.value.show = false;
  if (materialInput.value) materialInput.value.value = '';
};

const confirmMaterialUpload = async () => {
  const { file } = previewModal.value;
  if (!file || !currentUploadingCourseId.value) return;

  const formData = new FormData();
  formData.append('file', file);

  try {
    emailLoading.value = true; // Reuse loading state
    successMsg.value = 'Uploading file...';
    await api.post(`/courses/${currentUploadingCourseId.value}/materials`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    successMsg.value = 'Upload complete';
    closePreview();
    fetchCoreData();
  } catch (err) {
    alert(err.response?.data?.message || 'Upload failed');
  } finally {
    emailLoading.value = false;
    setTimeout(() => successMsg.value = '', 3000);
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
    title: 'Delete Course?',
    message: 'Remove this course? All materials will be deleted.',
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
    title: 'Delete Test?',
    message: 'This will delete all questions and history.',
    onConfirm: async () => { await api.delete(`/quizzes/${id}`); fetchCoreData(); }
  });
};

const handleDeleteStudent = (id) => {
  openConfirm({
    title: 'Delete Student?',
    message: 'Permanently delete this student? Access will be removed immediately.',
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
