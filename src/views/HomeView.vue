<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { useAuthStore } from '../store/auth';
import { useQuizStore } from '../store/quiz';
import BrandLogo from '../components/BrandLogo.vue';
import AppFooter from '../components/layout/AppFooter.vue';

const authStore = useAuthStore();
const quizStore = useQuizStore();

// --- Initialization Logic ---
const isBooting = ref(true);
const bootProgress = ref(0);

const startBoot = async () => {
  const steps = 40;
  for (let i = 0; i <= steps; i++) {
    bootProgress.value = (i / steps) * 100;
    // Premium, variable-speed loading: Slow calibration -> Speed run -> Final sync
    let delay = 35 + Math.random() * 60;
    if (i < 5) delay = 120; // Initial calibration
    if (i > 35) delay = 180; // Final synchronization
    if (i === 20) delay = 600; // Logic gate spike
    
    await new Promise(r => setTimeout(r, delay));
  }
  await new Promise(r => setTimeout(r, 800));
  isBooting.value = false;
};

// --- Typing Logic ---
const lines = [
  { 
    segments: [
      { text: 'Prepare with ', class: '' },
      { text: 'focus.', class: 'text-zinc-500' }
    ]
  },
  { 
    segments: [
      { text: 'Succeed with ', class: '' },
      { text: 'pride.', class: 'text-zinc-500' }
    ]
  }
];

const displayedLines = ref([
  [{ text: '', class: '' }, { text: '', class: 'text-zinc-500' }],
  [{ text: '', class: '' }, { text: '', class: 'text-zinc-500' }]
]);
const isDone = ref(false);

const typeLine = async (lineIdx) => {
  const line = lines[lineIdx];
  for (let segIdx = 0; segIdx < line.segments.length; segIdx++) {
    const segment = line.segments[segIdx];
    for (let i = 0; i <= segment.text.length; i++) {
      displayedLines.value[lineIdx][segIdx].text = segment.text.substring(0, i);
      await new Promise(r => setTimeout(r, 40 + Math.random() * 30));
    }
  }
};

// --- Interactive & Navigation Logic ---
const mousePos = ref({ x: 50, y: 50 });
const heroMouse = ref({ x: 0, y: 0 });
const isHoveringWindow = ref(false);
const sectionVisible = ref(false);
const showMatrix = ref(false);
const showFinale = ref(false);
const isTouchDevice = ref(false);
const activeSectionId = ref('hero-scene');
const lastInteractionTime = ref(Date.now());

const handleInteraction = () => {
  lastInteractionTime.value = Date.now();
};

const handleGlobalMouseMove = (e) => {
  handleInteraction();
  if (isTouchDevice.value) return;
  // Parallax tracking
  const px = (e.clientX / window.innerWidth - 0.5) * 20;
  const py = (e.clientY / window.innerHeight - 0.5) * 20;
  heroMouse.value = { x: px, y: py };

  // Percentage tracking for crosshair/spotlight
  const pctX = (e.clientX / window.innerWidth) * 100;
  const pctY = (e.clientY / window.innerHeight) * 100;
  mousePos.value = { x: pctX, y: pctY };
};

const handleViewfinderMove = (e) => {
  const rect = e.currentTarget.getBoundingClientRect();
  const x = ((e.clientX - rect.left) / rect.width) * 100;
  const y = ((e.clientY - rect.top) / rect.height) * 100;
  mousePos.value = { x, y };
};

// ── Live Data Computeds ──────────────────────────────────────────────
const academicSubjects = computed(() => {
  const realMastery = quizStore.progressMetrics?.subjectMastery;
  
  if (authStore.isAuthenticated && realMastery && realMastery.length > 0) {
    // Use real subject mastery from backend, cap at 6 entries
    return realMastery.slice(0, 6).map((m, i) => ({
      code: `${m.subject.substring(0, 3).toUpperCase()}_${String(i + 1).padStart(3, '0')}`,
      name: m.subject.toUpperCase(),
      status: m.mastery >= 80 ? 'MASTERED' : m.mastery >= 50 ? 'ACTIVE' : 'BUILDING',
      mastery: m.mastery
    }));
  }
  
  // High-fidelity fallback grid for visitors or new users
  return [
    { code: 'ENG_001', name: 'USE OF ENGLISH', status: 'READY', mastery: 0 },
    { code: 'MAT_002', name: 'MATHEMATICS', status: 'READY', mastery: 0 },
    { code: 'PHY_003', name: 'PHYSICS', status: 'READY', mastery: 0 },
    { code: 'CHE_004', name: 'CHEMISTRY', status: 'READY', mastery: 0 },
    { code: 'BIO_005', name: 'BIOLOGY', status: 'READY', mastery: 0 },
    { code: 'ECO_006', name: 'ECONOMICS', status: 'READY', mastery: 0 },
  ];
});

const totalQuestions = computed(() => {
  // Priority: publicStats (exact DB count) → quizzes array → premium benchmark
  if (quizStore.publicStats?.totalQuestions != null && quizStore.publicStats.totalQuestions > 0) {
    const n = quizStore.publicStats.totalQuestions;
    if (n >= 1000) return `${(n / 1000).toFixed(1)}k+`;
    return `${n}+`;
  }
  if (quizStore.quizzes.length > 0) {
    const total = quizStore.quizzes.reduce((acc, q) => acc + (q.questions?.length || 0), 0);
    if (total > 0) {
      return total >= 1000 ? `${(total / 1000).toFixed(1)}k+` : `${total}+`;
    }
  }
  // Constant "Elite" benchmark while DB is syncing or empty
  return '1.2k+';
});

const totalQuizzes = computed(() => {
  if (quizStore.publicStats?.totalQuizzes != null) return quizStore.publicStats.totalQuizzes;
  if (quizStore.quizzes.length > 0) return quizStore.quizzes.length;
  return null;
});

// --- Animated Score Counter ---
const animatedScore = ref(0);
const isSyncingScore = ref(true);

const runScoreAnimation = (target) => {
  isSyncingScore.value = true;
  let current = 0;
  const steps = 60;
  const increment = target / steps;
  let step = 0;
  
  const interval = setInterval(() => {
    step++;
    current += increment;
    animatedScore.value = Math.round(current);
    if (step >= steps) {
      animatedScore.value = target;
      isSyncingScore.value = false;
      clearInterval(interval);
    }
  }, 20);
};

const averageScore = computed(() => {
  const userScore = quizStore.progressMetrics?.averageScore;
  const platformScore = quizStore.publicStats?.averageScore;
  
  if (authStore.isAuthenticated && userScore != null) return userScore;
  if (platformScore != null) return platformScore;
  return 74; // Default design benchmark
});

const displayScore = computed(() => isSyncingScore.value ? animatedScore.value : averageScore.value);

watch(averageScore, (newVal) => {
  if (newVal != null) runScoreAnimation(newVal);
}, { immediate: true });

const socialSignals = computed(() => {
  const score = averageScore.value != null ? `${averageScore.value}%` : '74%';
  const qCount = totalQuestions.value;
  
  return [
    `BANK UPDATE ${qCount} QUESTIONS READY IN THE BANK`,
    `TOP PERFORMANCE STUDENT ACHIEVED ${score} READINESS`,
    'SYLLABUS OFFICIAL 2026 JAMB BANK IS LIVE',
    'LIVE NOW NEW PRACTICE SESSION STARTED',
    `PLATFORM AVG STUDENTS AVERAGING ${score} THIS WEEK`,
    'CONNECTION SYNCING AT TOP SPEEDS',
    'VERIFIED YOUR STUDY PROGRESS IS SECURE'
  ];
});

onMounted(async () => {
  startBoot();

  const isTouchDeviceByPoints = (navigator.maxTouchPoints > 0);
  isTouchDevice.value = (window.matchMedia("(pointer: coarse)").matches) || isTouchDeviceByPoints;

  if (isTouchDevice.value) {
    mousePos.value = { x: 50, y: 35 };
  }

  // ── Unified Data Sync ──
  quizStore.fetchPublicStats();

  if (authStore.isAuthenticated) {
    quizStore.fetchProgressMetrics();
  }

  // ── Unified Tour Observer (Scroll-Spy & Animation Trigger) ──
  const tourSections = ['hero-scene', 'tactical-section', 'mastery-matrix', 'social-intelligence'];
  const tourObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // 1. Sync Tour Logic
        if (entry.intersectionRatio >= 0.4) {
          activeSectionId.value = entry.target.id;
        }
        
        // 2. Trigger Animations & Color Flips
        if (entry.target.id === 'tactical-section') {
          sectionVisible.value = true;
        }
        if (entry.target.id === 'mastery-matrix') {
          showMatrix.value = true;
        }
        if (entry.target.id === 'social-intelligence') {
          showFinale.value = true;
        }
      } else {
        // 3. Reset states for exit logic
        if (entry.target.id === 'tactical-section') {
          sectionVisible.value = false;
        }
        if (entry.target.id === 'social-intelligence') {
          showFinale.value = false;
        }
      }
    });
  }, { threshold: [0.1, 0.4, 0.8] });

  tourSections.forEach(id => {
    const el = document.getElementById(id);
    if (el) tourObserver.observe(el);
  });

  // ── Typing Loop (Independent) ──
  (async () => {
    // eslint-disable-next-line no-constant-condition
    while (true) {
      if (isBooting.value) {
        await new Promise(r => setTimeout(r, 100));
        continue;
      }

      // Reset & Start Typing
      isDone.value = false;
      displayedLines.value = [
        [{ text: '', class: '' }, { text: '', class: 'text-zinc-500' }],
        [{ text: '', class: '' }, { text: '', class: 'text-zinc-500' }]
      ];

      for (let i = 0; i < lines.length; i++) {
        await typeLine(i);
        if (i < lines.length - 1) await new Promise(r => setTimeout(r, 200));
      }
      isDone.value = true;

      // Pause while fully typed
      await new Promise(r => setTimeout(r, 5000));

      // Quick fade out before restart (handled by Tailwind transition-opacity on its class)
      isDone.value = false;
      await new Promise(r => setTimeout(r, 1000));
    }
  })();

  // ── Automatic Scroll Tour (Independent & Interaction Aware) ──
  (async () => {
    // eslint-disable-next-line no-constant-condition
    while (true) {
      if (isBooting.value) {
        await new Promise(r => setTimeout(r, 100));
        continue;
      }

      // Time spent at each section before NEXT automated scroll
      await new Promise(r => setTimeout(r, 15000));

      // ONLY Auto-scroll if user has been idle
      const timeSinceLastInteraction = Date.now() - lastInteractionTime.value;
      if (timeSinceLastInteraction < 12000) {
        continue;
      }

      const currentViewIdx = tourSections.indexOf(activeSectionId.value);
      
      // STOP the tour loop entirely if we've reached the final section
      if (currentViewIdx === tourSections.length - 1) {
        break; 
      }

      const nextIdx = currentViewIdx + 1;
      const nextSection = document.getElementById(tourSections[nextIdx]);
      
      if (nextSection) {
        nextSection.scrollIntoView({ behavior: 'smooth' });
        activeSectionId.value = tourSections[nextIdx];
      }
    }
  })();
});
</script>

<template>
  <div 
    @mousemove="handleGlobalMouseMove" 
    @wheel="handleInteraction"
    @touchstart="handleInteraction"
    :class="[
      'min-h-screen h-screen overflow-y-auto overscroll-none scroll-snap-y-mandatory scroll-smooth hide-scrollbar bg-black text-white font-sans selection:bg-white selection:text-black transition-all duration-[1.5s]',
      { 'dark': !showFinale }
    ]"
  >
    <!-- Floating Elite Header (Direct child to ensure it stays pinned) -->
    <header 
      class="fixed top-0 left-0 right-0 z-[100] px-4 sm:px-12 md:px-20 py-6 sm:py-8 flex justify-between items-center transition-all duration-700 pointer-events-none"
      :class="showFinale ? 'text-black' : 'text-white'"
    >
      <div class="pointer-events-auto transition-all duration-700">
        <BrandLogo :size="window?.innerWidth < 640 ? 'sm' : 'md'" :is-light="showFinale" />
      </div>

      <nav class="flex items-center gap-4 sm:gap-8 pointer-events-auto">
        <router-link to="/login" 
          class="text-[10px] sm:text-[11px] font-black uppercase tracking-[0.2em] sm:tracking-[0.3em] transition-colors"
          :class="showFinale ? 'text-black hover:text-zinc-600' : 'text-white hover:text-zinc-400'">
          Login
        </router-link>
        <router-link to="/register" 
          class="group relative overflow-hidden px-4 sm:px-8 py-2.5 sm:py-3 border transition-all duration-500 rounded-none pointer-events-auto"
          :class="showFinale ? 'border-black/20 hover:border-black' : 'border-white/20 hover:border-white'"
        >
          <span 
            class="relative z-10 text-[10px] sm:text-[11px] font-black uppercase tracking-[0.2em] sm:tracking-[0.3em] transition-colors"
            :class="showFinale ? 'text-black group-hover:text-white' : 'text-white group-hover:text-black'"
          >
            Get Started
          </span>
          <div 
            class="absolute inset-0 translate-y-full group-hover:translate-y-0 transition-transform duration-500"
            :class="showFinale ? 'bg-black' : 'bg-white'"
          ></div>
        </router-link>
      </nav>
    </header>
    
    <!-- Premium Cinematic Entrance (Outside the content wrapper to stay sharp) -->
    <Transition
      leave-active-class="transition duration-[2.5s] ease-in-out"
      leave-from-class="opacity-100 scale-100 blur-0"
      leave-to-class="opacity-0 scale-[10] blur-3xl"
    >
      <div v-if="isBooting" class="fixed inset-0 z-[1000] bg-black flex flex-col items-center justify-center p-6 sm:p-12 overflow-hidden pointer-events-none">
        <div class="relative flex flex-col items-center transition-all duration-1000">
           <!-- Centered Premium Identity -->
           <div class="relative group">
             <div class="absolute inset-0 blur-[80px] bg-brand/30 animate-pulse transition-all duration-1000"
                  :style="{ transform: `scale(${1 + bootProgress / 100})`, opacity: bootProgress / 100 }"></div>
             <BrandLogo size="lg" class="relative z-10 transition-transform duration-1000"
                        :style="{ transform: `scale(${0.9 + (bootProgress / 100) * 0.1})` }" />
           </div>
           
           <!-- Large Elegant Counter -->
           <div class="mt-20 flex flex-col items-center gap-2">
             <div class="flex items-baseline gap-1">
               <span class="text-[clamp(64px,12vw,140px)] font-black tracking-tighter tabular-nums leading-none">
                 {{ Math.round(bootProgress) }}
               </span>
               <span class="text-zinc-700 font-bold text-[clamp(24px,5vw,48px)]">%</span>
             </div>
             
             <div class="flex items-center gap-4">
               <div class="h-px w-8 bg-zinc-800"></div>
               <span class="text-[10px] font-black uppercase tracking-[0.8em] text-zinc-500 animate-pulse translate-x-[0.4em]">
                 Synchronizing Identity
               </span>
               <div class="h-px w-8 bg-zinc-800"></div>
             </div>
           </div>
        </div>
      </div>
    </Transition>

    <!-- Site Content (Targeted for entrance zoom/blur) -->
    <div 
      class="transition-all duration-[2s] ease-out"
      :class="isBooting ? 'scale-[0.95] blur-md opacity-0' : 'scale-100 blur-0 opacity-100'"
    >

    <!-- Scene 1: The Narrative Hero -->
    <section id="hero-scene" class="min-h-[100svh] snap-start shrink-0 relative flex flex-col md:flex-row overflow-hidden border-b border-white/5 noise-overlay cursor-crosshair">
      <!-- Tactical Scope UI -->
      <div class="absolute inset-0 z-[5] pointer-events-none opacity-40">
        <!-- Corner Brackets -->
        <div class="absolute top-12 left-12 w-6 h-6 border-t-2 border-l-2 border-white/40"></div>
        <div class="absolute top-12 right-12 w-6 h-6 border-t-2 border-r-2 border-white/40"></div>
        <div class="absolute bottom-12 left-12 w-6 h-6 border-b-2 border-l-2 border-white/40"></div>
        <div class="absolute bottom-12 right-12 w-6 h-6 border-b-2 border-r-2 border-white/40"></div>
        
        <!-- Floating Crosshair Lines -->
        <div class="absolute inset-x-0 h-px bg-white/10" :style="{ top: mousePos.y + '%' }"></div>
        <div class="absolute inset-y-0 w-px bg-white/10" :style="{ left: mousePos.x + '%' }"></div>
      </div>

      <!-- Tactical Spotlight Overlay -->
      <div class="absolute inset-0 z-[2] pointer-events-none transition-opacity duration-300" 
           :style="{ background: `radial-gradient(circle at ${mousePos.x}% ${mousePos.y}%, rgba(255,255,255,0.08) 0%, transparent 60%)` }"></div>

      <div class="absolute inset-0 z-[1] pointer-events-none opacity-20"
           :style="{ transform: `translate(${heroMouse.x * -0.5}px, ${heroMouse.y * -0.5}px)` }">
        <div class="absolute top-1/2 left-20 w-px h-64 bg-white/10"></div>
        <div class="absolute top-1/4 right-[30%] w-px h-32 bg-white/10"></div>
      </div>

      <div class="flex-1 z-20 flex flex-col justify-start pt-[18vh] sm:pt-[20vh] px-6 sm:px-12 md:px-20 py-12 bg-black/20 md:bg-black/40 backdrop-blur-[1px] md:backdrop-blur-[2px]">
        <div class="max-w-xl text-left" :style="{ transform: `translate(${heroMouse.x * 0.5}px, ${heroMouse.y * 0.5}px)` }">
          
          <h1 
            class="text-[clamp(30px,9vw,84px)] leading-[0.9] font-black tracking-tighter uppercase min-h-[4em] sm:min-h-[3.6em] transition-opacity duration-1000"
            :class="isDone || !isBooting ? 'opacity-100' : 'opacity-0'"
          >
            <template v-for="(line, lIdx) in displayedLines" :key="lIdx">
              <span v-for="(seg, sIdx) in line" :key="sIdx" :class="seg.class">
                {{ seg.text }}
              </span>
              <br v-if="lIdx < displayedLines.length - 1"/>
            </template>
            <span v-if="!isDone" class="inline-block w-[0.15em] h-[0.8em] bg-white ml-1 animate-pulse align-middle"></span>
          </h1>
          
          <p class="mt-8 sm:mt-4 text-[16px] sm:text-[18px] text-white/50 font-medium max-w-md leading-relaxed transition-opacity duration-1000" :class="isDone ? 'opacity-100' : 'opacity-0'">
            Practice real CBT questions, track every gain, and approach your exams with complete precision.
          </p>
          
          <div class="mt-8 sm:mt-10 flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-8 transition-all duration-1000" :class="isDone ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'">
            <router-link to="/register" class="group relative px-10 sm:px-12 py-4 sm:py-5 border border-white/20 hover:border-white text-[12px] sm:text-[13px] font-black uppercase tracking-widest overflow-hidden transition-all w-full sm:w-auto text-center font-bold rounded-none">
              <span class="relative z-10 group-hover:text-black transition-colors">Start Practicing</span>
              <div class="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
              <span class="absolute right-6 group-hover:translate-x-1 transition-transform z-10 group-hover:text-black">→</span>
            </router-link>
            
            <router-link to="/login" class="text-[10px] sm:text-[11px] font-black uppercase tracking-[0.3em] text-zinc-500 hover:text-white transition-colors w-full sm:w-auto text-center py-2">
              Go to Dashboard
            </router-link>
          </div>
        </div>
      </div>

      <!-- Hero Visual with Depth -->
      <div class="absolute inset-y-0 right-0 w-full md:w-[65%] z-0 overflow-hidden">
        <div class="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent z-10 md:block hidden"></div>
        <div class="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent z-10 md:hidden block"></div>
        <img 
          src="/avatar-female.jpg" 
          alt="Focused Student" 
          class="absolute inset-0 w-full h-full object-cover grayscale brightness-[1.05] contrast-[1.1] transition-transform duration-[2s]"
          :style="{ transform: `scale(1.1) translate(${heroMouse.x * -1.5}px, ${heroMouse.y * -1.5}px)` }"
        />
        
        <!-- Tactical HUD Layer -->
        <div class="absolute inset-0 z-20 pointer-events-none opacity-40" :style="{ transform: `translate(${heroMouse.x * 2}px, ${heroMouse.y * 2}px)` }">
          <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] border border-white/10 rounded-none flex items-center justify-center">
            <div class="w-[80%] h-[80%] border border-white/5 rounded-none animate-pulse"></div>
          </div>
          <div class="absolute top-[20%] right-20 text-[8px] font-mono tracking-[0.3em] text-white/40 space-y-1 text-right">
            <div>TARGET ACQUISITION: SUCCESS</div>
            <div>STUDENT READY: TRUE</div>
            <div>LATENCY: 0.2ms</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Scene 2: The Focused Path (Viewfinder) -->
    <section id="tactical-section" class="min-h-[100svh] snap-start shrink-0 flex items-center justify-center bg-zinc-950 relative overflow-hidden py-24 sm:py-32 px-6 sm:px-12 md:px-24 border-b border-white/5">
      <div class="absolute inset-0 pointer-events-none opacity-[0.03] grid-pattern z-0"></div>
      <div class="max-w-7xl w-full grid grid-cols-1 md:grid-cols-12 gap-12 items-center z-10">
        <div class="md:col-span-5 text-left order-2 md:order-1">
          <h2 class="text-[clamp(32px,4vw,54px)] leading-[1] font-black tracking-tighter uppercase mb-2 max-w-sm text-left">
            Learning should feel focused,<br/>
            <span class="text-zinc-600">not overwhelming.</span>
          </h2>
          <router-link to="/login" class="group inline-flex items-center gap-2 mt-8 text-[11px] font-black uppercase tracking-[0.4em] text-white/20 hover:text-white transition-all duration-500">
            <span class="transition-transform group-hover:-translate-x-1">[</span> Go to Dashboard <span class="transition-transform group-hover:translate-x-1">]</span>
          </router-link>
        </div>
        <div class="md:col-span-7 relative order-1 md:order-2 flex justify-end">
          <div class="relative w-full max-w-2xl group cursor-crosshair overflow-hidden border border-white/20 bg-black transition-all duration-[3.5s] ease-in-out rounded-none shadow-2xl" :class="sectionVisible ? 'animate-aperture-pulse h-64 sm:h-[32rem]' : 'h-32 sm:h-44'" @mouseenter="isHoveringWindow = true" @mouseleave="isHoveringWindow = false" @mousemove="handleViewfinderMove">
            <div class="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-white/40 z-30"></div>
            <div class="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-white/40 z-30"></div>
            <div class="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-white/40 z-30"></div>
            <div class="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-white/40 z-30"></div>
            <div class="absolute top-6 left-12 flex items-start gap-4 z-30 hidden sm:flex text-left font-bold tracking-tight">
              <div class="text-[8px] uppercase tracking-widest text-white/40 leading-relaxed font-bold">Focus Depth: {{ averageScore }}% <br/> Study Mode Active</div>
              <svg width="40" height="20" class="opacity-30"><path d="M0 10 L5 10 L8 2 L12 18 L15 10 L40 10" stroke="white" fill="none" class="animate-pulse-path" /></svg>
            </div>
            <div class="absolute bottom-6 right-12 text-[8px] font-bold uppercase tracking-widest text-white/40 z-30 hidden sm:block text-right">Mastered <br/> Synced Database</div>
            <div class="absolute inset-x-0 h-[1px] bg-white/40 z-20 animate-scan"></div>
            <div class="absolute inset-0 transition-all duration-[1.5s] ease-out" :class="isHoveringWindow ? 'blur-0 contrast-125' : 'blur-[2px] contrast-100'">
              <img src="/avatar-male.jpg" alt="Focused Eyes" class="absolute inset-0 w-full h-full object-cover grayscale opacity-80 group-hover:scale-105 transition-transform duration-[5s]" style="object-position: 85% 32%;"/>
              <div v-if="isHoveringWindow" class="absolute inset-0 bg-white/5 z-20 mix-blend-overlay animate-glitch"></div>
            </div>
              <div class="absolute inset-0 transition-opacity duration-300 pointer-events-none" :class="isHoveringWindow ? 'opacity-100' : 'opacity-0'" :style="{ background: `radial-gradient(circle at ${mousePos.x}% ${mousePos.y}%, rgba(255,255,255,0.1) 0%, transparent 70%)` }"></div>
            <div class="absolute inset-0 bg-gradient-to-r from-black via-transparent to-transparent z-10 opacity-60"></div>
          </div>
        </div>
      </div>
    </section>

    <!-- Scene 3: The Academic Command Center (The Matrix) -->
    <section id="mastery-matrix" class="min-h-[100svh] snap-start shrink-0 flex items-center justify-center bg-black relative overflow-hidden py-24 sm:py-32 px-4 sm:px-12 md:px-24 border-b border-white/5">
      <div class="absolute inset-0 pointer-events-none opacity-[0.02] grid-pattern z-0 scale-[0.5]"></div>
      <div class="max-w-7xl w-full z-10 transition-all duration-[1.5s]" :class="showMatrix ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 border border-zinc-100 dark:border-zinc-800 rounded-none overflow-hidden bg-white/5 backdrop-blur-xl shadow-2xl">
          <div class="p-8 sm:p-12 border-b border-zinc-100 dark:border-zinc-800 lg:border-b-0 lg:border-r flex flex-col justify-between min-h-[320px] sm:min-h-[440px] text-left">
            <div>
              <p class="text-[10px] font-bold uppercase tracking-[0.4em] text-zinc-400 mb-10">
                {{ authStore.isAuthenticated ? 'Your Avg. Exam Score' : 'Platform Avg. Score' }}
              </p>
              <div class="relative inline-block">
                <span class="text-[clamp(64px,8vw,128px)] font-black leading-none tracking-tighter transition-all duration-700">
                  {{ displayScore }}
                </span>
                <span v-if="averageScore !== null" class="text-[clamp(24px,3vw,40px)] font-black text-zinc-500 ml-2">%</span>
              </div>
            </div>
            <div class="text-[11px] text-zinc-500 font-bold max-w-xs leading-relaxed">
              {{ authStore.isAuthenticated
                ? 'Your performance rating across all verified practice sessions.'
                : 'Login to track your personal score and subject mastery.'
              }}
            </div>
          </div>
          <div class="p-8 sm:p-12 border-b border-zinc-100 dark:border-zinc-800 lg:border-b-0 lg:border-r min-h-[320px] sm:min-h-[440px] text-left">
            <p class="text-[10px] font-bold uppercase tracking-[0.4em] text-zinc-400 mb-10">Academic Mastery</p>
            <div class="space-y-6">
              <div v-for="sub in academicSubjects" :key="sub.code" class="flex flex-col gap-2 group text-left">
                <div class="flex justify-between items-end">
                  <span class="text-[13px] font-black tracking-widest text-zinc-400 group-hover:text-white transition-colors">{{ sub.name }}</span>
                  <span class="text-[8px] font-mono font-bold text-zinc-600">{{ sub.status }}</span>
                </div>
                <div class="w-full h-[2px] bg-white/5 relative overflow-hidden rounded-none"><div class="absolute inset-y-0 left-0 bg-brand/40 transition-all duration-1000" :style="{ width: showMatrix ? `${sub.mastery}%` : '0%' }"></div></div>
              </div>
            </div>
          </div>
          <div class="p-8 sm:p-12 border-b border-zinc-100 dark:border-zinc-800 lg:border-b-0 lg:border-r min-h-[320px] sm:min-h-[440px] flex flex-col justify-between text-left">
            <div>
              <p class="text-[10px] font-bold uppercase tracking-[0.4em] text-zinc-400 mb-10">Resource Bank</p>
              <h3 class="text-[clamp(32px,4vw,48px)] font-black leading-tight tracking-tighter uppercase text-left group">
                <span class="uppercase text-white">{{ totalQuestions }}</span>
                <br/>
                <span class="text-zinc-500 uppercase">Questions</span>
              </h3>
              <p v-if="totalQuizzes" class="mt-3 text-[9px] font-mono font-bold text-zinc-600 uppercase tracking-widest">
                Across {{ totalQuizzes }} modules
              </p>
            </div>
            <div class="space-y-4">
              <div class="flex items-center gap-4 text-left"><div class="w-2.5 h-2.5 bg-zinc-400 rounded-none animate-pulse"></div><span class="text-[9px] font-mono font-bold text-zinc-500">SOURCE: JAMB OFFICIAL</span></div>
              <div class="flex items-center gap-4 text-left"><div class="w-2.5 h-2.5 bg-zinc-700 rounded-none"></div><span class="text-[9px] font-mono font-bold text-zinc-500">LATEST UPDATE: CURRENT</span></div>
            </div>
          </div>
          <div class="p-8 sm:p-12 flex flex-col justify-center items-center min-h-[320px] sm:min-h-[440px] bg-white/5 text-white hover:bg-white transition-all duration-700 cursor-pointer text-center group">
            <router-link to="/subjects" class="text-center">
              <span class="text-[10px] font-bold uppercase tracking-[0.4em] mb-6 block text-zinc-400 group-hover:text-black transition-colors">Jump back in</span>
              <h4 class="text-[32px] font-black tracking-tighter uppercase leading-none group-hover:text-black transition-colors">PRACTICE <br/> NOW</h4>
              <div class="mt-10 flex justify-center gap-2 opacity-20 group-hover:opacity-100 transition-opacity"><div class="w-4 h-4 rounded-none border border-white group-hover:border-black"></div><div class="w-4 h-4 rounded-none bg-white group-hover:bg-black"></div><div class="w-4 h-4 rounded-none border border-white group-hover:border-black"></div></div>
            </router-link>
          </div>
        </div>
      </div>
    </section>

    <!-- Scene 4: The Social Intelligence (The Finale) -->
    <section id="social-intelligence" class="min-h-[100svh] h-[100svh] snap-start shrink-0 bg-white text-black relative flex flex-col justify-between pt-24 sm:pt-32 pb-6 sm:pb-16 px-6 sm:px-12 md:px-24 overflow-hidden">
      <div class="w-full overflow-hidden whitespace-nowrap border-y border-black/10 py-6 sm:py-12 bg-zinc-50/50 flex items-center">
        <div class="inline-block animate-marquee">
          <span v-for="(sig, i) in socialSignals" :key="i" class="text-[clamp(24px,4vw,48px)] font-black uppercase tracking-tighter mx-24">
            <span class="text-zinc-200 mr-6">●</span> {{ sig }}
          </span>
        </div>
        <div class="inline-block animate-marquee">
          <span v-for="(sig, i) in socialSignals" :key="i" class="text-[clamp(24px,4vw,48px)] font-black uppercase tracking-tighter mx-24">
            <span class="text-zinc-200 mr-6">●</span> {{ sig }}
          </span>
        </div>
      </div>

      <div class="flex flex-col items-center justify-center flex-1 py-4 sm:py-10">
        <div class="grid grid-cols-3 gap-4 sm:gap-20 w-full mb-6 sm:mb-16 max-w-5xl opacity-80">
          <div class="flex flex-col items-center"><span class="text-[clamp(28px,6vw,60px)] font-black leading-none mb-2 sm:mb-4">JAMB</span><span class="text-[10px] sm:text-[12px] font-bold tracking-[.3em] sm:tracking-[.4em] uppercase text-zinc-400">Exam Ready</span></div>
          <div class="flex flex-col items-center"><span class="text-[clamp(28px,6vw,60px)] font-black leading-none mb-2 sm:mb-4">WAEC</span><span class="text-[10px] sm:text-[12px] font-bold tracking-[.3em] sm:tracking-[.4em] uppercase text-zinc-400">Past Papers</span></div>
          <div class="flex flex-col items-center"><span class="text-[clamp(28px,6vw,60px)] font-black leading-none mb-2 sm:mb-4">NECO</span><span class="text-[10px] sm:text-[12px] font-bold tracking-[.3em] sm:tracking-[.4em] uppercase text-zinc-400">Complete Bank</span></div>
        </div>

        <router-link to="/register" class="group relative w-full max-w-3xl overflow-hidden py-4 sm:py-6 border-4 border-black text-center transition-all duration-500 hover:bg-black">
          <span class="text-[clamp(28px,6vw,84px)] font-black uppercase tracking-tighter text-black group-hover:text-white transition-colors relative z-10">
            Get Started Now
          </span>
          <div class="absolute inset-0 bg-black translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
        </router-link>
      </div>
    </section>

    <!-- Scene 5: The System Footer -->
    <section class="snap-start shrink-0">
      <AppFooter />
    </section>

    </div>
  </div>
</template>

<style scoped>
.noise-overlay { position: relative; }
.noise-overlay::before {
  content: ""; position: absolute; inset: 0; z-index: 15;
  background-image: url("https://grainy-gradients.vercel.app/noise.svg");
  opacity: 0.15; pointer-events: none; filter: contrast(150%) brightness(100%);
}
.grid-pattern { background-image: radial-gradient(circle at 1px 1px, white 1px, transparent 0); background-size: 40px 40px; }
.hide-scrollbar { 
  -ms-overflow-style: none !important; 
  scrollbar-width: none !important; 
}
.hide-scrollbar::-webkit-scrollbar { 
  display: none !important;
}
.scroll-snap-y-mandatory { scroll-snap-type: y mandatory; }
.scroll-snap-align-start { scroll-snap-align: start; }

@keyframes scan { 0% { top: 0%; opacity: 0; } 10% { opacity: 1; } 90% { opacity: 1; } 100% { top: 100%; opacity: 0; } }
.animate-scan { animation: scan 4s linear infinite; }

@keyframes aperture { 0%, 100% { height: 32rem; } 50% { height: 8rem; } }
.animate-aperture-pulse { animation: aperture 8s ease-in-out infinite; }

.animate-pulse-path { stroke-dasharray: 100; animation: dash 3s linear infinite; }
@keyframes dash { 0% { stroke-dashoffset: 100; } 100% { stroke-dashoffset: 0; } }

@keyframes glitch { 0% { transform: translate(0); clip-path: inset(40% 0 61% 0); } 20% { transform: translate(-5px, 5px); clip-path: inset(92% 0 1% 0); } 40% { transform: translate(-5px, -5px); clip-path: inset(43% 0 1% 0); } 60% { transform: translate(5px, 5px); clip-path: inset(25% 0 58% 0); } 80% { transform: translate(5px, -5px); clip-path: inset(54% 0 7% 0); } 100% { transform: translate(0); clip-path: inset(58% 0 43% 0); } }
.animate-glitch { animation: glitch 0.2s steps(2, end) infinite; }

@keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-100%); } }
.animate-marquee { display: inline-block; animation: marquee 30s linear infinite; }

@media (max-width: 640px) { @keyframes aperture { 0%, 100% { height: 16rem; } 50% { height: 6rem; } } }
</style>
