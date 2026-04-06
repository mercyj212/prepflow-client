<template>
  <div class="min-h-screen bg-[#fafafa] dark:bg-zinc-950 flex transition-colors duration-300">
    
    <!-- Left panel - Branding / Decorative -->
    <div class="hidden lg:flex lg:w-1/2 relative bg-zinc-900 overflow-hidden flex-col justify-between p-12">
      <div class="z-10 mt-8 flex justify-between w-full pr-12">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-2xl transition-transform hover:scale-110">
            <svg class="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <span class="text-white font-black text-2xl tracking-tighter uppercase">PrepUp.<span class="text-indigo-500">CBT</span></span>
        </div>
        <ThemeToggle />
      </div>
      
      <div class="z-10 mb-20 max-w-md">
        <h1 class="text-4xl font-semibold text-white tracking-tight leading-[1.1] mb-6">
          Elevate your academic performance.
        </h1>
        <p class="text-zinc-400 text-lg leading-relaxed font-light">
          Access high-quality practice quizzes, intelligent study flashcards, and track your progress all in one unified platform.
        </p>
      </div>

      <!-- Simple geometric decoration -->
      <div class="absolute top-[20%] right-[-10%] w-96 h-96 bg-zinc-800/50 rounded-full blur-3xl mix-blend-overlay"></div>
      <div class="absolute bottom-[-10%] left-[10%] w-[30rem] h-[30rem] bg-indigo-500/10 rounded-full blur-3xl mix-blend-overlay"></div>
    </div>

    <!-- Right panel - Form -->
    <div class="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-24 bg-white dark:bg-zinc-950 transition-colors duration-300">
      <div class="w-full max-w-sm relative">
        <!--  OTP VERIFICATION MODAL -->
        <div v-if="showOTPModal" class="fixed inset-0 z-[110] flex items-center justify-center p-6 animate-in fade-in zoom-in duration-500">
          <div class="absolute inset-0 bg-zinc-950/60 backdrop-blur-md" @click="showOTPModal = false"></div>
          <div class="relative bg-white dark:bg-zinc-900 w-full max-w-md rounded-[32px] p-10 border border-zinc-100 dark:border-zinc-800 shadow-2xl text-center">
            
            <!-- Close Button -->
            <button @click="showOTPModal = false" class="absolute top-6 right-6 text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>

            <div class="w-16 h-16 bg-indigo-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg class="w-8 h-8 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A10.003 10.003 0 0012 3c1.268 0 2.47.234 3.576.659m-4.746 2.392A2.998 2.998 0 1117 8c0 .385-.073.753-.206 1.091" />
              </svg>
            </div>
            <h3 class="text-2xl font-black text-zinc-900 dark:text-white uppercase tracking-tight mb-2">Check Your Inbox</h3>
            <p class="text-zinc-500 dark:text-zinc-400 text-sm mb-8 leading-relaxed">
              We dispatched a fresh 6-digit identity node to **{{ unverifiedEmail }}**. Enter the code to activate your profile.
            </p>
            
            <div class="flex justify-between gap-2 mb-8">
              <input 
                v-for="(digit, i) in 6" :key="i"
                v-model="otpInputs[i]"
                @input="handleDigitInput($event, i)"
                @keydown.delete="handleDigitDelete($event, i)"
                ref="digitRefs"
                type="text"
                maxlength="1"
                class="w-full h-12 text-center text-xl font-black bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:border-indigo-500 dark:focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all text-zinc-900 dark:text-white"
              />
            </div>

            <div v-if="verifyError" class="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-[10px] font-bold uppercase tracking-wider">
              {{ verifyError }}
            </div>

            <button 
              @click="handleVerifyOTP"
              :disabled="otpInputs.join('').length < 6 || authStore.loading"
              class="w-full py-4 bg-zinc-900 dark:bg-white text-white dark:text-black font-black uppercase tracking-widest text-xs rounded-xl hover:scale-[1.02] active:scale-95 transition-all shadow-xl disabled:opacity-30"
            >
              <span v-if="!authStore.loading">Activate Identity -></span>
              <span v-else class="flex items-center justify-center gap-2">
                <div class="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                Verifying...
              </span>
            </button>

            <div class="mt-6 text-sm">
              <span class="text-zinc-500">Didn't receive the code? </span>
              <button @click="handleResendOTP" :disabled="authStore.loading" class="font-bold text-black dark:text-white hover:underline transition-all disabled:opacity-50">Resend Code</button>
            </div>
          </div>
        </div>

        <!-- Mobile Header -->
        <div class="flex items-center justify-between mb-12 lg:hidden">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-black dark:bg-white flex items-center justify-center shadow-lg">
              <svg class="w-6 h-6 text-white dark:text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <span class="text-black dark:text-white font-black text-2xl tracking-tighter uppercase">PrepUp.<span class="text-indigo-500">CBT</span></span>
          </div>
          <ThemeToggle />
        </div>

        <!-- Success Fancy Display -->
        <div v-if="showSuccess" class="fixed inset-0 z-[100] flex items-center justify-center bg-white/90 dark:bg-zinc-950/90 backdrop-blur-sm transition-all duration-700 animate-in fade-in">
          <div class="flex flex-col items-center gap-6 scale-up-center">
            <div class="w-16 h-16 rounded-full bg-black dark:bg-white flex items-center justify-center shadow-2xl">
              <svg class="w-8 h-8 text-white dark:text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path class="draw-path" stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <div class="text-center">
              <h3 class="text-2xl font-bold text-black dark:text-white mb-1">Welcome Back!</h3>
              <p class="text-zinc-500 dark:text-zinc-400">Login successful, redirecting...</p>
            </div>
          </div>
        </div>

        <div class="mb-8">
          <h2 class="text-2xl font-semibold text-zinc-900 dark:text-white tracking-tight">Log in</h2>
          <p class="text-sm text-zinc-500 dark:text-zinc-400 mt-2">Enter your credentials to access your account.</p>
        </div>
        
        <form class="space-y-5" @submit.prevent="handleLogin">
          <div>
            <label for="email" class="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">Email</label>
            <input
              id="email"
              type="email"
              required
              v-model="email"
              placeholder="m@example.com"
              class="block w-full rounded-md border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2 text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-600 focus:border-black dark:focus:border-white focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white transition-colors"
            />
          </div>
          
          <div>
            <div class="flex items-center justify-between mb-1.5">
              <label for="password" class="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Password</label>
              <router-link to="/forgot-password" class="text-sm font-medium text-zinc-500 hover:text-black dark:hover:text-white transition-colors">Forgot password?</router-link>
            </div>
            <div class="relative group">
              <input
                id="password"
                :type="showPassword ? 'text' : 'password'"
                required
                v-model="password"
                placeholder="••••••••"
                class="block w-full rounded-md border border-zinc-300 dark:border-zinc-700 bg-transparent pl-3 pr-10 py-2 text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-600 focus:border-black dark:focus:border-white focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white transition-colors"
              />
              <button 
                type="button" 
                @click="showPassword = !showPassword"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-black dark:hover:text-white transition-colors focus:outline-none"
              >
                <!-- ️ EYE ICON (Visible) -->
                <svg v-if="!showPassword" class="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <!-- ️ EYE ICON (Struck) -->
                <svg v-else class="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                </svg>
              </button>
            </div>
          </div>

          <div v-if="authStore.error" class="bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 text-sm p-3 rounded-md border border-red-100 dark:border-red-500/20 flex items-start gap-2">
            <svg class="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path></svg>
            <span class="pt-0.5">{{ authStore.error }}</span>
          </div>

          <button
            type="submit"
            :disabled="authStore.loading"
            class="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-md text-sm font-medium text-white dark:text-black bg-black dark:bg-white hover:bg-zinc-800 dark:hover:bg-zinc-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black dark:focus:ring-offset-zinc-950 disabled:opacity-50 transition-colors shadow-sm mt-4"
          >
            <div v-if="authStore.loading" class="w-4 h-4 border-2 border-white/30 dark:border-black/30 border-t-white dark:border-t-black rounded-full animate-spin mr-2"></div>
            {{ authStore.loading ? 'Signing in...' : 'Sign in' }}
          </button>
        </form>

        <div class="mt-8 text-center text-sm text-zinc-600 dark:text-zinc-400 border-t border-zinc-200 dark:border-zinc-800 pt-6">
          Don't have an account?
          <router-link to="/register" class="font-medium text-black dark:text-white hover:underline transition-all">
            Sign up ->
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick } from 'vue';
import { useAuthStore } from '../store/auth';
import { useRouter } from 'vue-router';
import ThemeToggle from '../components/ThemeToggle.vue';

const email = ref('');
const password = ref('');
const showPassword = ref(false);
const authStore = useAuthStore();
const router = useRouter();

const showSuccess = ref(false);

//  OTP STATE
const showOTPModal = ref(false);
const unverifiedEmail = ref('');
const otpInputs = ref(['', '', '', '', '', '']);
const digitRefs = ref([]);
const verifyError = ref('');

const handleDigitInput = (e, index) => {
  const val = e.target.value;
  if (val && index < 5) {
    nextTick(() => digitRefs.value[index + 1].focus());
  }
};
const handleDigitDelete = (e, index) => {
  if (!otpInputs.value[index] && index > 0) {
    nextTick(() => digitRefs.value[index - 1].focus());
  }
};

const handleVerifyOTP = async () => {
  try {
    const otp = otpInputs.value.join('');
    await authStore.verifyOTP(unverifiedEmail.value, otp);
    showOTPModal.value = false;
    showSuccess.value = true;
    setTimeout(() => {
      if (authStore.user && authStore.user.role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/dashboard');
      }
    }, 1500);
  } catch (err) {
    verifyError.value = err.response?.data?.message || 'Verification failed. Try again.';
  }
};

const handleResendOTP = async () => {
  try {
    await authStore.login(unverifiedEmail.value || email.value, password.value);
  } catch (err) {
    if (err.response?.status === 403) {
      verifyError.value = "A fresh code was dispatched. Check your inbox.";
    } else {
      verifyError.value = "Failed to resend code.";
    }
  }
};

const handleLogin = async () => {
  try {
    await authStore.login(email.value, password.value);
    
    // Fancy Success Display
    showSuccess.value = true;
    
    setTimeout(() => {
      if (authStore.user && authStore.user.role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/dashboard');
      }
    }, 1500); // Show fancy display for 1.5s
    
  } catch (error) {
    // ️ CATCH UNVERIFIED IDENTITY (403)
    if (error.response?.status === 403 && error.response?.data?.requiresVerification) {
      unverifiedEmail.value = error.response.data.email || email.value;
      showOTPModal.value = true;
      authStore.error = null; // Clear the visible red banner!
      nextTick(() => {
        if (digitRefs.value && digitRefs.value[0]) digitRefs.value[0].focus();
      });
      return;
    }

    console.error('Login failed:', error);
    setTimeout(() => {
      authStore.error = null;
    }, 4000);
  }
};
</script>

<style scoped>
.scale-up-center {
	animation: scale-up-center 0.4s cubic-bezier(0.390, 0.575, 0.565, 1.000) both;
}

@keyframes scale-up-center {
  0% { transform: scale(0.5); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}

.draw-path {
  stroke-dasharray: 100;
  stroke-dashoffset: 100;
  animation: draw 0.6s ease-out forwards;
  animation-delay: 0.3s;
}

@keyframes draw {
  to { stroke-dashoffset: 0; }
}

.animate-fade-in {
  animation: fadeIn 0.3s ease-out forwards;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
