<template>
  <NeoAppShell>
    <div class="min-h-[80vh] flex items-center justify-center px-4 py-20">
      <!-- Checkout Container -->
      <div class="w-full max-w-[1000px] grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        
        <!-- Left: Course Info -->
        <div class="space-y-12 animate-in slide-in-from-left duration-700">
          <div>
            <router-link 
              to="/subjects" 
              class="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors mb-8"
            >
              <ArrowLeft :size="14" />
              Back to Courses
            </router-link>
            
            <div class="w-20 h-20 rounded-[32px] bg-zinc-900 dark:bg-white flex items-center justify-center mb-10 shadow-neo">
              <CreditCard :size="36" class="text-white dark:text-zinc-900" />
            </div>
            
            <h1 class="text-[56px] font-medium tracking-tighter leading-[0.9] text-zinc-900 dark:text-zinc-100 mb-6">
              Complete your <br/> enrollment.
            </h1>
            <p class="text-[18px] font-normal text-zinc-500 dark:text-zinc-500 leading-relaxed max-w-md">
              You're one step away from unlocking <span class="text-zinc-900 dark:text-zinc-200 font-bold">{{ course?.title }}</span>. 
              Gain full access to the most comprehensive study engine in West Africa.
            </p>
          </div>

          <!-- Feature Grid -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div v-for="feature in features" :key="feature.title" class="space-y-2">
              <div class="flex items-center gap-3">
                <div class="w-6 h-6 rounded-full bg-zinc-900 dark:bg-white flex items-center justify-center">
                  <Check :size="12" class="text-white dark:text-zinc-900" />
                </div>
                <h3 class="text-[13px] font-black uppercase tracking-widest text-zinc-900 dark:text-zinc-100">{{ feature.title }}</h3>
              </div>
              <p class="text-[12px] text-zinc-500 leading-snug">{{ feature.desc }}</p>
            </div>
          </div>
        </div>

        <!-- Right: Checkout Card -->
        <div class="lg:sticky lg:top-24 animate-in slide-in-from-right duration-700">
          <NeoCard variant="extruded" class="p-10 !rounded-[48px]">
            <div v-if="loading" class="py-20 flex flex-col items-center justify-center gap-4">
              <Loader2 class="animate-spin text-zinc-300" :size="48" />
              <p class="text-[12px] font-black uppercase tracking-widest text-zinc-400">Fetching Details...</p>
            </div>

            <template v-else-if="course">
              <div class="mb-12">
                <p class="text-[11px] font-black uppercase tracking-[0.3em] text-zinc-400 mb-4">Summary</p>
                <div class="flex justify-between items-end">
                  <h2 class="text-[28px] font-medium tracking-tight text-zinc-900 dark:text-zinc-100">{{ course.title }}</h2>
                  <div class="text-right">
                    <span class="text-[14px] font-medium text-zinc-400 line-through mr-2">₦5,000</span>
                    <span class="text-[32px] font-medium text-zinc-900 dark:text-zinc-100">₦{{ course.price?.toLocaleString() }}</span>
                  </div>
                </div>
              </div>

              <div class="space-y-6 mb-12">
                <div class="flex justify-between text-[14px] py-4 border-b border-zinc-100 dark:border-white/5">
                  <span class="text-zinc-500">Service Fee</span>
                  <span class="text-zinc-900 dark:text-zinc-200 font-medium">₦0.00</span>
                </div>
                <div class="flex justify-between text-[18px] font-bold py-2">
                  <span class="text-zinc-900 dark:text-zinc-100">Total</span>
                  <span class="text-zinc-900 dark:text-zinc-100">₦{{ course.price?.toLocaleString() }}</span>
                </div>
              </div>

              <button 
                @click="initiatePayment"
                :disabled="isProcessing"
                class="w-full h-20 rounded-[24px] bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-[16px] font-black uppercase tracking-[0.2em] hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-4 disabled:opacity-50 shadow-neo-dark dark:shadow-neo-light mb-6"
              >
                <Loader2 v-if="isProcessing" class="animate-spin" :size="24" />
                <span v-else>Pay with Paystack</span>
                <ArrowRight v-if="!isProcessing" :size="24" />
              </button>

              <div class="flex items-center justify-center gap-6 opacity-30">
                <img src="/paypal-logo.svg" class="h-6 dark:invert" alt="PayPal" />
                <div class="h-6 w-px bg-zinc-300 dark:bg-zinc-700"></div>
                <img src="/paystack-logo.svg" class="h-6 dark:invert" alt="Paystack" />
              </div>
            </template>
          </NeoCard>

          <p class="mt-10 text-center text-[11px] font-medium text-zinc-400 leading-relaxed">
            By completing this purchase, you agree to our <br/>
            <router-link to="/help" class="text-zinc-900 dark:text-zinc-200 underline underline-offset-4">Terms of Service</router-link> and <router-link to="/help" class="text-zinc-900 dark:text-zinc-200 underline underline-offset-4">Refund Policy</router-link>.
          </p>
        </div>

      </div>
    </div>
  </NeoAppShell>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { CreditCard, Check, ArrowRight, ArrowLeft, Loader2 } from 'lucide-vue-next';
import api from '../api/axios';
import { useAuthStore } from '../store/auth';
import NeoAppShell from '../components/layout/NeoAppShell.vue';
import NeoCard from '../components/common/NeoCard.vue';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

const loading = ref(true);
const isProcessing = ref(false);
const course = ref(null);

const features = [
  { title: 'Full Curriculum', desc: 'Complete access to all levels and modules.' },
  { title: 'AI Training', desc: 'Neural analysis of your weak points.' },
  { title: 'Past Questions', desc: '10+ years of verified exam history.' },
  { title: 'Offline Mode', desc: 'Download materials for study anywhere.' }
];

const fetchCourseDetails = async () => {
  loading.value = true;
  try {
    const { data } = await api.get(`/courses`);
    // Find the course from the list (ideally we should have a getCourseById endpoint)
    course.value = data.find(c => c._id === route.params.courseId);
    
    if (!course.value) {
      router.push('/subjects');
    }
    
    // If they already have access, redirect them back
    if (course.value.hasAccess) {
      router.push('/subjects');
    }
  } catch (err) {
    console.error('[CHECKOUT_FETCH_ERR]:', err);
    router.push('/subjects');
  } finally {
    loading.value = false;
  }
};

const loadPaystack = () => {
  return new Promise((resolve) => {
    if (window.PaystackPop) return resolve();
    const script = document.createElement('script');
    script.src = 'https://js.paystack.co/v1/inline.js';
    script.async = true;
    script.onload = resolve;
    document.body.appendChild(script);
  });
};

const initiatePayment = async () => {
  if (isProcessing.value) return;
  
  if (!import.meta.env.VITE_PAYSTACK_PUBLIC_KEY) {
    alert('Payment system configuration missing. Please contact support.');
    console.error('[PAYMENT_ERROR]: VITE_PAYSTACK_PUBLIC_KEY is not defined.');
    return;
  }

  isProcessing.value = true;
  
  try {
    await loadPaystack();
    
    const { data } = await api.post('/payments/initialize', {
      courseId: course.value._id
    });
    
    const handler = window.PaystackPop.setup({
      key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
      email: authStore.user.email,
      amount: course.value.price * 100,
      ref: data.reference,
      onClose: () => {
        isProcessing.value = false;
      },
      callback: (response) => {
        handlePaymentSuccess(response);
      }
    });
    
    handler.openIframe();
  } catch (err) {
    console.error('[PAYMENT_INIT_ERR]:', err);
    alert(err.response?.data?.message || 'Payment initiation failed.');
    isProcessing.value = false;
  }
};

const handlePaymentSuccess = async (response) => {
  try {
    await api.get(`/payments/verify/${response.reference}`);
    // Success! Redirect to success or back to course
    router.push({
      name: 'subjects',
      params: {
        path: course.value.path || 'university',
        facultyId: course.value.department?.faculty?._id || course.value.department?.faculty || 'unknown',
        departmentId: course.value.department?._id || course.value.department || 'unknown'
      }
    });
  } catch (err) {
    console.error('[PAYMENT_VERIFY_ERR]:', err);
    alert('Payment verification failed.');
  } finally {
    isProcessing.value = false;
  }
};

onMounted(fetchCourseDetails);
</script>

<style scoped>
.shadow-neo {
  box-shadow: 12px 12px 0px rgba(0, 0, 0, 0.05);
}
.dark .shadow-neo {
  box-shadow: 12px 12px 0px rgba(255, 255, 255, 0.05);
}
.shadow-neo-dark {
  box-shadow: 0px 15px 40px -10px rgba(0, 0, 0, 0.4);
}
.shadow-neo-light {
  box-shadow: 0px 15px 40px -10px rgba(255, 255, 255, 0.1);
}
.animate-fade-in {
  animation: fadeIn 0.5s ease-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
