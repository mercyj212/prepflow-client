<template>
  <div class="p-6 md:p-10 max-w-[1600px] mx-auto animate-fade-inShadow">
    <!-- Student Registry -->
    <StudentRegistry 
      :students="adminStore.incomingScholars"
      @email-blast="openEmailModal()"
      @email-direct="openEmailModal"
      @delete="handleDeleteStudent"
    />

    <!-- 📧 EMAIL COMPOSER MODAL -->
    <div v-if="emailModalVisible" class="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div class="bg-white dark:bg-zinc-900 w-full max-w-xl rounded-[32px] border border-zinc-100 dark:border-zinc-800 shadow-2xl overflow-hidden">
        <div class="px-10 py-8 border-b border-zinc-50 dark:border-zinc-800 flex items-center justify-between">
          <div>
            <h2 class="text-[10px] font-black uppercase tracking-[0.2em] mb-1" 
                :class="isBlastMode ? 'text-red-500' : 'text-brand'">
              {{ isBlastMode ? 'Send Email blast' : 'Direct Message' }}
            </h2>
            <p class="text-xl font-black text-zinc-900 dark:text-zinc-100 tracking-tight">
               {{ isBlastMode ? `Send to ${adminStore.incomingScholars.length} Students` : `Recipient: ${emailTargetName}` }}
            </p>
          </div>
          <button @click="emailModalVisible = false" class="p-3 text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-2xl transition-all">
             <span class="sr-only">Close</span>✕
          </button>
        </div>

        <div class="p-10 space-y-6">
          <input v-model="emailSubject" type="text" class="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 rounded-2xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-brand/20" placeholder="Email Subject">
          <textarea v-model="emailMessage" rows="6" class="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 rounded-3xl p-6 text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 resize-none" placeholder="Type your message here..."></textarea>
          <button 
            @click="handleSendEmail" 
            :disabled="emailLoading"
            class="w-full py-4 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] shadow-lg hover:shadow-brand/20 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <span>{{ emailLoading ? 'Sending Email...' : 'Send Email' }}</span>
          </button>
        </div>
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
import { ref } from 'vue';
import { useAdminStore } from '../../store/admin';
import api from '../../api/axios';
import StudentRegistry from '../../components/Admin/StudentRegistry.vue';
import ConfirmModal from '../../components/ConfirmModal.vue';

const adminStore = useAdminStore();

const emailModalVisible = ref(false);
const emailLoading = ref(false);
const emailSubject = ref('');
const emailMessage = ref('');
const emailTargetId = ref(null);
const emailTargetName = ref('');
const isBlastMode = ref(false);

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

const handleDeleteStudent = (id) => {
  openConfirm({
    title: 'Delete Student?',
    message: 'Permanently delete this student? Access will be removed.',
    onConfirm: async () => { await api.delete(`/students/${id}`); adminStore.fetchCoreData(); }
  });
};
</script>
