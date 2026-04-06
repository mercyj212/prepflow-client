<template>
  <div class="min-h-screen bg-[#fafafa] dark:bg-zinc-950 flex flex-col transition-colors duration-500">
    <div class="flex-grow flex items-center justify-center p-6">
    
    <div class="w-full max-w-sm relative">
      <!-- 🍱 SUCCESS MODAL -->
      <div v-if="success" class="text-center animate-in fade-in zoom-in duration-500">
        <div class="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-emerald-500/20">
          <svg class="w-10 h-10 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 class="text-3xl font-black text-zinc-900 dark:text-white tracking-tighter uppercase mb-4">Password Updated</h2>
        <p class="text-zinc-500 dark:text-zinc-400 leading-relaxed mb-8">
          Your account credentials have been successfully updated. You may now return to the login screen and enter the student dashboard.
        </p>
        <router-link to="/login" class="inline-block w-full py-4 bg-zinc-900 dark:bg-white text-white dark:text-black font-black uppercase tracking-widest rounded-2xl hover:scale-105 transition-all shadow-xl">
          Return to Login ->
        </router-link>
      </div>

      <!-- 🛡️ RESET FORM -->
      <div v-else class="animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div class="text-center mb-10">
          <div class="flex items-center justify-center gap-3 mb-8">
            <div class="w-12 h-12 rounded-2xl bg-black dark:bg-white flex items-center justify-center shadow-xl">
              <svg class="w-7 h-7 text-white dark:text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
          </div>
          <h2 class="text-3xl font-black text-zinc-900 dark:text-white tracking-tight uppercase">Password Reset</h2>
          <p class="text-zinc-500 dark:text-zinc-400 mt-2 text-sm">Updating your student security credentials.</p>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-6">
          <div class="relative">
            <label for="password" class="block text-xs font-black uppercase tracking-widest text-zinc-500 dark:text-zinc-400 mb-2">New security credentials</label>
            <div class="relative group">
              <input
                id="password"
                :type="showPassword ? 'text' : 'password'"
                v-model="password"
                required
                placeholder="••••••••"
                class="block w-full rounded-2xl border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-5 py-4 text-zinc-900 dark:text-white placeholder-zinc-400 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
              />
              <button 
                type="button" 
                @click="showPassword = !showPassword"
                class="absolute right-5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-black dark:hover:text-white transition-colors"
              >
                <svg v-if="!showPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7zm5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29M3 3l18 18"/></svg>
              </button>
            </div>
            
            <!-- 🛡️ PASSWORD SENTINEL UI -->
            <div class="mt-4 space-y-3">
              <div class="flex gap-1.5 h-1.5">
                <div v-for="i in 4" :key="i" class="flex-1 rounded-full transition-all duration-500" :class="[ i <= passwordStrength ? strengthColor : 'bg-zinc-100 dark:bg-zinc-800' ]"></div>
              </div>
              <div class="grid grid-cols-2 gap-2 mt-2">
                <div v-for="(check, index) in passwordChecks" :key="index" class="flex items-center gap-1.5 transition-all duration-300" :class="check.valid ? 'text-emerald-600 dark:text-emerald-400' : 'text-zinc-400 dark:text-zinc-600'">
                  <svg class="w-3.5 h-3.5" :class="check.valid ? 'opacity-100' : 'opacity-30'" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path></svg>
                  <span class="text-[10px] font-black uppercase tracking-wider">{{ check.label }}</span>
                </div>
              </div>
            </div>
          </div>

          <div v-if="error" class="text-red-500 text-[10px] font-black uppercase tracking-wider text-center p-3 bg-red-500/10 rounded-xl border border-red-500/20">
            {{ error }}
          </div>

          <button
            type="submit"
            :disabled="loading || passwordStrength < 3"
            class="w-full flex justify-center items-center py-4 bg-black dark:bg-white text-white dark:text-black font-black uppercase tracking-widest text-xs rounded-2xl hover:scale-[1.02] active:scale-95 transition-all shadow-xl disabled:opacity-30"
          >
            <div v-if="loading" class="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-3"></div>
            {{ loading ? 'Updating...' : 'Confirm New Password ->' }}
          </button>
        </form>
      </div>
    </div>
    </div>
    <AppFooter />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from '../store/auth';
import AppFooter from '../components/AppFooter.vue';

const route = useRoute();
const authStore = useAuthStore();

const password = ref('');
const showPassword = ref(false);
const success = ref(false);
const error = ref('');
const loading = ref(false);

const passwordChecks = computed(() => [
  { label: '8+ Characters', valid: password.value.length >= 8 },
  { label: 'Uppercase', valid: /[A-Z]/.test(password.value) },
  { label: 'Number', valid: /[0-9]/.test(password.value) },
  { label: 'Special Symbol', valid: /[^A-Za-z0-9]/.test(password.value) }
]);

const passwordStrength = computed(() => passwordChecks.value.filter(c => c.valid).length);

const strengthColor = computed(() => {
  if (passwordStrength.value === 1) return 'bg-red-500';
  if (passwordStrength.value === 2) return 'bg-orange-500';
  if (passwordStrength.value === 3) return 'bg-yellow-500';
  return 'bg-emerald-500';
});

const handleSubmit = async () => {
  loading.value = true;
  error.value = '';
  try {
    await authStore.resetPassword(route.params.token, password.value);
    success.value = true;
  } catch (err) {
    error.value = err.response?.data?.message || 'Override attempt failed.';
  } finally {
    loading.value = false;
  }
};
</script>
