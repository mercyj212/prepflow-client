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
          Start your journey today.
        </h1>
        <p class="text-zinc-400 text-lg leading-relaxed font-light">
          Join thousands of students and enhance your test scores actively. Track your limits and discover your potential.
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
            <h3 class="text-2xl font-black text-zinc-900 dark:text-white uppercase tracking-tight mb-2">Verify your email</h3>
            <p class="text-zinc-500 dark:text-zinc-400 text-sm mb-8 leading-relaxed">
              We've sent a 6-digit verification code to **{{ email }}**. Enter it below to activate your account.
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
              <span v-if="!authStore.loading">Verify & Finish -></span>
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

        <!--  REGISTRY CONFLICT MODAL -->
        <div v-if="showErrorModal" class="fixed inset-0 z-[110] flex items-center justify-center p-6 animate-in fade-in zoom-in duration-500">
          <div class="absolute inset-0 bg-zinc-950/40 backdrop-blur-md" @click="showErrorModal = false"></div>
          <div class="relative bg-white dark:bg-zinc-900 w-full max-w-sm rounded-[32px] p-10 border border-zinc-100 dark:border-zinc-800 shadow-2xl text-center">
            <div class="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg class="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 class="text-xl font-black text-zinc-900 dark:text-white uppercase tracking-tight mb-2">Registry Alert</h3>
            <p class="text-zinc-500 dark:text-zinc-400 text-sm mb-8 leading-relaxed">
              {{ errorMsg }}
            </p>
            <div class="space-y-3">
              <router-link to="/login" class="block w-full py-3 bg-zinc-900 dark:bg-white text-white dark:text-black font-black uppercase tracking-widest text-xs rounded-xl">
                Enter Existing Profile
              </router-link>
              <button @click="showErrorModal = false" class="block w-full py-3 border border-zinc-200 dark:border-zinc-800 text-zinc-500 font-bold uppercase tracking-widest text-[10px] rounded-xl">
                Dismiss
              </button>
            </div>
          </div>
        </div>

        <div class="mb-8 text-center lg:text-left">
          <h2 class="text-2xl font-black text-zinc-900 dark:text-white tracking-tight uppercase">Create your account</h2>
          <p class="text-sm text-zinc-500 dark:text-zinc-400 mt-2">Join thousands of students and start your journey today.</p>
        </div>
        
        <form class="space-y-4" @submit.prevent="handleRegister">
          <div>
            <label for="fullName" class="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">Full Name</label>
            <input
              id="fullName"
              type="text"
              required v-model="fullName" placeholder="Jane Doe"
              class="block w-full rounded-xl border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 px-4 py-3 placeholder-zinc-400 focus:border-black dark:focus:border-white focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white transition-all text-zinc-900 dark:text-white"
            />
          </div>

          <div>
            <label for="email" class="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">Email Address</label>
            <input
              id="email"
              type="email"
              required v-model="email" placeholder="jane@example.com"
              class="block w-full rounded-xl border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 px-4 py-3 placeholder-zinc-400 focus:border-black dark:focus:border-white focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white transition-all text-zinc-900 dark:text-white"
            />
          </div>
          
          <div class="relative">
            <label for="password" class="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">Security Password</label>
            <div class="relative group">
              <input
                id="password"
                :type="showPassword ? 'text' : 'password'"
                required v-model="password" placeholder="••••••••"
                class="block w-full rounded-xl border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 px-4 pr-12 py-3 placeholder-zinc-400 focus:border-black dark:focus:border-white focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white transition-all text-zinc-900 dark:text-white"
              />
              <button 
                type="button" 
                @click="showPassword = !showPassword"
                class="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-black dark:hover:text-white transition-colors"
              >
                <svg v-if="!showPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7zm5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29M3 3l18 18"/></svg>
              </button>
            </div>
            
            <!-- ️ SECURITY SENTINEL CHECKLIST -->
            <div class="mt-2.5 grid grid-cols-2 gap-x-4 gap-y-1.5 text-[10px] sm:text-xs">
              <div :class="password.length >= 8 ? 'text-emerald-500' : 'text-zinc-500'" class="flex items-center gap-1.5 transition-colors font-medium">
                <i class="fas h-3 w-3" :class="password.length >= 8 ? 'fa-check-circle text-emerald-500' : 'fa-circle-notch'"></i>
                <span>Min. 8 Chars</span>
              </div>
              <div :class="/[A-Z]/.test(password) ? 'text-emerald-500' : 'text-zinc-500'" class="flex items-center gap-1.5 transition-colors font-medium">
                <i class="fas h-3 w-3" :class="/[A-Z]/.test(password) ? 'fa-check-circle text-emerald-500' : 'fa-circle-notch'"></i>
                <span>Uppercase</span>
              </div>
              <div :class="/\d/.test(password) ? 'text-emerald-500' : 'text-zinc-500'" class="flex items-center gap-1.5 transition-colors font-medium">
                <i class="fas h-3 w-3" :class="/\d/.test(password) ? 'fa-check-circle text-emerald-500' : 'fa-circle-notch'"></i>
                <span>One Number</span>
              </div>
              <div :class="/[@$!%*?&]/.test(password) ? 'text-emerald-500' : 'text-zinc-500'" class="flex items-center gap-1.5 transition-colors font-medium">
                <i class="fas h-3 w-3" :class="/[@$!%*?&]/.test(password) ? 'fa-check-circle text-emerald-500' : 'fa-circle-notch'"></i>
                <span>Special Symbol</span>
              </div>
            </div>
            
            <!-- Strength Meter -->
            <div class="mt-4 flex gap-1.5 h-1.5">
              <div v-for="i in 4" :key="i" class="flex-1 rounded-full transition-all duration-500" :class="[ i <= passwordStrength ? strengthColor : 'bg-zinc-100 dark:bg-zinc-800' ]"></div>
            </div>
          </div>

          <div class="pt-2">
            <label for="phone" class="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">Phone Number (Optional)</label>
            <div class="flex gap-2">
              <select v-model="countryCode" class="w-24 rounded-xl border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 px-3 py-3 text-xs font-black uppercase text-zinc-900 dark:text-white">
                <option v-for="c in countries" :key="c.code" :value="c.dial">{{ c.flag }} {{ c.dial }}</option>
              </select>
              <input id="phone" type="text" v-model="phone" placeholder="800 000 0000" class="block w-full rounded-xl border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 px-4 py-3 text-zinc-900 dark:text-white" />
            </div>
          </div>

          <button
            type="submit" :disabled="authStore.loading || passwordStrength < 3"
            class="w-full flex justify-center items-center py-4 bg-black dark:bg-white text-white dark:text-black font-black uppercase tracking-widest text-xs rounded-2xl hover:scale-[1.02] shadow-xl mt-6 transition-all disabled:opacity-30"
          >
            <div v-if="authStore.loading" class="w-4 h-4 border-2 border-white/30 dark:border-black/30 border-t-white dark:border-t-black rounded-full animate-spin mr-3"></div>
            Continue to Verification ->
          </button>
        </form>

        <!-- 🛡️ PREMIUM SOCIAL GATEWAY -->
        <div class="mt-8 pt-8 border-t border-zinc-100 dark:border-zinc-800">
          <div class="text-center mb-6">
            <span class="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 dark:text-zinc-500">Secure Enrollment Hub</span>
          </div>
          
          <div class="relative group">
            <div class="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 transition-all duration-300 group-hover:border-zinc-400 dark:group-hover:border-zinc-600 group-hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:group-hover:shadow-[0_8px_30px_rgb(0,0,0,0.2)]">
              <svg class="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              <span class="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Sign up with Google</span>
            </div>

            <!-- Invisible SDK Trigger Overlay (Clipped with Safety Container) -->
            <div class="absolute inset-0 z-10 overflow-hidden rounded-xl">
              <div id="googleBtn" class="opacity-[0.01] scale-[5] origin-center cursor-pointer"></div>
            </div>
          </div>
        </div>
        
        <div class="mt-8 text-center text-xs sm:text-sm font-medium">
          <span class="text-zinc-500">Already have an identity node? </span>
          <router-link to="/login" class="text-indigo-500 dark:text-indigo-400 font-bold hover:underline transition-all">
            Access your account ->
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, nextTick, onMounted } from 'vue';
import { useAuthStore } from '../store/auth';
import { useRouter } from 'vue-router';
import BrandLogo from '../components/BrandLogo.vue';
import ThemeToggle from '../components/ThemeToggle.vue';

const fullName = ref('');
const email = ref('');
const password = ref('');
const phone = ref('');
const showPassword = ref(false);
const countryCode = ref('+234');

//  OTP STATE
const showOTPModal = ref(false);
const otpInputs = ref(['', '', '', '', '', '']);
const digitRefs = ref([]);
const verifyError = ref('');

//  UI STATE
const showErrorModal = ref(false);
const errorMsg = ref('');

const countries = [
  { code: 'NG', dial: '+234', flag: '' },
  { code: 'US', dial: '+1', flag: '' },
  { code: 'GB', dial: '+44', flag: '' },
  { code: 'GH', dial: '+233', flag: '' },
  { code: 'ZA', dial: '+27', flag: '' },
  { code: 'CA', dial: '+1', flag: '' },
  { code: 'IN', dial: '+91', flag: '' },
];

const authStore = useAuthStore();
const router = useRouter();

// ️ PASSWORDS
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

//  OTP HANDLERS
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

const handleRegister = async () => {
  try {
    const fullPhone = phone.value ? `${countryCode.value}${phone.value.replace(/\s+/g, '')}` : '';
    await authStore.register({
      fullName: fullName.value,
      email: email.value,
      password: password.value,
      phone: fullPhone
    });
    showOTPModal.value = true;
    nextTick(() => digitRefs.value[0].focus());
  } catch (error) {
    const msg = error.response?.data?.message || 'Registration failed';
    errorMsg.value = msg;
    showErrorModal.value = true;
  }
};

const handleVerifyOTP = async () => {
  try {
    const otp = otpInputs.value.join('');
    await authStore.verifyOTP(email.value, otp);
    router.push('/dashboard');
  } catch (err) {
    verifyError.value = err.response?.data?.message || 'Verification failed. Try again.';
  }
};

const handleResendOTP = async () => {
  verifyError.value = '';
  try {
    await authStore.resendOTP(email.value);
    verifyError.value = "A fresh code was dispatched. Check your inbox.";
  } catch (err) {
    verifyError.value = err.response?.data?.message || "Failed to resend code.";
  }
};

// 🛡️ GOOGLE IDENTITY HUB INTEGRATION
const handleGoogleLogin = async (response) => {
  try {
    await authStore.loginWithGoogle(response.credential);
    router.push('/dashboard');
  } catch (error) {
    console.error('[GOOGLE HUB ERROR]:', error);
  }
};

onMounted(() => {
  /* global google */
  if (typeof google !== 'undefined') {
    google.accounts.id.initialize({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      callback: handleGoogleLogin,
      auto_select: false,
    });

    // 🛡️ Enable One-Tap
    google.accounts.id.prompt();

    google.accounts.id.renderButton(
      document.getElementById("googleBtn"),
      { 
        type: "standard",
        theme: "outline", 
        size: "large", 
        width: "400",
      }
    );
  }
});
</script>

<style scoped>
.animate-fade-in { animation: fadeIn 0.4s ease-out forwards; }
@keyframes fadeIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
</style>
