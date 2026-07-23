<template>
  <div class="min-h-screen bg-[#fafafa] dark:bg-zinc-950 flex flex-col transition-colors duration-300 relative overflow-x-hidden">
    
    <!-- 🛡️ 1. OTP VERIFICATION MODAL -->
    <div v-if="showOTPModal" class="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-zinc-950/60 backdrop-blur-md animate-in fade-in zoom-in duration-300">
      <div class="relative bg-white dark:bg-zinc-900 w-full max-w-md rounded-[32px] p-10 border border-zinc-100 dark:border-zinc-800 shadow-2xl text-center">
        <!-- Close Button -->
        <button @click="showOTPModal = false" class="absolute top-6 right-6 text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">
          <X :size="24" />
        </button>

        <div class="w-16 h-16 bg-brand/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <Fingerprint :size="32" :stroke-width="2.5" class="text-brand" />
        </div>
        <h3 class="text-2xl font-black text-zinc-900 dark:text-white uppercase tracking-tight mb-2">Verify your email</h3>
        <p class="text-zinc-500 dark:text-zinc-400 text-sm mb-8 leading-relaxed">
          We've sent a 6-digit verification code to **{{ email }}**. Enter it below to activate your account.<br/>
          <span class="inline-flex items-center gap-2 mt-3 font-semibold text-amber-600 dark:text-amber-400 text-xs bg-amber-50 dark:bg-amber-500/10 px-3 py-1.5 rounded-lg border border-amber-200/50 dark:border-amber-500/20">
            <AlertCircle :size="14" />
            Please check your Spam or Junk folder!
          </span>
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
            class="w-full h-12 text-center text-xl font-black bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:border-brand dark:focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 transition-all text-zinc-900 dark:text-white"
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
          <span v-if="!authStore.loading" class="flex items-center justify-center gap-2">
            Verify & Finish
            <ArrowRight :size="16" />
          </span>
          <span v-else class="flex items-center justify-center gap-2">
            <div class="w-16 h-16 border-4 border-brand border-t-transparent rounded-full animate-spin"></div>
            Verifying...
          </span>
        </button>

        <div class="mt-6 text-sm">
          <span class="text-zinc-500">Didn't receive the code? </span>
          <button @click="handleResendOTP" :disabled="authStore.loading" class="font-bold text-black dark:text-white hover:underline transition-all disabled:opacity-50">Resend Code</button>
        </div>
      </div>
    </div>

    <!-- ⚠️ 2. REGISTRY CONFLICT MODAL -->
    <div v-if="showErrorModal" class="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-zinc-950/40 backdrop-blur-md animate-in fade-in zoom-in duration-300">
      <div class="relative bg-white dark:bg-zinc-900 w-full max-w-sm rounded-[32px] p-10 border border-zinc-100 dark:border-zinc-800 shadow-2xl text-center">
        <div class="w-20 h-20 bg-brand/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-brand/20">
          <AlertCircle :size="32" class="text-brand" />
        </div>
        <h3 class="text-xl font-black text-zinc-900 dark:text-white uppercase tracking-tight mb-2">Registry Alert</h3>
        <p class="text-zinc-500 dark:text-zinc-400 text-sm mb-8 leading-relaxed">
          {{ errorMsg }}
        </p>
        <div class="space-y-3">
          <router-link to="/login" class="block w-full py-3 bg-zinc-900 dark:bg-white text-white dark:text-black font-black uppercase tracking-widest text-xs rounded-xl">
            Enter Existing Profile
          </router-link>
          <button @click="showErrorModal = false" class="block w-full py-3 border border-zinc-200 dark:border-zinc-800 text-zinc-500 font-bold uppercase tracking-widest text-[10px] rounded-xl font-sans">
            Dismiss
          </button>
        </div>
      </div>
    </div>

    <!-- SESSION ACTIVE OVERLAY -->
    <div v-if="authStore.isAuthenticated" class="fixed inset-0 z-[220] flex items-center justify-center p-6 animate-in fade-in zoom-in duration-500">
      <div class="absolute inset-0 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl"></div>
      <div class="relative bg-white dark:bg-zinc-900 w-full max-w-md rounded-[40px] p-12 border border-zinc-100 dark:border-zinc-800 shadow-2xl text-center">
        <div class="w-24 h-24 rounded-full bg-brand/10 flex items-center justify-center mx-auto mb-8 border border-brand/20">
          <User :size="48" class="text-brand" />
        </div>
        <h3 class="text-3xl font-black text-zinc-900 dark:text-white tracking-tighter mb-4">Account Active</h3>
        <p class="text-zinc-500 dark:text-zinc-400 mb-10 leading-relaxed">
          You are currently signed in as <span class="font-bold text-zinc-900 dark:text-white">{{ authStore.user?.fullName }}</span>.
        </p>
        <div class="flex flex-col gap-4">
          <button @click="router.push('/dashboard')" class="w-full py-4 bg-zinc-900 dark:bg-white text-white dark:text-black font-black uppercase tracking-widest text-xs rounded-2xl hover:scale-[1.02] active:scale-95 transition-all shadow-xl">
            Continue to Dashboard
          </button>
          <button @click="handleSignOut" class="w-full py-4 border border-zinc-200 dark:border-zinc-800 text-zinc-500 font-bold uppercase tracking-widest text-[10px] rounded-2xl hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-all">
            Sign out and create new account
          </button>
        </div>
      </div>
    </div>

    <!-- MAIN INTERFACE -->
    <div class="flex-grow flex">
      <!-- Left panel - Branding -->
      <div class="hidden lg:flex lg:w-1/2 relative bg-zinc-900 bg-[url('/register-bg.jpg')] bg-cover bg-center overflow-hidden flex-col justify-between p-12 shadow-2xl">
        <!-- Image Dark Overlay -->
        <div class="absolute inset-0 bg-zinc-950/50 backdrop-blur-[2px]"></div>

        <div class="z-10 mt-8 flex justify-between w-full pr-12">
          <BrandLogo size="lg" theme="dark" />
          <ThemeToggle />
        </div>
        <div class="z-10 mb-36 max-w-md">
          <h1 class="text-4xl font-semibold text-white tracking-tight leading-[1.1] mb-6 drop-shadow-lg">Start your journey today.</h1>
          <p class="text-zinc-300 text-lg leading-relaxed font-light drop-shadow-md">Join thousands of students and enhance your test scores actively. Track your limits and discover your potential.</p>
        </div>
      </div>

      <!-- Right panel - Form -->
      <div class="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 sm:p-12 lg:p-16 bg-white dark:bg-zinc-950 transition-colors duration-300 min-h-screen overflow-y-auto">
        <div class="w-full max-w-sm relative">
          <!-- Mobile Header -->
          <div class="flex items-center justify-between mb-12 lg:hidden">
            <BrandLogo size="lg" />
            <ThemeToggle />
          </div>

          <div class="mb-6 text-center lg:text-left">
            <h2 class="text-2xl font-black text-zinc-900 dark:text-white tracking-tight uppercase">Join PrepUp</h2>
            <p class="text-xs text-zinc-500 dark:text-zinc-400 mt-1 font-sans">Instant 1-click registration or sign up below.</p>
          </div>

          <!-- ⚡ 1-CLICK GOOGLE REGISTRATION (PRIMARY TOP CHOICE) -->
          <div class="mb-6">
            <div class="relative group">
              <div class="w-full flex items-center justify-between py-3.5 px-5 rounded-2xl bg-zinc-900 dark:bg-white text-white dark:text-black transition-all font-bold text-sm hover:scale-[1.02] shadow-xl cursor-pointer">
                <div class="flex items-center gap-3">
                  <div class="bg-white p-1.5 rounded-full shadow-inner flex items-center justify-center">
                    <svg class="w-4 h-4" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                  </div>
                  <span>Continue with Google</span>
                </div>
                <span class="text-[10px] uppercase font-black tracking-widest px-2.5 py-1 rounded-full bg-white/20 dark:bg-black/10 text-white dark:text-black">
                  Instant
                </span>
              </div>
              <div class="absolute inset-0 z-10 overflow-hidden rounded-2xl">
                <div id="googleBtn" class="opacity-[0.01] scale-[5] origin-center cursor-pointer"></div>
              </div>
            </div>
          </div>

          <!-- DIVIDER -->
          <div class="relative flex items-center justify-center my-6">
            <div class="border-t border-zinc-200 dark:border-zinc-800 w-full"></div>
            <span class="bg-white dark:bg-zinc-950 px-3 text-[10px] font-black uppercase text-zinc-400 tracking-widest absolute">
              or register with email
            </span>
          </div>

          <form class="space-y-4" @submit.prevent="handleRegister">
            <div>
              <label for="fullName" class="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1 font-sans">Full Name</label>
              <input id="fullName" type="text" required v-model="fullName" placeholder="Jane Doe" class="block w-full rounded-xl border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 px-4 py-3 text-sm placeholder-zinc-400 focus:border-brand dark:focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand transition-all text-zinc-900 dark:text-white" />
            </div>

            <div>
              <label for="email" class="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1 font-sans">Email Address</label>
              <input id="email" type="email" required v-model="email" placeholder="jane@example.com" class="block w-full rounded-xl border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 px-4 py-3 text-sm placeholder-zinc-400 focus:border-brand dark:focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand transition-all text-zinc-900 dark:text-white" />
            </div>
            
            <div class="relative">
              <label for="password" class="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1 font-sans">Create Password</label>
              <div class="relative group">
                <input id="password" :type="showPassword ? 'text' : 'password'" required v-model="password" placeholder="••••••••" class="block w-full rounded-xl border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 px-4 py-3 text-sm text-zinc-900 dark:text-white placeholder-zinc-400 focus:ring-1 focus:ring-brand focus:border-brand transition-all outline-none" />
                <button type="button" @click="showPassword = !showPassword" class="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-black dark:hover:text-white transition-colors">
                  <Eye v-if="!showPassword" :size="18" :stroke-width="1.5" />
                  <EyeOff v-else :size="18" :stroke-width="1.5" />
                </button>
              </div>
              
              <!-- SECURITY CHECKLIST -->
              <div class="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-[10px]">
                <div :class="password.length >= 8 ? 'text-emerald-500' : 'text-zinc-500'" class="flex items-center gap-1 transition-colors font-medium">
                  <span>Min. 8 Chars</span>
                </div>
                <div :class="/[A-Z]/.test(password) ? 'text-emerald-500' : 'text-zinc-500'" class="flex items-center gap-1 transition-colors font-medium">
                  <span>Uppercase</span>
                </div>
                <div :class="/\d/.test(password) ? 'text-emerald-500' : 'text-zinc-500'" class="flex items-center gap-1 transition-colors font-medium">
                  <span>One Number</span>
                </div>
                <div :class="/[@$!%*?&]/.test(password) ? 'text-emerald-500' : 'text-zinc-500'" class="flex items-center gap-1 transition-colors font-medium">
                  <span>Special Symbol</span>
                </div>
              </div>
              
              <div class="mt-3 flex gap-1 h-1">
                <div v-for="i in 4" :key="i" class="flex-1 rounded-full transition-all duration-500" :class="[ i <= passwordStrength ? strengthColor : 'bg-zinc-100 dark:bg-zinc-800' ]"></div>
              </div>
            </div>

            <!-- CONFIRM PASSWORD FIELD -->
            <div class="relative pt-1">
              <label for="confirmPassword" class="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1 font-sans">Confirm Password</label>
              <div class="relative group">
                <input id="confirmPassword" :type="showConfirmPassword ? 'text' : 'password'" required v-model="confirmPassword" placeholder="••••••••" :class="[
                  isPasswordMatched === true ? 'border-emerald-500 focus:ring-emerald-500' : 
                  isPasswordMatched === false ? 'border-red-500 focus:ring-red-500' : 
                  'border-zinc-200 dark:border-zinc-800 focus:ring-brand'
                ]" class="block w-full rounded-xl bg-zinc-50/50 dark:bg-zinc-900/50 px-4 py-3 text-sm text-zinc-900 dark:text-white placeholder-zinc-400 focus:ring-1 transition-all outline-none" />
                <button type="button" @click="showConfirmPassword = !showConfirmPassword" class="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-black dark:hover:text-white transition-colors">
                  <Eye v-if="!showConfirmPassword" :size="18" :stroke-width="1.5" />
                  <EyeOff v-else :size="18" :stroke-width="1.5" />
                </button>
              </div>
              <div v-if="isPasswordMatched === true" class="mt-1 text-[10px] font-bold text-emerald-500 flex items-center gap-1">
                <span>✓ Passwords match</span>
              </div>
              <div v-else-if="isPasswordMatched === false" class="mt-1 text-[10px] font-bold text-red-500 flex items-center gap-1">
                <span>⚠️ Passwords do not match</span>
              </div>
            </div>

            <div class="pt-1">
              <label for="phone" class="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1 font-sans">Phone Number (Optional)</label>
              <div class="flex gap-2">
                <select v-model="countryCode" class="w-24 rounded-xl border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 px-2 py-2.5 text-[10px] font-black uppercase text-zinc-900 dark:text-white">
                  <option v-for="c in countries" :key="c.code" :value="c.dial">{{ c.dial }}</option>
                </select>
                <input id="phone" type="text" v-model="phone" placeholder="800 000 0000" class="block w-full rounded-xl border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 px-4 py-2.5 text-sm text-zinc-900 dark:text-white shadow-sm" />
              </div>
            </div>

            <button
              type="submit" :disabled="authStore.loading || passwordStrength < 4 || !isPasswordMatched"
              class="w-full flex justify-center items-center py-3.5 bg-black dark:bg-white text-white dark:text-black font-black uppercase tracking-widest text-xs rounded-xl hover:scale-[1.02] shadow-xl mt-5 transition-all disabled:opacity-30"
            >
              <div v-if="authStore.loading" class="w-4 h-4 border-2 border-white/30 dark:border-black/30 border-t-white dark:border-t-black rounded-full animate-spin mr-3"></div>
              <span class="flex items-center gap-2">
                Instant Register & Join
                <ArrowRight :size="16" />
              </span>
            </button>
          </form>

          <div class="mt-6 text-center text-xs font-medium">
            <span class="text-zinc-500">Already part of PrepUp? </span>
            <router-link to="/login" class="font-medium text-black dark:text-white hover:underline transition-all inline-flex items-center gap-1">
              Login
              <ArrowRight :size="14" />
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { 
  ref, 
  computed, 
  nextTick, 
  onMounted 
} from 'vue';
import { 
  Eye, 
  EyeOff, 
  ArrowRight, 
  AlertCircle,
  X,
  Fingerprint,
  User
} from 'lucide-vue-next';
import { useAuthStore } from '../store/auth';
import { useRouter } from 'vue-router';
import BrandLogo from '../components/BrandLogo.vue';
import ThemeToggle from '../components/ThemeToggle.vue';

const fullName = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const phone = ref('');
const showPassword = ref(false);
const showConfirmPassword = ref(false);
const countryCode = ref('+234');
const showOTPModal = ref(false);
const otpInputs = ref(['', '', '', '', '', '']);
const digitRefs = ref(null);
const verifyError = ref('');
const showErrorModal = ref(false);
const errorMsg = ref('');

const isPasswordMatched = computed(() => {
  if (!confirmPassword.value) return null;
  return password.value === confirmPassword.value;
});

const countries = [
  { code: 'NG', dial: '+234' }, { code: 'US', dial: '+1' }, { code: 'GB', dial: '+44' }, { code: 'GH', dial: '+233' }, { code: 'ZA', dial: '+27' }
];

const authStore = useAuthStore();
const router = useRouter();

const passwordChecks = computed(() => [
  { valid: password.value.length >= 8 }, 
  { valid: /[A-Z]/.test(password.value) }, 
  { valid: /[0-9]/.test(password.value) }, 
  { valid: /[^A-Za-z0-9]/.test(password.value) }
]);
const passwordStrength = computed(() => passwordChecks.value.filter(c => c.valid).length);
const strengthColor = computed(() => {
  if (passwordStrength.value <= 1) return 'bg-red-500';
  if (passwordStrength.value === 2) return 'bg-orange-500';
  if (passwordStrength.value === 3) return 'bg-yellow-500';
  return 'bg-emerald-500';
});

const handleDigitInput = (e, index) => {
  const val = e.target.value;
  if (val && index < 5) nextTick(() => digitRefs.value[index + 1].focus());
};
const handleDigitDelete = (e, index) => {
  if (!otpInputs.value[index] && index > 0) nextTick(() => digitRefs.value[index - 1].focus());
};

const handleSignOut = async () => {
  await authStore.logout();
  router.push('/register');
};

const handleRegister = async () => {
  try {
    errorMsg.value = '';
    const fullPhone = phone.value ? `${countryCode.value}${phone.value.replace(/\s+/g, '')}` : '';
    await authStore.register({ fullName: fullName.value, email: email.value, password: password.value, phone: fullPhone });
    
    router.push('/dashboard');
  } catch (error) {
    console.error('[AUTH]: Registration sequence failure.', error);
    errorMsg.value = error.response?.data?.message || 'Identity creation failed. Reference server logs.';
    showErrorModal.value = true;
  }
};

const handleVerifyOTP = async () => {
  try {
    const otp = otpInputs.value.join('');
    await authStore.verifyOTP(email.value, otp);
    router.push('/dashboard');
  } catch (err) {
    verifyError.value = err.response?.data?.message || 'Security code rejection.';
  }
};

const handleResendOTP = async () => {
  verifyError.value = '';
  try {
    await authStore.resendOTP(email.value);
    verifyError.value = "Identity code dispatched.";
  } catch (err) {
    verifyError.value = "Dispatch system throttled.";
  }
};

const handleGoogleLogin = async (response) => {
  try {
    await authStore.loginWithGoogle(response.credential);
    router.push('/dashboard');
  } catch (err) { console.error(err); }
};

onMounted(() => {
  if (typeof google !== 'undefined') {
    nextTick(() => {
      const btnEl = document.getElementById("googleBtn");
      if (btnEl) {
        google.accounts.id.initialize({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
          callback: handleGoogleLogin,
          auto_select: false,
          use_fedcm_for_prompt: false,
        });
        google.accounts.id.renderButton(btnEl, { type: "standard", theme: "outline", size: "large", width: "400" });
      }
    });
  }
});
</script>

<style scoped>
.animate-in { animation: modalIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
@keyframes modalIn {
  from { opacity: 0; transform: scale(0.95) translateY(10px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}
</style>
