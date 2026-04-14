<template>
  <aside class="fixed top-0 left-0 h-screen w-20 md:w-64 bg-slate-900 text-slate-300 flex flex-col shadow-2xl z-50 transition-all duration-300 group hover:w-64">
    <!-- Logo -->
    <div class="h-20 flex items-center justify-center border-b border-white/10 relative overflow-hidden shrink-0">
        <span class="text-white font-black tracking-widest text-xl opacity-0 md:opacity-100 group-hover:opacity-100 transition-opacity">PREPFLOW</span>
        <span class="text-white font-black text-xl md:hidden group-hover:hidden transition-opacity absolute">P</span>
        <!-- Logo Shine -->
        <div class="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:animate-[shine_1.5s_ease-out]"></div>
    </div>
    
    <!-- Navigation -->
    <nav class="flex-1 py-8 flex flex-col gap-3 relative overflow-y-auto overflow-x-hidden">
      <router-link to="/dashboard" class="flex items-center px-6 py-4 mx-4 rounded-xl text-sm font-medium transition-all group/item" active-class="bg-indigo-600 text-white shadow-lg shadow-indigo-500/20" :class="{'bg-white/5': $route.path !== '/dashboard'}">
        <span class="text-xl shrink-0 group-[.router-link-active]/item:scale-110 transition-transform">📊</span>
        <span class="ml-4 opacity-0 md:opacity-100 group-hover:opacity-100 transition-opacity whitespace-nowrap">Dashboard</span>
      </router-link>
      <router-link to="/practice" class="flex items-center px-6 py-4 mx-4 rounded-xl text-sm font-medium hover:bg-white/10 transition-all group/item" active-class="bg-indigo-600 text-white shadow-lg shadow-indigo-500/20">
        <span class="text-xl shrink-0 group-hover/item:scale-110 transition-transform">📝</span>
        <span class="ml-4 opacity-0 md:opacity-100 group-hover:opacity-100 transition-opacity whitespace-nowrap">Practice</span>
      </router-link>
      <router-link to="/study" class="flex items-center px-6 py-4 mx-4 rounded-xl text-sm font-medium hover:bg-white/10 transition-all group/item" active-class="bg-indigo-600 text-white shadow-lg shadow-indigo-500/20">
        <span class="text-xl shrink-0 group-hover/item:scale-110 transition-transform">🗂️</span>
        <span class="ml-4 opacity-0 md:opacity-100 group-hover:opacity-100 transition-opacity whitespace-nowrap">Flashcards</span>
      </router-link>
      <router-link to="/help" class="flex items-center px-6 py-4 mx-4 rounded-xl text-sm font-medium hover:bg-white/10 transition-all group/item" active-class="bg-indigo-600 text-white shadow-lg shadow-indigo-500/20">
        <span class="text-xl shrink-0 group-hover/item:scale-110 transition-transform">💡</span>
        <span class="ml-4 opacity-0 md:opacity-100 group-hover:opacity-100 transition-opacity whitespace-nowrap">Help Center</span>
      </router-link>
    </nav>
    
    <!-- User Profile / Logout -->
    <div class="p-4 border-t border-white/10 mt-auto shrink-0 relative flex flex-col gap-2">
      <button @click="logout" class="flex items-center w-full px-6 py-4 rounded-xl text-sm font-medium text-rose-300 hover:bg-rose-500/10 transition-colors group/logout">
        <span class="text-xl shrink-0 group-hover/logout:-translate-x-1 transition-transform">🚪</span>
        <span class="ml-4 opacity-0 md:opacity-100 group-hover:opacity-100 transition-opacity whitespace-nowrap">Log out</span>
      </button>
    </div>
  </aside>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../store/auth';

const router = useRouter();
const authStore = useAuthStore();

const logout = () => {
  authStore.logout();
  router.push('/login');
};
</script>

<style scoped>
@keyframes shine {
  100% {
    transform: translateX(100%);
  }
}
</style>
