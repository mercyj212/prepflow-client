<template>
  <div class="min-h-screen bg-[#fafafa] dark:bg-zinc-950 flex transition-colors duration-300">
    
    <!-- Left panel - Branding / Decorative -->
    <div class="hidden lg:flex lg:w-1/2 relative bg-zinc-900 overflow-hidden flex-col justify-between p-12">
      <div class="z-10 mt-8 flex justify-between w-full pr-12">
        <BrandLogo size="lg" />
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
            <h3 class="text-2xl font-black text-zinc-900 dark:text-white uppercase tracking-tight mb-2">Check your email</h3>
            <p class="text-zinc-500 dark:text-zinc-400 text-sm mb-8 leading-relaxed">
              We've sent a 6-digit verification code to **{{ unverifiedEmail }}**. Enter it below to activate your account.
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
              <span v-if="!authStore.loading">Verify & Log in -></span>
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
          <BrandLogo size="lg" />
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

        <!-- 🛡️ PREMIUM SOCIAL GATEWAY -->
        <div class="mt-8 pt-8 border-t border-zinc-100 dark:border-zinc-800">
          <div class="text-center mb-6">
            <span class="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 dark:text-zinc-500">Secure Identity Hub</span>
          </div>
          
          <div class="relative group">
            <!-- Professional Custom Button Base -->
            <div class="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 transition-all duration-300 group-hover:border-zinc-400 dark:group-hover:border-zinc-600 group-hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:group-hover:shadow-[0_8px_30px_rgb(0,0,0,0.2)]">
              <svg class="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              <span class="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Continue with Google</span>
            </div>

            <!-- Invisible SDK Trigger Overlay (Clipped with Safety Container) -->
            <div class="absolute inset-0 z-10 overflow-hidden rounded-xl">
              <div id="googleBtn" class="opacity-[0.01] scale-[5] origin-center cursor-pointer"></div>
            </div>
          </div>
        </div>

        <div class="mt-8 text-center text-sm text-zinc-600 dark:text-zinc-400 border-t border-zinc-200 dark:border-zinc-800 pt-6">
          Don't have an account?
          <router-link to="/register" class="font-medium text-black dark:text-white hover:underline transition-all">
            Create an account ->
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick, onMounted } from 'vue';
import { useAuthStore } from '../store/auth';
import { useRouter } from 'vue-router';
import BrandLogo from '../components/BrandLogo.vue';
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
  verifyError.value = '';
  try {
    await authStore.resendOTP(unverifiedEmail.value || email.value);
    verifyError.value = "A fresh code was dispatched. Check your inbox.";
  } catch (err) {
    verifyError.value = err.response?.data?.message || "Failed to resend code.";
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

// 🛡️ GOOGLE IDENTITY HUB INTEGRATION
const handleGoogleLogin = async (response) => {
  try {
    await authStore.loginWithGoogle(response.credential);
    showSuccess.value = true;
    setTimeout(() => {
      if (authStore.user && authStore.user.role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/dashboard');
      }
    }, 1500);
  } catch (error) {
    console.error('[GOOGLE HUB ERROR]:', error);
  }
};

onMounted(() => {
  /* global google */
  if (typeof google !== 'undefined') {
    google.accounts.id.initialize({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID_HERE',
      callback: handleGoogleLogin,
      auto_select: false, // Don't auto-select to keep professional control
    });

    // 🛡️ Enable One-Tap (The clean top-right prompt)
    google.accounts.id.prompt(); 

    google.accounts.id.renderButton(
      document.getElementById("googleBtn"),
      { 
        type: "standard",
        theme: "outline", 
        size: "large", 
        width: "400", // Large enough to cover our custom button container
      }
    );
  }
});
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
