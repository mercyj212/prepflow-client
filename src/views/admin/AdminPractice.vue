<template>
  <div class="p-6 md:p-10 max-w-[1700px] mx-auto animate-fade-inShadow space-y-12">
    <!-- Page Header -->
    <div class="max-w-2xl">
      <h1 class="text-3xl font-black text-zinc-900 dark:text-white uppercase tracking-tighter mb-4">
        Practice <span class="text-purple-500">Tests</span>
      </h1>
      <p class="text-sm text-zinc-500 font-medium leading-relaxed">
        Create and manage examination papers, mock tests, and practice questions. Use the inventory to track active quizzes and share them with students.
      </p>
    </div>

    <div class="grid grid-cols-1 xl:grid-cols-12 gap-10 items-start">
      <!-- Quiz Creation Workspace -->
      <div class="xl:col-span-4 sticky top-10">
        <QuizCreator 
          :loading="creatingQuiz" 
          :courses="adminStore.courses" 
          @create="handleCreateQuiz" 
        />
        
        <!-- Info Card -->
        <NeoCard variant="depressed" class="mt-8 p-6 bg-purple-500/[0.03] border-purple-500/10">
           <div class="flex items-center gap-3 mb-4">
              <div class="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
                 <HelpCircle :size="16" class="text-purple-500" />
              </div>
              <h4 class="text-[11px] font-black text-zinc-900 dark:text-white uppercase tracking-widest">Test Logic</h4>
           </div>
           <p class="text-[11px] text-zinc-500 leading-relaxed">
             Quizzes are linked to specific courses or entrance subjects. Once created, you can add questions, set time limits, and activate them for students.
           </p>
        </NeoCard>
      </div>

      <!-- Quiz Inventory Explorer -->
      <div class="xl:col-span-8">
        <div class="flex items-center justify-between mb-8 pl-4 border-l-4 border-purple-500">
          <div>
            <h2 class="text-[14px] font-black text-zinc-900 dark:text-white tracking-[0.3em] uppercase mb-1">Active Inventories</h2>
            <p class="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Manage your published practice papers</p>
          </div>
          
          <div class="flex items-center gap-2">
            <span class="text-[10px] font-black text-zinc-400 uppercase tracking-widest mr-2">Sort:</span>
            <select class="bg-transparent border-none text-[10px] font-black uppercase tracking-widest text-zinc-900 dark:text-white outline-none cursor-pointer">
              <option>Recent</option>
              <option>Title</option>
              <option>Popular</option>
            </select>
          </div>
        </div>

        <QuizInventory 
          :quizzes="adminStore.quizzes"
          @rename="startQuizRename"
          @delete="handleDeleteQuiz"
          @copy="copyLink"
        />
      </div>
    </div>

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
import { ref, onMounted } from 'vue';
import { HelpCircle } from 'lucide-vue-next';
import { useAdminStore } from '../../store/admin';
import api from '../../api/axios';
import QuizCreator from '../../components/Admin/QuizCreator.vue';
import QuizInventory from '../../components/Admin/QuizInventory.vue';
import ConfirmModal from '../../components/ConfirmModal.vue';
import NeoCard from '../../components/common/NeoCard.vue';

const adminStore = useAdminStore();
const creatingQuiz = ref(false);

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

const handleCreateQuiz = async (formData) => {
  creatingQuiz.value = true;
  try {
    await api.post('/quizzes', formData);
    await adminStore.fetchCoreData();
  } catch (err) { alert(err.response?.data?.message || 'Failed'); }
  finally { creatingQuiz.value = false; }
};

const handleDeleteQuiz = (id) => {
  openConfirm({
    title: 'Delete Test?',
    message: 'This will delete all questions and history from this practice test.',
    onConfirm: async () => { 
      await api.delete(`/quizzes/${id}`); 
      await adminStore.fetchCoreData(); 
    }
  });
};

const startQuizRename = async (quiz) => {
  const newTitle = prompt('Enter new quiz title:', quiz.title);
  if (!newTitle || newTitle === quiz.title) return;
  try {
    await api.put(`/quizzes/${quiz._id}/rename`, { title: newTitle });
    await adminStore.fetchCoreData();
  } catch (err) { alert(err.response?.data?.message || 'Rename failed'); }
};

const copyLink = (id) => {
  const link = `${window.location.origin}/practice/${id}`;
  navigator.clipboard.writeText(link);
  alert('Link copied to clipboard!');
};

onMounted(() => {
  adminStore.fetchCoreData();
});
</script>
