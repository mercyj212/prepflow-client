<template>
  <div class="min-h-screen bg-[#fafafa] dark:bg-zinc-950 flex flex-col transition-colors duration-500">
    <div class="flex-grow flex items-center justify-center p-6">
    
    <div class="w-full max-w-sm relative">
      <!-- 🍱 SUCCESS MODAL -->
      <div v-if="submitted" class="text-center animate-in fade-in zoom-in duration-500">
        <div class="w-20 h-20 bg-indigo-500/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-indigo-500/20">
          <svg class="w-10 h-10 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <h2 class="text-3xl font-black text-zinc-900 dark:text-white tracking-tighter uppercase mb-4">Recovery Link Sent</h2>
        <p class="text-zinc-500 dark:text-zinc-400 leading-relaxed mb-8">
          If an account exists for <span class="font-black text-black dark:text-white">{{ email }}</span>, a secure reset link will arrive shortly. Please check your inbox.
        </p>
        <router-link to="/login" class="inline-block w-full py-4 bg-zinc-900 dark:bg-white text-white dark:text-black font-black uppercase tracking-widest rounded-2xl hover:scale-105 transition-all shadow-xl">
          Back to Login ->
        </router-link>
      </div>

      <!-- 🏹 REQUEST FORM -->
      <div v-else class="animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div class="text-center mb-10">
          <div class="flex items-center justify-center gap-3 mb-8">
            <div class="w-12 h-12 rounded-2xl bg-black dark:bg-white flex items-center justify-center shadow-xl">
              <svg class="w-7 h-7 text-white dark:text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
          </div>
          <h2 class="text-3xl font-black text-zinc-900 dark:text-white tracking-tight uppercase">Account Recovery</h2>
          <p class="text-zinc-500 dark:text-zinc-400 mt-2 text-sm">Enter your email to receive password reset instructions.</p>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-6">
          <div>
            <label for="email" class="block text-xs font-black uppercase tracking-widest text-zinc-500 dark:text-zinc-400 mb-2">Registered Email Address</label>
            <input
              id="email"
              type="email"
              v-model="email"
              required
              placeholder="jane@scholar.com"
              class="block w-full rounded-2xl border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-5 py-4 text-zinc-900 dark:text-white placeholder-zinc-400 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
            />
          </div>

          <div v-if="error" class="text-red-500 text-[10px] font-black uppercase tracking-wider text-center p-3 bg-red-500/10 rounded-xl border border-red-500/20">
            {{ error }}
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="w-full flex justify-center items-center py-4 bg-black dark:bg-white text-white dark:text-black font-black uppercase tracking-widest text-xs rounded-2xl hover:scale-[1.02] active:scale-95 transition-all shadow-xl disabled:opacity-30"
          >
            <div v-if="loading" class="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-3"></div>
            {{ loading ? 'Processing...' : 'Send Recovery Link ->' }}
          </button>
          
          <div class="text-center pt-4">
            <router-link to="/login" class="text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-black dark:hover:text-white transition-colors">
              Return to Login Portal
            </router-link>
          </div>
        </form>
      </div>
    </div>
    </div>
    <AppFooter />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '../store/auth';
import AppFooter from '../components/AppFooter.vue';

const email = ref('');
const submitted = ref(false);
const error = ref('');
const loading = ref(false);
const authStore = useAuthStore();

const handleSubmit = async () => {
  loading.value = true;
  error.value = '';
  try {
    await authStore.forgotPassword(email.value);
    submitted.value = true;
  } catch (err) {
    error.value = err.response?.data?.message || 'Identity node not found.';
  } finally {
    loading.value = false;
  }
};
</script>
