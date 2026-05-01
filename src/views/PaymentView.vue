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
                <!-- PayPal Inline -->
                <svg viewBox="0 0 24 24" class="h-6" xmlns="http://www.w3.org/2000/svg" fill="#003087">
                  <path d="M15.607 4.653H8.941L6.645 19.251H1.82L4.862 0h7.995c3.754 0 6.375 2.294 6.473 5.513-.648-.478-2.105-.86-3.722-.86m6.57 5.546c0 3.41-3.01 6.853-6.958 6.853h-2.493L11.595 24H6.74l1.845-11.538h3.592c4.208 0 7.346-3.634 7.153-6.949a5.24 5.24 0 0 1 2.848 4.686M9.653 5.546h6.408c.907 0 1.942.222 2.363.541-.195 2.741-2.655 5.483-6.441 5.483H8.714Z"/>
                </svg>

                <div class="h-6 w-px bg-zinc-300 dark:bg-zinc-700"></div>

                <!-- Paystack -->
                <svg width="175" height="31" viewBox="0 0 175 31" class="h-6" xmlns="http://www.w3.org/2000/svg">
                  <g fill="none" fill-rule="evenodd">
                    <g transform="translate(0 .928)" fill="#09A5DB">
                      <path d="M27.338 0H1.608C.72 0 0 .72 0 1.608v2.858c0 .888.72 1.609 1.608 1.609h25.73c.888 0 1.608-.72 1.608-1.609V1.608C28.946.72 28.226 0 27.338 0z"/>
                      <path d="M27.338 15.951H1.608C.72 15.951 0 16.67 0 17.559v2.86c0 .886.72 1.606 1.608 1.606h25.73c.888 0 1.608-.72 1.608-1.607v-2.86c0-.888-.72-1.608-1.608-1.608z"/>
                      <path d="M16.081 23.925H1.608C.72 23.925 0 24.645 0 25.534v2.858c0 .888.72 1.608 1.608 1.608h14.473c.888 0 1.608-.72 1.608-1.608v-2.858a1.607 1.607 0 0 0-1.608-1.609z"/>
                      <path d="M28.946 7.975H1.608C.72 7.975 0 8.695 0 9.583v2.86c0 .886.72 1.607 1.608 1.607h27.338c.889 0 1.607-.72 1.607-1.608v-2.86c0-.888-.718-1.608-1.607-1.608z"/>
                    </g>
                    <g transform="translate(44.265 6.184)" class="fill-zinc-900 dark:fill-white">
                      <path d="M14.446 2.213A7.406 7.406 0 0 0 12.025.57 7.477 7.477 0 0 0 9.129 0c-1.056 0-2 .196-2.8.592-.622.304-1.15.69-1.56 1.139v-.438a.87.87 0 0 0-.233-.598.78.78 0 0 0-.6-.265H.833a.76.76 0 0 0-.599.265.848.848 0 0 0-.235.598v20.531c0 .231.08.432.237.593.16.156.354.234.597.234h3.163a.82.82 0 0 0 .574-.234.77.77 0 0 0 .258-.593v-7.007c.423.465.986.82 1.657 1.065a7.408 7.408 0 0 0 2.577.464c1.016 0 2-.188 2.928-.568a7.372 7.372 0 0 0 2.455-1.658 7.949 7.949 0 0 0 1.665-2.582c.418-1.006.62-2.142.62-3.38 0-1.236-.202-2.374-.62-3.38-.404-.996-.967-1.864-1.665-2.565zm-2.839 7.418a3.675 3.675 0 0 1-.744 1.166 3.37 3.37 0 0 1-1.107.784 3.424 3.424 0 0 1-1.404.283 3.502 3.502 0 0 1-2.533-1.067 3.635 3.635 0 0 1-.754-1.166 3.875 3.875 0 0 1-.27-1.442c0-.514.093-.997.27-1.446.177-.436.433-.825.754-1.149a3.812 3.812 0 0 1 1.142-.786 3.356 3.356 0 0 1 1.39-.296c.51 0 .978.1 1.401.296a3.79 3.79 0 0 1 1.117.782 3.7 3.7 0 0 1 .738 1.153c.177.45.265.932.265 1.446 0 .514-.088.996-.265 1.442z"/>
                      <path d="M17.807.43h-3.136a.82.82 0 0 0-.58.252.865.865 0 0 0-.253.61v.379c-.352-.423-.831-.784-1.42-1.079C12.022.196 11.095 0 10.063 0c-.996 0-1.973.19-2.897.57-.932.38-1.77.93-2.487 1.637A8.117 8.117 0 0 0 3.047 4.778C2.618 5.777 2.399 6.918 2.399 8.158c0 1.238.218 2.374.649 3.38.434.995 1.008 1.87 1.717 2.582a7.595 7.595 0 0 0 2.47 1.658 7.61 7.61 0 0 0 2.899.568c1.031 0 1.965-.2 2.765-.59.59-.297 1.075-.658 1.435-1.08v.407c0 .235.088.44.26.592a.817.817 0 0 0 .573.237h3.136a.786.786 0 0 0 .591-.24.797.797 0 0 0 .24-.589V1.293a.848.848 0 0 0-.234-.598.765.765 0 0 0-.597-.265zm-4.233 9.182a3.525 3.525 0 0 1-.737 1.17 3.777 3.777 0 0 1-1.115.786c-.42.195-.897.296-1.405.296-.489 0-.959-.1-1.39-.296a3.697 3.697 0 0 1-1.127-.786 3.42 3.42 0 0 1-.739-1.17 3.935 3.935 0 0 1-.264-1.423c0-.514.09-.997.264-1.446.177-.44.427-.832.739-1.153a3.73 3.73 0 0 1 1.128-.782c.43-.196.9-.296 1.389-.296.508 0 .986.1 1.405.296.42.197.798.458 1.115.782.31.328.56.717.737 1.153.177.45.264.932.264 1.446 0 .49-.088.97-.264 1.423z" transform="translate(17.807)"/>
                    </g>
                  </g>
                </svg>
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
import NeoAppShell from '../components/layout/NeoAppShell.vue';
import NeoCard from '../components/common/NeoCard.vue';

const route = useRoute();
const router = useRouter();

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

const initiatePayment = async () => {
  if (isProcessing.value) return;

  isProcessing.value = true;
  
  try {
    if (!course.value?.price || course.value.price <= 0) {
      alert('This course does not have a price set. Please contact support.');
      isProcessing.value = false;
      return;
    }

    const { data } = await api.post('/payments/initialize', {
      courseId: course.value._id
    });

    if (!data.authorization_url) {
      throw new Error('Payment authorization URL was not returned.');
    }

    window.location.href = data.authorization_url;
  } catch (err) {
    console.error('[PAYMENT_INIT_ERR]:', err);
    alert(err.response?.data?.message || 'Payment initiation failed.');
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
