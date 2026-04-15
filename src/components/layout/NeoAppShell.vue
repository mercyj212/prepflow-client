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
             <div class="relative w-8 h-8 rounded-full border-[1.5px] border-white/40 dark:border-white/10 shadow-sm overflow-hidden bg-slate-200 cursor-pointer group" @click="triggerFileInput">
               <img :src="avatarUrl" alt="avatar" class="w-full h-full object-cover transition-opacity" :class="{'opacity-50': isUploading}">
               
               <div class="absolute inset-0 flex items-center justify-center bg-black/40 transition-opacity" :class="isUploading ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'">
                 <span v-if="isUploading" class="animate-spin text-white">⚙</span>
                 <span v-else class="text-white text-xs">📷</span>
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

const avatarUrl = computed(() => {
  return authStore.user?.profilePicture || `https://api.dicebear.com/7.x/notionists/svg?seed=${authStore.user?.fullName || 'student'}`;
});

const triggerFileInput = () => {
  if (isUploading.value) return;
  fileInput.value.click();
};

const handleAvatarUpload = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  isUploading.value = true;
  try {
    const formData = new FormData();
    formData.append('avatar', file);
    await authStore.uploadAvatar(formData);
  } catch (error) {
    alert(error.message || 'Failed to upload image. File might be too large.');
  } finally {
    isUploading.value = false;
    // Reset input so the same file can be selected again if needed
    if (fileInput.value) fileInput.value.value = '';
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
