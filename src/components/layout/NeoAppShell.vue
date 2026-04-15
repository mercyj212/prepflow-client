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

          <div class="ml-auto flex items-center gap-4 md:gap-8">
             <!-- Profile Section -->
             <div class="relative flex items-center gap-3">
               <!-- Name Label (Clickable) -->
               <div @click="showProfileMenu = !showProfileMenu" class="hidden sm:flex flex-col items-end cursor-pointer group/name">
                 <span class="text-[13px] font-black text-zinc-800 dark:text-zinc-100 tracking-tight group-hover/name:text-zinc-500 dark:group-hover/name:text-zinc-400 transition-colors text-right">
                   {{ authStore.user?.fullName || 'PrepUp User' }}
                 </span>
                 <span class="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-400">Student</span>
               </div>

               <!-- Avatar Circle with Menu Toggle -->
               <div class="relative group">
                 <div @click="showProfileMenu = !showProfileMenu" class="w-10 h-10 rounded-full border-2 border-white/40 dark:border-white/10 shadow-lg overflow-hidden bg-zinc-200 transition-all cursor-pointer group-hover:border-brand/50 active:scale-95">
                   <img :src="avatarUrl" alt="avatar" class="w-full h-full object-cover transition-opacity" :class="{'opacity-50': isUploading}">
                   <div v-if="isUploading" class="absolute inset-0 flex items-center justify-center bg-black/40">
                     <span class="animate-spin text-white">⚙</span>
                   </div>
                 </div>

                 <!-- Plus Badge (Triggers File Upload) -->
                 <div @click="triggerFileInput" class="absolute -right-1 -bottom-1 w-[18px] h-[18px] bg-brand dark:bg-zinc-100 rounded-full border-2 border-[var(--neo-surface)] flex items-center justify-center shadow-sm transition-transform cursor-pointer hover:scale-110 active:scale-90 z-10">
                   <svg class="w-2.5 h-2.5 text-white dark:text-zinc-900" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="4" d="M12 5v14M5 12h14"></path></svg>
                 </div>
               </div>

               <!-- 🔽 PROFILE DROPDOWN MENU -->
               <Transition
                 enter-active-class="transition duration-200 ease-out"
                 enter-from-class="transform scale-95 opacity-0 -translate-y-2"
                 enter-to-class="transform scale-100 opacity-100 translate-y-0"
                 leave-active-class="transition duration-150 ease-in"
                 leave-from-class="transform scale-100 opacity-100 translate-y-0"
                 leave-to-class="transform scale-95 opacity-0 -translate-y-2"
               >
                 <div v-if="showProfileMenu" class="absolute top-14 right-0 w-64 bg-white dark:bg-zinc-900 rounded-[28px] shadow-2xl border border-zinc-100 dark:border-white/5 py-3 px-3 z-50 overflow-hidden">
                    <!-- Invisible Backdrop to catch clicks outside (only when menu is open) -->
                    <div class="fixed inset-0 z-[-1] bg-transparent" @click.stop="showProfileMenu = false"></div>

                    <div class="px-5 py-4 mb-2 border-b border-zinc-50 dark:border-white/5 bg-zinc-50/50 dark:bg-white/5 rounded-[20px]">
                      <p class="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-1">Active Session</p>
                      <p class="text-[13px] font-bold text-zinc-800 dark:text-zinc-200 truncate">{{ authStore.user?.email }}</p>
                    </div>

                    <div class="space-y-1">
                      <router-link to="/settings" @click="showProfileMenu = false" class="flex items-center gap-3 px-4 py-3 text-[12px] font-bold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-white rounded-[18px] transition-all group/item">
                        <svg class="w-4 h-4 opacity-50 group-hover/item:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                        Settings
                      </router-link>

                      <button @click="handleLogout" class="w-full flex items-center gap-3 px-4 py-3 text-[12px] font-bold text-red-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-[18px] transition-all group/item">
                        <svg class="w-4 h-4 opacity-70 group-hover/item:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path></svg>
                        Switch Profile
                      </button>
                    </div>
                 </div>
               </Transition>

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
          <button @click="closePreview" class="flex-1 py-4 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 rounded-[20px] font-black text-[11px] uppercase tracking-[0.2em] transition-all">
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
const showProfileMenu = ref(false);
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

const handleLogout = () => {
  authStore.logout();
  router.push('/');
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
