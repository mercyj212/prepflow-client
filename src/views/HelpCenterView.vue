<template>
  <NeoAppShell>
    <div class="px-4 sm:px-8 py-8 max-w-4xl mx-auto">

      <!-- Header -->
      <header class="mb-10">
        <div class="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 class="text-2xl sm:text-3xl font-bold text-zinc-400 dark:text-zinc-400 uppercase tracking-widest mb-2">Help Center</h1>
            <p class="text-[15px] font-medium text-zinc-500 dark:text-zinc-500">Everything you need to get the most out of PrepUp CBT.</p>
          </div>
          <button
            type="button"
            @click="scrollToContact"
            class="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-zinc-900 px-6 text-[11px] font-black uppercase tracking-widest text-white shadow-xl shadow-zinc-900/10 transition-all hover:-translate-y-0.5 hover:bg-white hover:text-zinc-900 hover:ring-1 hover:ring-zinc-900 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-900 dark:hover:text-white dark:hover:ring-white"
          >
            Contact Us
            <ArrowRight :size="14" />
          </button>
        </div>
      </header>

      <!-- Help Categories -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
        <!-- Direct Support -->
        <button type="button" @click="scrollToContact" class="text-left bg-zinc-900 dark:bg-zinc-800 p-7 rounded-[24px] text-white shadow-neo group cursor-pointer transition-all hover:-translate-y-1 duration-200">
          <div class="w-12 h-12 bg-white/10 rounded-[14px] flex items-center justify-center mb-5 group-hover:bg-white/20 transition-colors">
            <MessageCircle :size="24" />
          </div>
          <h3 class="text-lg font-bold mb-2 uppercase tracking-tight">Support Desk</h3>
          <p class="text-white/60 mb-5 text-[13px]">Message our team directly for technical assistance.</p>
          <div class="inline-flex items-center gap-2 text-[12px] font-black uppercase tracking-widest hover:underline">
            Open Support Form
            <ArrowRight :size="12" />
          </div>
        </button>

        <!-- Account Security -->
        <div class="bg-[var(--neo-surface)] p-7 rounded-[24px] border border-white/20 dark:border-white/5 shadow-neo transition-all hover:-translate-y-1 duration-200">
          <div class="w-12 h-12 bg-zinc-100 dark:bg-zinc-800 rounded-[14px] flex items-center justify-center mb-5">
            <Lock :size="24" class="text-zinc-700 dark:text-zinc-300" />
          </div>
          <h3 class="text-lg font-bold mb-2 uppercase tracking-tight text-zinc-800 dark:text-zinc-100">Account Access</h3>
          <p class="text-zinc-500 dark:text-zinc-500 mb-5 text-[13px]">Challenges with login, verification, or credentials?</p>
          <router-link to="/forgot-password" class="text-[12px] font-black uppercase tracking-widest text-zinc-700 dark:text-zinc-300 hover:underline flex items-center gap-2">
            Reset Password
            <ArrowRight :size="12" />
          </router-link>
        </div>

        <!-- Exam Guide -->
        <div class="bg-[var(--neo-surface)] p-7 rounded-[24px] border border-white/20 dark:border-white/5 shadow-neo transition-all hover:-translate-y-1 duration-200">
          <div class="w-12 h-12 bg-zinc-100 dark:bg-zinc-800 rounded-[14px] flex items-center justify-center mb-5">
            <ClipboardList :size="24" class="text-zinc-700 dark:text-zinc-300" />
          </div>
          <h3 class="text-lg font-bold mb-2 uppercase tracking-tight text-zinc-800 dark:text-zinc-100">Exam Protocol</h3>
          <p class="text-zinc-500 dark:text-zinc-500 mb-5 text-[13px]">How PrepUp simulates real-world CBT environments.</p>
          <router-link to="/subjects" class="text-[12px] font-black uppercase tracking-widest text-zinc-700 dark:text-zinc-300 hover:underline flex items-center gap-2">
            Start Practice
            <ArrowRight :size="12" />
          </router-link>
        </div>
      </div>

      <!-- FAQ Section -->
      <div class="mb-16">
        <h2 class="text-[11px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-5">Frequently Asked Questions</h2>
        <div class="grid grid-cols-1 gap-3">
          <details v-for="(faq, i) in faqs" :key="i" class="group bg-[var(--neo-surface)] border border-white/20 dark:border-white/5 rounded-[18px] shadow-neo overflow-hidden">
            <summary class="p-5 cursor-pointer flex items-center justify-between text-[14px] font-semibold text-zinc-800 dark:text-zinc-100 list-none group-open:bg-black/5 dark:group-open:bg-white/5 transition-colors">
              {{ faq.q }}
              <ChevronDown :size="16" class="shrink-0 ml-4 group-open:rotate-180 transition-transform text-zinc-400 dark:text-zinc-500" />
            </summary>
            <div class="px-5 pb-5 pt-3 text-[14px] text-zinc-500 dark:text-zinc-400 leading-relaxed border-t border-black/5 dark:border-white/5">
              {{ faq.a }}
            </div>
          </details>
        </div>
      </div>

      <!-- Contact Us Form Section -->
      <div id="contact-form" ref="contactSection" class="scroll-mt-10">
        <div class="bg-[var(--neo-surface)] border border-white/20 dark:border-white/5 rounded-[32px] p-8 sm:p-10 shadow-neo relative overflow-hidden">
          <!-- Background Decoration -->
          <div class="absolute top-0 right-0 w-64 h-64 bg-brand/5 blur-[80px] rounded-full -mr-20 -mt-20"></div>
          
          <div class="relative z-10">
            <h2 class="text-xl sm:text-2xl font-bold text-zinc-800 dark:text-zinc-100 mb-2 uppercase tracking-tight">Contact Us</h2>
            <p class="text-[13px] text-zinc-500 mb-8 max-w-lg">Send us a message and we'll respond via email within 24 hours.</p>

            <form @submit.prevent="submitContact" class="space-y-5">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div class="space-y-1.5">
                  <label class="text-[10px] font-black uppercase tracking-widest text-zinc-400">Your Name</label>
                  <input ref="nameInput" v-model="form.name" type="text" required placeholder="John Doe" class="w-full bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-white/10 rounded-2xl px-5 py-3.5 text-[14px] outline-none focus:border-brand/50 transition-colors">
                </div>
                <div class="space-y-1.5">
                  <label class="text-[10px] font-black uppercase tracking-widest text-zinc-400">Email Address</label>
                  <input v-model="form.email" type="email" required placeholder="john@example.com" class="w-full bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-white/10 rounded-2xl px-5 py-3.5 text-[14px] outline-none focus:border-brand/50 transition-colors">
                </div>
              </div>

              <div class="space-y-1.5">
                <label class="text-[10px] font-black uppercase tracking-widest text-zinc-400">Subject</label>
                <select v-model="form.subject" required class="w-full bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-white/10 rounded-2xl px-5 py-3.5 text-[14px] outline-none focus:border-brand/50 appearance-none transition-colors">
                  <option value="" disabled>Select a topic</option>
                  <option value="Technical Issue">Technical Issue</option>
                  <option value="Payment Problem">Payment Problem</option>
                  <option value="Course Content">Course Content</option>
                  <option value="Account Access">Account Access</option>
                  <option value="General Inquiry">General Inquiry</option>
                </select>
              </div>

              <div class="space-y-1.5">
                <label class="text-[10px] font-black uppercase tracking-widest text-zinc-400">Message</label>
                <textarea v-model="form.message" required rows="4" placeholder="How can we help you?" class="w-full bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-white/10 rounded-2xl px-5 py-3.5 text-[14px] outline-none focus:border-brand/50 transition-colors resize-none"></textarea>
              </div>

              <div class="flex items-center justify-between pt-2">
                <p v-if="status" :class="status.type === 'success' ? 'text-green-500' : 'text-red-500'" class="text-xs font-bold">{{ status.text }}</p>
                <div v-else></div>
                
                <button 
                  type="submit" 
                  :disabled="loading"
                  class="bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 px-8 py-3.5 rounded-full text-[12px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all disabled:opacity-50 flex items-center gap-2 shadow-xl"
                >
                  <Send v-if="!loading" :size="16" />
                  <div v-else class="w-4 h-4 border-2 border-white/30 border-t-white dark:border-zinc-900/30 dark:border-t-zinc-900 rounded-full animate-spin"></div>
                  {{ loading ? 'Sending...' : 'Send Message' }}
                </button>
              </div>
            </form>
          </div>
        </div>

        <!-- Extra Contact Methods -->
        <div class="mt-8 flex flex-wrap items-center justify-center gap-8 text-zinc-400">
          <div class="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider">
            <Mail :size="16" />
            mercyjay510@gmail.com
          </div>
          <div class="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider">
            <Phone :size="16" />
            Support Desk
          </div>
          <div class="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider">
            <Globe :size="16" />
            Delta, Nigeria
          </div>
        </div>
      </div>
    </div>
  </NeoAppShell>
</template>

<script setup>
import { nextTick, ref } from 'vue';
import { Mail, ArrowRight, Lock, ClipboardList, ChevronDown, MessageCircle, Send, Phone, Globe } from 'lucide-vue-next';
import NeoAppShell from '../components/layout/NeoAppShell.vue';
import api from '../api/axios';

const form = ref({
  name: '',
  email: '',
  subject: '',
  message: ''
});

const loading = ref(false);
const status = ref(null);
const contactSection = ref(null);
const nameInput = ref(null);

const scrollToContact = async () => {
  await nextTick();
  contactSection.value?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  window.location.hash = 'contact-form';
  window.setTimeout(() => nameInput.value?.focus({ preventScroll: true }), 450);
};

const submitContact = async () => {
  loading.value = true;
  status.value = null;
  try {
    const res = await api.post('/support/contact', form.value);
    status.value = { type: 'success', text: res.data.message };
    form.value = { name: '', email: '', subject: '', message: '' };
  } catch (error) {
    status.value = { type: 'error', text: error.response?.data?.message || 'Failed to send message.' };
  } finally {
    loading.value = false;
  }
};

const faqs = [
  {
    q: "How do I access new curriculum materials?",
    a: "New courses and study materials are automatically synced to your dashboard. Simply log in and look for any courses labeled as 'New' or 'Updated'."
  },
  {
    q: "I haven't received my verification email. What should I do?",
    a: "Check your spam or junk folder first. If the email isn't there, ensure you've waited at least 60 seconds. You can request a fresh verification link from the login page if the original has expired."
  },
  {
    q: "How is my platform performance score calculated?",
    a: "Your performance score is a weighted average of your quiz results across all courses. We use real-time analytics to track your progress and provide a competitive percentile ranking."
  },
  {
    q: "Is there a mobile version of the PrepUp platform?",
    a: "PrepUp is fully responsive and optimized for mobile browsers. You can access the complete experience, including exams and course materials, directly from your smartphone or tablet."
  }
];
</script>

<style scoped>
summary::-webkit-details-marker { display: none; }
</style>
