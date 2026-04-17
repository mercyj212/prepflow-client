<template>
  <div 
    class="min-h-screen bg-zinc-950 flex p-2 pt-4 pb-[5.5rem] md:pb-6 md:p-6 transition-all duration-500 overflow-hidden h-screen"
    style="font-family: 'DM Sans', sans-serif;"
    :class="[isSidebarHovered ? 'md:pl-[296px]' : 'md:pl-32']"
  >
    <AdminSidebar @hover="isSidebarHovered = $event" />

    <main class="flex-1 bg-white dark:bg-zinc-900 rounded-[28px] md:rounded-[40px] shadow-2xl flex flex-col relative border border-white/5 h-full overflow-hidden">
      <!-- Admin Header -->
      <header class="h-14 md:h-16 flex items-center px-4 md:px-8 shrink-0 relative z-20 border-b border-zinc-100 dark:border-white/5">
        <div>
          <h1 class="text-[15px] md:text-[18px] font-black tracking-tight leading-none text-zinc-900 dark:text-white capitalize">{{ routeName }}</h1>
          <div class="flex items-center gap-2 mt-1">
             <span class="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_12px_rgba(16,185,129,0.4)]"></span>
             <span class="text-[8px] font-black italic text-zinc-400 uppercase tracking-widest">Admin Portal</span>
          </div>
        </div>
        
        <div class="ml-auto flex gap-4 items-center">
           <button @click="adminStore.fetchCoreData" class="w-10 h-10 flex items-center justify-center bg-zinc-50 dark:bg-zinc-800 rounded-xl text-zinc-400 hover:text-emerald-500 transition-all">
             <RotateCw :size="16" :class="adminStore.loading ? 'animate-spin' : ''" />
           </button>
           <button @click="router.push('/dashboard')" class="text-[10px] font-black uppercase tracking-[0.2em] bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-white dark:text-black py-2.5 px-5 rounded-[14px] transition-all flex items-center gap-2">
             <span>Back to Dashboard</span>
             <ArrowRight :size="14" />
           </button>
        </div>
      </header>

      <!-- Sub Page Content -->
      <div class="flex-1 overflow-x-hidden overflow-y-auto w-full h-full custom-scrollbar relative bg-zinc-50/30 dark:bg-zinc-950/20">
         <router-view v-slot="{ Component }">
            <transition name="fade" mode="out-in">
                <component :is="Component" />
            </transition>
         </router-view>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { RotateCw, ArrowRight } from 'lucide-vue-next';
import AdminSidebar from './AdminSidebar.vue';
import { useAdminStore } from '../../store/admin';

const route = useRoute();
const router = useRouter();
const isSidebarHovered = ref(false);
const adminStore = useAdminStore();

const routeName = computed(() => {
  return route.name ? route.name.replace('admin-', '').replace('-', ' ') : 'Overview';
});

onMounted(() => {
  if (adminStore.courses.length === 0 && !adminStore.loading) {
    adminStore.fetchCoreData();
  }
});
</script>

<style>
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
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(4px);
}
</style>
