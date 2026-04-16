<script setup>
import { ref, onMounted } from 'vue';
import BrandLogo from '../components/BrandLogo.vue';

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
const isHoveringWindow = ref(false);
const sectionVisible = ref(false);
const showMatrix = ref(false);
const showFinale = ref(false);

const handleMouseMove = (e) => {
  if (!isHoveringWindow.value) return;
  const rect = e.currentTarget.getBoundingClientRect();
  const x = ((e.clientX - rect.left) / rect.width) * 100;
  const y = ((e.clientY - rect.top) / rect.height) * 100;
  mousePos.value = { x, y };
};

const academicSubjects = [
  { code: 'MAT_101', name: 'MATHEMATICS', status: 'READY' },
  { code: 'PHY_202', name: 'PHYSICS', status: 'ACTIVE' },
  { code: 'CHE_303', name: 'CHEMISTRY', status: 'READY' },
  { code: 'ENG_404', name: 'USE OF ENGLISH', status: 'READY' },
  { code: 'BIO_505', name: 'BIOLOGY', status: 'LOCKED' },
  { code: 'ECO_606', name: 'ECONOMICS', status: 'READY' },
];

const socialSignals = [
  'STUDENT_SCORE: 312_JAMB',
  'SUBJECT_MASTERY: PHYSICS_94%',
  'STUDENT_READY: WAEC_2026',
  'SYSTEM_LOG: 20,000+_STUDENTS',
  'AVERAGE_SCORE: 88.4%',
  'TOP_PERFORMANCE: BIOLOGY_A1'
];

onMounted(async () => {
  // Observers for Sections
  const tacObserver = new IntersectionObserver((entries) => {
    sectionVisible.value = entries[0].isIntersecting;
  }, { threshold: 0.2 });
  
  const matrixObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) showMatrix.value = true;
  }, { threshold: 0.2 });

  const finaleObserver = new IntersectionObserver((entries) => {
    showFinale.value = entries[0].isIntersecting;
  }, { threshold: 0.1 });

  const tacSection = document.querySelector('#tactical-section');
  if (tacSection) tacObserver.observe(tacSection);

  const matrixSection = document.querySelector('#mastery-matrix');
  if (matrixSection) matrixObserver.observe(matrixSection);

  const finaleSection = document.querySelector('#social-intelligence');
  if (finaleSection) finaleObserver.observe(finaleSection);

  // Start Typing Loop
  (async () => {
    // eslint-disable-next-line no-constant-condition
    while (true) {
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
      
      await new Promise(r => setTimeout(r, 4000));
      const nextSection = document.querySelector('#tactical-section');
      if (nextSection && !sectionVisible.value && !showMatrix.value && !showFinale.value) {
        nextSection.scrollIntoView({ behavior: 'smooth' });
      }
      
      await new Promise(r => setTimeout(r, 5000));
    }
  })();
});
</script>

<template>
  <div class="h-screen overflow-y-auto scroll-snap-y-mandatory scroll-smooth hide-scrollbar bg-black text-white font-sans selection:bg-white selection:text-black">
    
    <!-- Floating Elite Header -->
    <header 
      class="fixed top-0 left-0 right-0 z-[100] px-6 sm:px-12 md:px-20 py-8 flex justify-between items-center transition-all duration-700 pointer-events-none"
      :class="showFinale ? 'text-black' : 'text-white'"
    >
      <div 
        class="pointer-events-auto transition-all duration-700" 
        :class="{ 'dark': !showFinale }"
      >
        <BrandLogo size="md" />
      </div>

      <nav class="flex items-center gap-8 pointer-events-auto">
        <router-link 
          to="/login" 
          class="text-[11px] font-black uppercase tracking-[0.3em] transition-colors"
          :class="showFinale ? 'text-black hover:text-zinc-600' : 'text-white hover:text-zinc-400'"
        >
          Login
        </router-link>
        <router-link 
          to="/register" 
          class="group flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.3em] transition-all duration-700 border border-transparent hover:border-current px-4 py-2"
          :class="showFinale ? 'text-black border-black/10' : 'text-white border-white/10'"
        >
          Get Started
        </router-link>
      </nav>
    </header>

    <!-- Scene 1: The Narrative Hero -->
    <section class="min-h-screen scroll-snap-align-start shrink-0 relative flex flex-col md:flex-row overflow-hidden border-b border-white/5 noise-overlay">
      <div class="flex-1 z-20 flex flex-col justify-center px-6 sm:px-12 md:px-20 py-20 bg-black/40 backdrop-blur-[2px]">
        <div class="max-w-xl text-left">
          <h1 class="text-[clamp(44px,7vw,84px)] leading-[0.9] font-black tracking-tighter uppercase min-h-[4em]">
            <template v-for="(line, lIdx) in displayedLines" :key="lIdx">
              <span v-for="(seg, sIdx) in line" :key="sIdx" :class="seg.class">
                {{ seg.text }}
              </span>
              <br v-if="lIdx < displayedLines.length - 1"/>
            </template>
            <span v-if="!isDone" class="inline-block w-[0.15em] h-[0.8em] bg-white ml-1 animate-pulse align-middle"></span>
          </h1>
          
          <p class="mt-4 text-[16px] sm:text-[18px] text-white/50 font-medium max-w-md leading-relaxed transition-opacity duration-1000" :class="isDone ? 'opacity-100' : 'opacity-0'">
            Practice real CBT questions, track every gain, and approach your exams with complete precision.
          </p>
          
          <div class="mt-8 flex flex-col sm:flex-row items-center gap-6 transition-all duration-1000" :class="isDone ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'">
            <router-link to="/register" class="group relative px-10 py-5 bg-white text-black text-[13px] font-black uppercase tracking-widest overflow-hidden hover:bg-zinc-200 transition-colors w-full sm:w-auto text-center font-bold">
              Start Practicing
              <span class="absolute right-4 group-hover:translate-x-1 transition-transform">→</span>
            </router-link>
            
            <router-link to="/login" class="text-[11px] font-black uppercase tracking-[0.3em] text-white/40 hover:text-white transition-colors">
              Go to Dashboard
            </router-link>
          </div>
        </div>
      </div>
      <div class="absolute inset-y-0 right-0 w-full md:w-[65%] z-0 overflow-hidden">
        <div class="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent z-10 md:block hidden"></div>
        <div class="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent z-10 md:hidden block"></div>
        <img src="/avatar-female.jpg" alt="Focused Student" class="absolute inset-0 w-full h-full object-cover grayscale brightness-[1.05] contrast-[1.1] transition-transform duration-[2s] hover:scale-105"/>
      </div>
    </section>

    <!-- Scene 2: The Focused Path -->
    <section id="tactical-section" class="min-h-screen scroll-snap-align-start shrink-0 flex items-center justify-center bg-zinc-950 relative overflow-hidden py-32 px-6 sm:px-12 md:px-24 border-b border-white/5">
      <div class="absolute inset-0 pointer-events-none opacity-[0.03] grid-pattern z-0"></div>
      <div class="max-w-7xl w-full grid grid-cols-1 md:grid-cols-12 gap-12 items-center z-10">
        <div class="md:col-span-5 text-left order-2 md:order-1">
          <h2 class="text-[clamp(32px,4vw,54px)] leading-[1] font-black tracking-tighter uppercase mb-2 max-w-sm text-left">
            Learning should feel focused,<br/>
            <span class="text-zinc-600">not overwhelming.</span>
          </h2>
          <router-link to="/login" class="group inline-flex items-center gap-2 mt-8 text-[11px] font-black uppercase tracking-[0.4em] text-white/20 hover:text-white transition-all duration-500">
            <span class="transition-transform group-hover:-translate-x-1">[</span> DASHBOARD_ACCESS <span class="transition-transform group-hover:translate-x-1">]</span>
          </router-link>
        </div>
        <div class="md:col-span-7 relative order-1 md:order-2 flex justify-end">
          <div class="relative w-full max-w-2xl group cursor-crosshair overflow-hidden border border-white/20 bg-black transition-all duration-[3.5s] ease-in-out" :class="sectionVisible ? 'animate-aperture-pulse' : 'h-44'" @mouseenter="isHoveringWindow = true" @mouseleave="isHoveringWindow = false" @mousemove="handleMouseMove">
            <div class="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-white/40 z-30"></div>
            <div class="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-white/40 z-30"></div>
            <div class="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-white/40 z-30"></div>
            <div class="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-white/40 z-30"></div>
            <div class="absolute top-6 left-12 flex items-start gap-4 z-30 hidden sm:flex text-left">
              <div class="text-[8px] font-mono uppercase tracking-widest text-white/40 leading-relaxed">// FOCUS_DEPTH: 88.42% <br/> // STUDY_MODE: ACTIVE</div>
              <svg width="40" height="20" class="opacity-30"><path d="M0 10 L5 10 L8 2 L12 18 L15 10 L40 10" stroke="white" fill="none" class="animate-pulse-path" /></svg>
            </div>
            <div class="absolute bottom-6 right-12 text-[8px] font-mono uppercase tracking-widest text-white/40 z-30 hidden sm:block text-right">MASTERED: TRUE <br/> TIME_PER_QN: 0.04s</div>
            <div class="absolute inset-x-0 h-[1px] bg-white/40 z-20 animate-scan"></div>
            <div class="absolute inset-0 transition-all duration-[1.5s] ease-out" :class="isHoveringWindow ? 'blur-0 contrast-125' : 'blur-[2px] contrast-100'">
              <img src="/avatar-male.jpg" alt="Focused Eyes" class="absolute inset-0 w-full h-full object-cover grayscale opacity-80 group-hover:scale-105 transition-transform duration-[5s]" style="object-position: 85% 32%;"/>
              <div v-if="isHoveringWindow" class="absolute inset-0 bg-white/5 z-20 mix-blend-overlay animate-glitch"></div>
            </div>
            <div class="absolute inset-0 z-30 pointer-events-none transition-opacity duration-700" :class="isHoveringWindow ? 'opacity-100' : 'opacity-0'" :style="{ background: `radial-gradient(circle at ${mousePos.x}% ${mousePos.y}%, rgba(255,255,255,0.15) 0%, transparent 60%)` }"></div>
            <div class="absolute inset-0 bg-gradient-to-r from-black via-transparent to-transparent z-10 opacity-60"></div>
          </div>
          <div class="absolute -right-6 top-0 bottom-0 flex flex-col justify-between py-4 opacity-10 hidden lg:flex"><div v-for="i in 10" :key="i" class="w-4 h-[1px] bg-white"></div></div>
        </div>
      </div>
    </section>

    <!-- Scene 3: The Academic Command Center -->
    <section id="mastery-matrix" class="min-h-screen scroll-snap-align-start shrink-0 flex items-center justify-center bg-black relative overflow-hidden py-32 px-6 sm:px-12 md:px-24 border-b border-white/5">
      <div class="absolute inset-0 pointer-events-none opacity-[0.02] grid-pattern z-0 scale-[0.5]"></div>
      <div class="max-w-7xl w-full z-10 transition-all duration-[1.5s]" :class="showMatrix ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 border border-white/10">
          <div class="p-10 border-b border-white/10 lg:border-b-0 lg:border-r border-white/10 flex flex-col justify-between min-h-[400px] text-left">
            <div>
              <p class="text-[10px] font-mono uppercase tracking-[0.4em] text-white/30 mb-8">// YOUR_EXAM_SCORE</p>
              <div class="relative inline-block"><span class="text-[clamp(60px,8vw,120px)] font-black leading-none tracking-tighter">82.4</span><span class="text-[clamp(24px,3vw,40px)] font-black text-white/20 ml-2">%</span></div>
            </div>
            <div class="text-[11px] text-zinc-500 font-bold max-w-[200px] leading-relaxed">Your performance rating across all practice sessions.</div>
          </div>
          <div class="p-10 border-b border-white/10 lg:border-b-0 lg:border-r border-white/10 min-h-[400px] text-left">
            <p class="text-[10px] font-mono uppercase tracking-[0.4em] text-white/30 mb-8">// STUDY_SUBJECTS</p>
            <div class="space-y-6">
              <div v-for="sub in academicSubjects" :key="sub.code" class="flex flex-col gap-1 group text-left">
                <div class="flex justify-between items-end">
                  <span class="text-[12px] font-black tracking-widest text-white/60 group-hover:text-white transition-colors">{{ sub.name }}</span>
                  <span class="text-[8px] font-mono text-white/20">{{ sub.status }}</span>
                </div>
                <div class="w-full h-[1px] bg-white/5 relative overflow-hidden"><div class="absolute inset-y-0 left-0 bg-white/20 transition-all duration-1000" :style="{ width: showMatrix ? '40%' : '0%' }"></div></div>
              </div>
            </div>
          </div>
          <div class="p-10 border-b border-white/10 lg:border-b-0 lg:border-r border-white/10 flex flex-col justify-between min-h-[400px] text-left">
            <div>
              <p class="text-[10px] font-mono uppercase tracking-[0.4em] text-white/30 mb-8">// QUESTION_BANK</p>
              <h3 class="text-[clamp(32px,4vw,48px)] font-black leading-tight tracking-tighter uppercase text-left">24k+ <br/> <span class="text-zinc-700">Questions</span></h3>
            </div>
            <div class="space-y-4">
              <div class="flex items-center gap-4 text-left"><div class="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div><span class="text-[9px] font-mono text-white/30">SOURCE: JAMB/WAEC_OFFICIAL</span></div>
              <div class="flex items-center gap-4 text-left"><div class="w-1.5 h-1.5 bg-zinc-700 rounded-full"></div><span class="text-[9px] font-mono text-white/30">LATEST_UPDATE: CURRENT</span></div>
            </div>
          </div>
          <div class="p-10 flex flex-col justify-center items-center min-h-[400px] bg-white/5 group hover:bg-white transition-all duration-700 cursor-pointer text-center">
            <router-link to="/subjects" class="text-center">
              <span class="text-[10px] font-mono uppercase tracking-[0.4em] mb-4 block text-white/40 group-hover:text-black/40 transition-colors">START_LEARNING</span>
              <h4 class="text-[28px] font-black tracking-tighter uppercase text-white group-hover:text-black transition-colors leading-none">PRACTICE <br/> NOW</h4>
              <div class="mt-8 flex justify-center gap-1 opacity-20 group-hover:opacity-100 transition-opacity"><div class="w-3 h-3 border border-white group-hover:border-black"></div><div class="w-3 h-3 border border-white group-hover:border-black bg-white group-hover:bg-black"></div><div class="w-3 h-3 border border-white group-hover:border-black"></div></div>
            </router-link>
          </div>
        </div>
      </div>
    </section>

    <!-- Scene 4: The Social Intelligence (The White-Out Finale) -->
    <section id="social-intelligence" class="min-h-screen scroll-snap-align-start shrink-0 bg-white text-black relative flex flex-col justify-between py-24 px-6 sm:px-12 md:px-24">
      <div class="w-full overflow-hidden whitespace-nowrap border-y-2 border-black py-4">
        <div class="inline-block animate-marquee">
          <span v-for="(sig, i) in socialSignals" :key="i" class="text-[clamp(24px,4vw,48px)] font-black uppercase tracking-tighter mx-12">
            {{ sig }} <span class="text-zinc-300 ml-12">//</span>
          </span>
        </div>
        <div class="inline-block animate-marquee">
          <span v-for="(sig, i) in socialSignals" :key="i" class="text-[clamp(24px,4vw,48px)] font-black uppercase tracking-tighter mx-12">
            {{ sig }} <span class="text-zinc-300 ml-12">//</span>
          </span>
        </div>
      </div>

      <div class="flex flex-col items-center justify-center flex-1 py-10">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-20 w-full mb-24 max-w-5xl opacity-80">
          <div class="flex flex-col items-center"><span class="text-[60px] font-black leading-none mb-4">JAMB</span><span class="text-[12px] font-bold tracking-[.4em] uppercase text-zinc-400">Exam Ready</span></div>
          <div class="flex flex-col items-center"><span class="text-[60px] font-black leading-none mb-4">WAEC</span><span class="text-[12px] font-bold tracking-[.4em] uppercase text-zinc-400">Past Papers</span></div>
          <div class="flex flex-col items-center"><span class="text-[60px] font-black leading-none mb-4">NECO</span><span class="text-[12px] font-bold tracking-[.4em] uppercase text-zinc-400">Complete Bank</span></div>
        </div>

        <router-link to="/register" class="group relative w-full max-w-3xl overflow-hidden py-10 border-4 border-black text-center transition-all duration-500 hover:bg-black">
          <span class="text-[clamp(32px,6vw,84px)] font-black uppercase tracking-tighter text-black group-hover:text-white transition-colors relative z-10">
            Get Started Now
          </span>
          <div class="absolute inset-0 bg-black translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
        </router-link>
      </div>

      <div class="flex flex-col md:flex-row justify-between items-end gap-10">
        <div class="text-left">
          <BrandLogo class="scale-100 invert mb-6" />
          <p class="text-[10px] font-black text-black uppercase tracking-widest leading-relaxed">PREPUP // BETTER STUDYING <br/> SYSTEM: ONLINE_READY</p>
        </div>
        <div class="text-right">
           <p class="text-[10px] font-black text-black tracking-[0.4em] uppercase mb-2">© 2026 PREPUP CBT</p>
           <p class="text-[9px] font-mono text-zinc-400 tracking-widest uppercase">BUILT_FOR_STUDENTS // SCALING_AFRICA</p>
        </div>
      </div>
    </section>

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
.hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
.hide-scrollbar::-webkit-scrollbar { display: none; }
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
