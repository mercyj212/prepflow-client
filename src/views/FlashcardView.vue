<template>
  <NeoAppShell>
    <div class="px-4 sm:px-8 py-8 max-w-2xl mx-auto">

      <NeoLoader v-if="quizStore.loading" label="Loading flashcards..." />

      <div v-else-if="quizStore.error" class="flex flex-col items-center justify-center py-20 text-center">
        <p class="text-rose-500 font-semibold mb-4">{{ quizStore.error }}</p>
        <button @click="$router.push('/flashcards')" class="px-6 py-2.5 rounded-xl bg-slate-100 dark:bg-zinc-800 text-[13px] font-bold uppercase tracking-widest">← Back</button>
      </div>

      <div v-else-if="!quiz || quiz.questions.length === 0" class="flex flex-col items-center justify-center py-20 text-center">
        <div class="text-4xl mb-4">✧</div>
        <p class="text-slate-500 dark:text-zinc-500 text-[15px]">This deck has no cards yet.</p>
        <button @click="$router.push('/flashcards')" class="mt-6 px-6 py-2.5 rounded-xl bg-slate-100 dark:bg-zinc-800 text-[13px] font-bold uppercase tracking-widest">← Back to Decks</button>
      </div>

      <!-- Completion Summary -->
      <div v-else-if="currentIndex >= quiz.questions.length" class="py-10 max-w-md mx-auto">
        <div class="bg-[var(--neo-surface)] rounded-[32px] p-8 shadow-neo border border-white/20 dark:border-white/5 text-center">
          <div class="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-6">
            <svg class="w-10 h-10 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          </div>
          <h2 class="text-2xl font-black text-slate-800 dark:text-zinc-100 mb-2">Session Complete!</h2>
          <p class="text-slate-500 dark:text-zinc-500 text-[14px] mb-8">Great job! You've gone through the whole deck.</p>
          
          <div class="grid grid-cols-2 gap-4 mb-8">
            <div class="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/10">
              <p class="text-[10px] font-black uppercase tracking-widest text-emerald-500/60 mb-1">Known</p>
              <p class="text-2xl font-bold text-emerald-500">{{ knownCount }}</p>
            </div>
            <div class="p-4 rounded-2xl bg-rose-500/5 border border-rose-500/10">
              <p class="text-[10px] font-black uppercase tracking-widest text-rose-500/60 mb-1">Review</p>
              <p class="text-2xl font-bold text-rose-500">{{ reviewCount }}</p>
            </div>
          </div>

          <div class="space-y-3">
            <button @click="restartSession" class="w-full py-4 bg-slate-900 dark:bg-zinc-100 text-white dark:text-slate-900 rounded-2xl font-black uppercase tracking-widest text-[12px] shadow-neo-pill hover:-translate-y-1 transition-all">
              Restart Session
            </button>
            <button @click="$router.push(`/quiz/${quiz._id}`)" class="w-full py-4 bg-emerald-500 text-white rounded-2xl font-black uppercase tracking-widest text-[12px] shadow-neo-pill hover:-translate-y-1 transition-all">
              Take Final Quiz →
            </button>
          </div>
        </div>
      </div>

      <template v-else>

        <!-- Header -->
        <div class="flex items-center justify-between mb-6">
          <button @click="$router.push('/flashcards')" class="flex items-center gap-2 text-[13px] font-semibold text-slate-500 dark:text-zinc-500 hover:text-slate-800 dark:hover:text-zinc-200 transition-colors">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
            Decks
          </button>
          <button @click="$router.push(`/quiz/${quiz._id}`)" class="px-4 py-1.5 rounded-lg text-[12px] font-bold uppercase tracking-widest bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 hover:bg-slate-200 dark:hover:bg-zinc-700 transition-colors">
            Take Quiz →
          </button>
        </div>

        <!-- Progress -->
        <div class="mb-8">
          <h1 class="text-2xl font-bold text-slate-800 dark:text-zinc-100 mb-3">{{ quiz.title }}</h1>
          <div class="flex items-center gap-3">
            <div class="flex-1 h-1.5 rounded-full bg-slate-100 dark:bg-zinc-800 overflow-hidden">
              <div class="h-full rounded-full bg-slate-800 dark:bg-zinc-200 transition-all duration-500"
                :style="{ width: `${((currentIndex + 1) / quiz.questions.length) * 100}%` }"></div>
            </div>
            <span class="text-[12px] font-bold text-slate-400 dark:text-zinc-500 shrink-0">{{ currentIndex + 1 }} / {{ quiz.questions.length }}</span>
          </div>
        </div>

        <!-- Card wrapper -->
        <div
          class="card-wrapper mb-4 group/wrapper"
          @pointerdown.prevent="onPointerDown"
          @dragstart.prevent
        >
          <!-- Swipe Indicators (Stamps) -->
          <div 
            class="absolute top-12 left-10 z-50 pointer-events-none transform -rotate-12 transition-opacity duration-100"
            :style="{ opacity: stampKnownOpacity }"
          >
            <div class="px-6 py-2 border-4 border-emerald-500 rounded-xl">
              <span class="text-3xl font-black text-emerald-500 uppercase tracking-tighter">KNOWN</span>
            </div>
          </div>

          <div 
            class="absolute top-12 right-10 z-50 pointer-events-none transform rotate-12 transition-opacity duration-100"
            :style="{ opacity: stampReviewOpacity }"
          >
            <div class="px-6 py-2 border-4 border-rose-500 rounded-xl">
              <span class="text-3xl font-black text-rose-500 uppercase tracking-tighter">REVIEW</span>
            </div>
          </div>

          <!-- Visual drag layer -->
          <div ref="cardTrackEl" class="card-track" style="height: 340px;">
            <div class="card-inner" :class="{ 'is-flipped': isFlipped }">


              <!-- Front -->
              <div class="card-face card-front bg-[var(--neo-surface)] rounded-[28px] shadow-neo border border-white/20 dark:border-white/5 flex flex-col p-8">
                <div class="flex items-center justify-between mb-6">
                  <span class="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-zinc-500 bg-slate-100 dark:bg-zinc-800 px-3 py-1 rounded-full">Question</span>
                  <span class="text-[10px] font-bold text-slate-300 dark:text-zinc-600 uppercase tracking-widest">Tap to reveal</span>
                </div>
                <div class="flex-1 flex items-center justify-center">
                  <p class="text-[20px] sm:text-[22px] font-semibold text-slate-800 dark:text-zinc-100 leading-snug text-center">{{ currentQuestion.text }}</p>
                </div>
                <div class="flex justify-center mt-6">
                  <span class="text-[12px] text-slate-300 dark:text-zinc-600 animate-pulse">↔ drag · tap to flip</span>
                </div>
              </div>

              <!-- Back -->
              <div class="card-face card-back bg-slate-900 dark:bg-zinc-900 rounded-[28px] shadow-neo border border-white/5 flex flex-col p-8">
                <div class="flex items-center justify-between mb-6">
                  <span class="text-[10px] font-black uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">Answer</span>
                  <span class="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Tap to go back</span>
                </div>
                <div class="flex-1 flex items-center justify-center">
                  <p class="text-[20px] sm:text-[22px] font-bold text-white leading-snug text-center">{{ correctAnswerText }}</p>
                </div>
                <div v-if="currentQuestion.explanation" class="mt-5 p-4 rounded-[16px] bg-white/5 border border-white/5">
                  <p class="text-[11px] font-bold uppercase tracking-widest text-zinc-500 mb-1.5">Explanation</p>
                  <p class="text-[13px] text-zinc-400 leading-relaxed">{{ currentQuestion.explanation }}</p>
                </div>
              </div>

            </div>
          </div>
        </div>


      </template>
    </div>
  </NeoAppShell>
</template>

<script setup>
import { computed, ref, onMounted, onBeforeUnmount } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useQuizStore } from '../store/quiz';
import NeoAppShell from '../components/layout/NeoAppShell.vue';
import NeoLoader from '../components/common/NeoLoader.vue';

const route = useRoute();
const router = useRouter();
const quizStore = useQuizStore();

const currentIndex = ref(0);
const isFlipped = ref(false);
const isDragging = ref(false);
const cardTrackEl = ref(null);

// Session stats
const knownCards = ref([]);
const reviewCards = ref([]);
const knownCount = computed(() => knownCards.value.length);
const reviewCount = computed(() => reviewCards.value.length);

// Visual stamps opacity
const stampKnownOpacity = ref(0);
const stampReviewOpacity = ref(0);

const quiz = computed(() => quizStore.currentQuiz);
const currentQuestion = computed(() => {
  if (!quiz.value?.questions?.length || currentIndex.value >= quiz.value.questions.length) return null;
  return quiz.value.questions[currentIndex.value];
});
const correctAnswerText = computed(() => {
  if (!currentQuestion.value) return '';
  const opt = currentQuestion.value.options?.find(o => o.isCorrect === true || o.isCorrect === 'true');
  return opt ? opt.text : 'See quiz for the correct answer.';
});

onMounted(async () => {
  isFlipped.value = false;
  
  // Strict: Disable browser navigation gestures while in flashcard mode
  document.body.style.overscrollBehaviorX = 'none';
  
  await quizStore.fetchStudyQuizById(route.params.id);
});

onBeforeUnmount(() => {
  // Restore browser behavior
  document.body.style.overscrollBehaviorX = '';
  
  window.removeEventListener('pointermove', onPointerMove);
  window.removeEventListener('pointerup', onPointerUp);
  window.removeEventListener('pointercancel', onPointerUp);
});

// ── Drag config ──────────────────────────────────────────────────────────────
const THRESHOLD = 100; // Increased for better "intentional" swipe
let startX = 0;
let currentX = 0;
let dragging = false;

const setTranslate = (x, instant = false) => {
  if (!cardTrackEl.value) return;
  const rotation = x / 20; // Subtle rotation during drag
  const opacity = 1 - Math.min(Math.abs(x) / 600, 0.4);
  
  // Update stamps visibility
  stampKnownOpacity.value = x > 20 ? Math.min((x - 20) / 60, 1) : 0;
  stampReviewOpacity.value = x < -20 ? Math.min((Math.abs(x) - 20) / 60, 1) : 0;

  cardTrackEl.value.style.transition = instant ? 'none' : 'transform 0.45s cubic-bezier(0.18, 0.89, 0.32, 1.28), opacity 0.35s ease';
  cardTrackEl.value.style.transform = x === 0 ? '' : `translateX(${x}px) rotate(${rotation}deg)`;
  cardTrackEl.value.style.opacity = x === 0 ? '' : String(opacity);
};

// ── Pointer Interaction (Unified Mouse/Touch) ──────────────────────────────────
const onPointerDown = (e) => {
  if (e.button !== undefined && e.button !== 0) return;

  // Visual feedback: grab to grabbing
  isDragging.value = true;
  
  startX = e.clientX;
  currentX = 0;
  dragging = true;
  
  // High-fidelity capture ensures events stay locked to this node
  const el = e.currentTarget || e.target;
  try {
    el.setPointerCapture(e.pointerId);
  } catch (err) { /* silent */ }
  
  window.addEventListener('pointermove', onPointerMove);
  window.addEventListener('pointerup', onPointerUp, { once: true });
  window.addEventListener('pointercancel', onPointerUp, { once: true });
};

const onPointerMove = (e) => {
  if (!dragging) return;
  // Prevent browser navigation gestures (back/forward)
  e.preventDefault();
  currentX = e.clientX - startX;
  setTranslate(currentX, true);
};

const onPointerUp = (e) => {
  if (!dragging) return;
  dragging = false;
  isDragging.value = false;
  
  try {
    e.target.releasePointerCapture(e.pointerId);
  } catch (err) { /* silent */ }
  
  window.removeEventListener('pointermove', onPointerMove);
  window.removeEventListener('pointerup', onPointerUp);
  window.removeEventListener('pointercancel', onPointerUp);
  
  // Execute final displacement check
  settle(currentX);
};

// ── Shared: decide flip or navigate ─────────────────────────────────────────
const settle = (delta) => {
  const absDelta = Math.abs(delta);
  
  if (delta < -THRESHOLD) {
    // Label as REVIEW (Swipe Left)
    markAsReview();
  } else if (delta > THRESHOLD) {
    // Label as KNOWN (Swipe Right)
    markAsKnown();
  } else if (absDelta < 6) {
    // Intentional minimalist tap for rotation
    setTranslate(0);
    flipCard();
  } else {
    // Snap back
    stampKnownOpacity.value = 0;
    stampReviewOpacity.value = 0;
    setTranslate(0);
  }
};

// Cleanup handled in onBeforeUnmount hook above

// ── Card actions ─────────────────────────────────────────────────────────────
const flipCard = () => { isFlipped.value = !isFlipped.value; };

const markAsKnown = () => {
  if (!currentQuestion.value) return;
  knownCards.value.push(currentQuestion.value._id);
  exitCard(600);
};

const markAsReview = () => {
  if (!currentQuestion.value) return;
  reviewCards.value.push(currentQuestion.value._id);
  exitCard(-600);
};

const exitCard = (targetX) => {
  setTranslate(targetX);
  setTimeout(() => {
    stampKnownOpacity.value = 0;
    stampReviewOpacity.value = 0;
    setTranslate(0, true);
    nextCard();
  }, 250);
};

const nextCard = () => {
  if (!quiz.value || currentIndex.value >= quiz.value.questions.length) return;
  isFlipped.value = false;
  currentIndex.value++;
};

const restartSession = () => {
  currentIndex.value = 0;
  knownCards.value = [];
  reviewCards.value = [];
  isFlipped.value = false;
};
</script>

<style scoped>
.card-wrapper {
  cursor: grab;
  user-select: none;
  -webkit-user-select: none;
  /* Prevent horizontal browser gestures (back/forward) */
  touch-action: pan-y !important;
  overscroll-behavior-x: none !important;
  position: relative;
}
.card-wrapper:active {
  cursor: grabbing;
}

.card-track {
  width: 100%;
  will-change: transform;
}

.card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  transition: transform 0.55s cubic-bezier(0.4, 0, 0.2, 1);
  transform-style: preserve-3d;
}
.card-inner.is-flipped { transform: rotateY(180deg); }

.card-face {
  position: absolute;
  inset: 0;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
}
.card-back { transform: rotateY(180deg); }
</style>
