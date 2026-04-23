<template>
  <div class="fixed inset-0 bg-black z-50 flex flex-col">
    <!-- Thin top bar shown only before game loads -->
    <div
      v-if="loading"
      class="absolute inset-0 bg-black flex flex-col items-center justify-center z-10 gap-6"
    >
      <div class="w-16 h-1 bg-white/10 rounded-full overflow-hidden">
        <div class="h-full bg-white animate-pulse w-1/2 rounded-full"></div>
      </div>
      <p class="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500">
        Initializing PrepDrive...
      </p>
    </div>

    <!-- The actual game — full-screen iframe -->
    <iframe
      ref="gameFrame"
      src="/prepdrive/index.html"
      class="w-full h-full border-0"
      :class="loading ? 'opacity-0' : 'opacity-100'"
      style="transition: opacity 0.4s ease;"
      allow="autoplay"
      @load="onFrameLoad"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const loading = ref(true);
const gameFrame = ref(null);

const onFrameLoad = () => {
  loading.value = false;
};

const handleMessage = (event) => {
  if (event.data === 'EXIT_PREPDRIVE') {
    router.push('/games');
  }
};

onMounted(() => {
  window.addEventListener('message', handleMessage);
});

onUnmounted(() => {
  window.removeEventListener('message', handleMessage);
});
</script>
