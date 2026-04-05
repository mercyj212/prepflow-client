<template>
  <div class="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center p-6 transition-colors duration-500">
    
    <!-- 🛡️ SOVEREIGN VERIFICATION CONTAINER -->
    <div v-if="loading" class="flex flex-col items-center gap-6 animate-pulse">
      <div class="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      <div class="text-center">
        <h2 class="text-2xl font-black text-zinc-900 dark:text-white tracking-tight uppercase">Identity Analysis</h2>
        <p class="text-zinc-500 dark:text-zinc-400 text-sm mt-1">Validating your academic credentials...</p>
      </div>
    </div>

    <!-- 🍱 SUCCESS MODAL -->
    <div v-else-if="success" 
         class="bg-white dark:bg-zinc-900 w-full max-w-md rounded-[40px] p-12 border border-zinc-100 dark:border-zinc-800 shadow-2xl shadow-emerald-500/10 text-center animate-fade-in">
      <div class="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-8">
        <svg class="w-10 h-10 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h2 class="text-3xl font-black text-zinc-900 dark:text-white tracking-tighter uppercase mb-4">Identity Confirmed</h2>
      <p class="text-zinc-500 dark:text-zinc-400 leading-relaxed mb-10">
        Your PrepUp CBT account is now officially activated. You have full access to our global academic network.
      </p>
      <router-link to="/login" 
                   class="inline-block w-full py-4 bg-zinc-900 dark:bg-white text-white dark:text-black font-black uppercase tracking-widest rounded-2xl hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-zinc-950/20 dark:shadow-none">
        Enter Command Center ->
      </router-link>
    </div>

    <!-- 🚫 ERROR MODAL -->
    <div v-else 
         class="bg-white dark:bg-zinc-900 w-full max-w-md rounded-[40px] p-12 border border-zinc-100 dark:border-zinc-800 shadow-2xl shadow-red-500/10 text-center animate-fade-in">
      <div class="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-8">
        <svg class="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </div>
      <h2 class="text-3xl font-black text-zinc-900 dark:text-white tracking-tighter uppercase mb-4">Link Invalid</h2>
      <p class="text-zinc-500 dark:text-zinc-400 leading-relaxed mb-10">
        This verification beacon has expired or is invalid. Please request a new identity badge from your dashboard.
      </p>
      <router-link to="/register" 
                   class="inline-block w-full py-4 border-2 border-zinc-900 dark:border-white text-zinc-900 dark:text-white font-black uppercase tracking-widest rounded-2xl hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all">
        Back to Registration
      </router-link>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';

const route = useRoute();
const router = useRouter();

const loading = ref(true);
const success = ref(false);
const message = ref('');

onMounted(async () => {
  const token = route.params.token;
  if (!token) {
    loading.value = false;
    return;
  }

  try {
    const res = await axios.get(`http://localhost:5000/api/auth/verify-email/${token}`);
    success.value = true;
    message.value = res.data.message;
  } catch (err) {
    success.value = false;
    message.value = err.response?.data?.message || 'Verification failed';
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.6s cubic-bezier(0.23, 1, 0.32, 1) forwards;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); filter: blur(10px); }
  to { opacity: 1; transform: translateY(0); filter: blur(0); }
}
</style>
