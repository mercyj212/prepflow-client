<template>
  <Transition
    enter-active-class="transition duration-700 ease-out"
    enter-from-class="translate-y-full opacity-0"
    enter-to-class="translate-y-0 opacity-100"
    leave-active-class="transition duration-500 ease-in"
    leave-from-class="translate-y-0 opacity-100"
    leave-to-class="translate-y-full opacity-0"
  >
    <div v-if="isVisible" class="fixed bottom-0 left-0 right-0 z-[200] p-4 sm:p-6">
      <div class="max-w-4xl mx-auto bg-black border border-white/10 backdrop-blur-xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl">
        <div class="flex-1 text-left">
          <p class="text-[11px] font-bold uppercase tracking-[0.3em] text-white/40 mb-2">System Notification: Cookie Policy</p>
          <p class="text-[13px] sm:text-[14px] text-zinc-300 leading-relaxed font-medium">
            PrepUp uses essential cookies to synchronize your study progress and maintain secure sessions. By continuing, you agree to our 
            <router-link to="/privacy" class="text-white underline underline-offset-4 hover:text-brand transition-colors">Privacy Policy</router-link>.
          </p>
        </div>
        <div class="flex items-center gap-4 w-full sm:w-auto">
          <button 
            @click="accept"
            class="flex-1 sm:flex-none px-8 py-3 bg-white text-black text-[11px] font-black uppercase tracking-widest hover:bg-zinc-200 transition-colors"
          >
            Acknowledge
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const isVisible = ref(false);

const accept = () => {
  localStorage.setItem('prepup_cookies_accepted', 'true');
  isVisible.value = false;
};

onMounted(() => {
  const accepted = localStorage.getItem('prepup_cookies_accepted');
  if (!accepted) {
    setTimeout(() => {
      isVisible.value = true;
    }, 2000);
  }
});
</script>
