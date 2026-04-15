<template>
  <div 
    class="min-h-screen bg-[var(--neo-bg)] flex p-2 pt-4 pb-[5.5rem] md:pb-6 md:p-6 font-sans transition-colors duration-500 overflow-hidden h-screen"
    :class="[showSidebar ? 'md:pl-32' : 'md:px-12']"
  >
    <NeoSidebarRail v-if="showSidebar" />

    <!-- Application Canvas / Window -->
    <main class="flex-1 bg-[var(--neo-surface)] rounded-[28px] md:rounded-[40px] shadow-neo-md flex flex-col relative border border-white/20 dark:border-white/5 h-full overflow-hidden">
      <!-- "Mac" Window Header -->
      <header class="h-16 flex items-center px-6 md:px-8 shrink-0 relative z-20">
        <slot name="header">
          <!-- Default Header content -->
          <div class="flex items-center scale-[0.80] md:scale-90 origin-left">
            <BrandLogo />
          </div>

          <div class="ml-auto flex items-center gap-4 md:gap-6">
             <div class="relative group cursor-pointer" @click="triggerFileInput">
               <!-- Avatar Circle -->
               <div class="w-9 h-9 rounded-full border-[1.5px] border-white/40 dark:border-white/10 shadow-lg overflow-hidden bg-slate-200 transition-all group-hover:border-brand/50">
                 <img :src="avatarUrl" alt="avatar" class="w-full h-full object-cover transition-opacity" :class="{'opacity-50': isUploading}">
                 
                 <div v-if="isUploading" class="absolute inset-0 flex items-center justify-center bg-black/40">
                   <span class="animate-spin text-white">⚙</span>
                 </div>
               </div>

               <!-- Plus Badge (Bottom-right) -->
               <div class="absolute -right-1 -bottom-1 w-[18px] h-[18px] bg-brand dark:bg-zinc-100 rounded-full border-2 border-[var(--neo-surface)] flex items-center justify-center shadow-sm transition-transform group-hover:scale-110">
                 <svg class="w-2.5 h-2.5 text-white dark:text-zinc-900" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="4" d="M12 5v14M5 12h14"></path></svg>
               </div>

               <input type="file" ref="fileInput" hidden accept="image/*" @change="handleAvatarUpload">
             </div>
          </div>
        </slot>
      </header>
      
      <!-- Inner Scrollable Canvas -->
      <div class="flex-1 overflow-x-hidden overflow-y-auto w-full h-full pb-10 custom-scrollbar">
        <slot></slot>
      </div>
    </main>

    <!-- 🖼️ PROFILE PREVIEW MODAL -->
    <div v-if="previewModal.show" class="fixed inset-0 z-[120] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md animate-fade-in">
      <div class="bg-white dark:bg-zinc-900 w-full max-w-sm rounded-[32px] border border-zinc-100 dark:border-zinc-800 shadow-2xl overflow-hidden flex flex-col">
        <div class="px-8 py-6 border-b border-zinc-50 dark:border-zinc-800 flex items-center justify-between shrink-0">
          <div>
            <h2 class="text-[10px] font-black uppercase tracking-[0.2em] text-brand mb-1">Update Profile Image</h2>
            <p class="text-sm font-black text-zinc-900 dark:text-zinc-100 tracking-tight">New Look Preview</p>
          </div>
          <button @click="closePreview" class="p-3 text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-2xl transition-all">&times;</button>
        </div>

        <div class="p-10 flex items-center justify-center bg-zinc-50 dark:bg-zinc-950">
          <div class="w-48 h-48 rounded-full border-4 border-white dark:border-zinc-800 shadow-2xl overflow-hidden relative group">
            <img :src="previewModal.url" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
            <div class="absolute inset-0 shadow-inner pointer-events-none"></div>
          </div>
        </div>

        <div class="p-8 border-t border-zinc-50 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex gap-4">
          <button @click="closePreview" class="flex-1 py-4 bg-zinc-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 rounded-[20px] font-black text-[11px] uppercase tracking-[0.2em] transition-all">
            Cancel
          </button>
          <button @click="confirmAvatarUpload" 
            :disabled="isUploading"
            class="flex-[2] py-4 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-[20px] font-black text-[11px] uppercase tracking-[0.2em] shadow-lg transition-all disabled:opacity-50">
            {{ isUploading ? 'Uploading...' : 'Save Image ✨' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, defineProps } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from '../../store/auth';
import NeoSidebarRail from './NeoSidebarRail.vue';
import BrandLogo from '../BrandLogo.vue';

const props = defineProps({
  showSidebar: {
    type: Boolean,
    default: true
  }
});

const route = useRoute();
const authStore = useAuthStore();

const fileInput = ref(null);
const isUploading = ref(false);
const previewModal = ref({ show: false, url: '', file: null });

const avatarUrl = computed(() => {
  return authStore.user?.profilePicture || `https://api.dicebear.com/7.x/notionists/svg?seed=${authStore.user?.fullName || 'student'}`;
});

const triggerFileInput = () => {
  if (isUploading.value) return;
  fileInput.value.click();
};

const handleAvatarUpload = (event) => {
  const file = event.target.files[0];
  if (!file) return;

  previewModal.value = {
    show: true,
    url: URL.createObjectURL(file),
    file: file
  };
};

const closePreview = () => {
  if (previewModal.value.url) URL.revokeObjectURL(previewModal.value.url);
  previewModal.value.show = false;
  if (fileInput.value) fileInput.value.value = '';
};

const confirmAvatarUpload = async () => {
  const { file } = previewModal.value;
  if (!file) return;

  isUploading.value = true;
  try {
    const formData = new FormData();
    formData.append('avatar', file);
    await authStore.uploadAvatar(formData);
    closePreview();
  } catch (error) {
    alert(error.message || 'Failed to upload image.');
  } finally {
    isUploading.value = false;
  }
};

const appTitle = computed(() => {
  return route.meta.title || route.name || 'PrepUp CBT';
});
</script>

<style>
/* Subtle scrollbar for the inner canvas */
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: rgba(150, 150, 150, 0.3);
  border-radius: 20px;
}
.dark .custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.1);
}
</style>
