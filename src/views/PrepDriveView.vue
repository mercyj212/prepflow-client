<template>
  <div class="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans relative overflow-hidden select-none">
    <!-- Ambient background glow -->
    <div class="absolute top-0 inset-x-0 h-[40vh] bg-brand/5 blur-[120px] pointer-events-none"></div>

    <!-- HUD (Heads Up Display) -->
    <header class="p-6 md:px-12 flex justify-between items-center z-10 shrink-0">
      <div class="flex items-center gap-4">
        <button @click="$router.push('/games')" class="w-10 h-10 flex items-center justify-center rounded-full bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 transition-colors group" title="Exit Game">
          <ChevronLeft :size="20" class="text-zinc-400 group-hover:text-white transition-colors" />
        </button>
        <div>
          <h1 class="text-[11px] font-black uppercase tracking-[0.3em] text-brand">PrepDrive</h1>
          <p class="text-[9px] uppercase tracking-widest text-zinc-500 font-bold mt-1">Route 01 • Focus Mode</p>
        </div>
      </div>
      
      <!-- Stats Area -->
      <div class="flex items-center gap-6">
        <div class="text-right">
          <p class="text-[9px] font-black uppercase tracking-widest text-zinc-500">Score</p>
          <p class="text-xl font-black tabular-nums tracking-wider mt-0.5">{{ score }}</p>
        </div>
        <div class="hidden md:block w-px h-8 bg-zinc-800"></div>
        <div class="hidden md:block text-right">
          <p class="text-[9px] font-black uppercase tracking-widest text-zinc-500 text-amber-500/80">Multiplier</p>
          <p class="text-xl font-black text-amber-500 mt-0.5 tabular-nums">{{ multiplier.toFixed(1) }}x</p>
        </div>
      </div>
    </header>

    <!-- Central Game Stage -->
    <main class="flex-1 relative flex items-center justify-center z-10 overflow-hidden">
      <!-- Perspective "Road" grid -->
      <div class="absolute inset-0 flex flex-col items-center justify-end pointer-events-none opacity-40">
        <!-- 4 Lanes -->
        <div class="w-full max-w-4xl h-[60vh] border-x border-t border-brand/20 bg-gradient-to-t from-brand/5 to-transparent flex" style="transform: perspective(600px) rotateX(45deg); transform-origin: bottom;">
          <div class="flex-1 border-r border-dashed border-brand/20 relative">
            <div class="absolute bottom-4 inset-x-0 text-center text-[200px] font-black text-brand/5 opacity-50 leading-none">A</div>
          </div>
          <div class="flex-1 border-r border-dashed border-brand/20 relative">
            <div class="absolute bottom-4 inset-x-0 text-center text-[200px] font-black text-brand/5 opacity-50 leading-none">B</div>
          </div>
          <div class="flex-1 border-r border-dashed border-brand/20 relative">
            <div class="absolute bottom-4 inset-x-0 text-center text-[200px] font-black text-brand/5 opacity-50 leading-none">C</div>
          </div>
          <div class="flex-1 relative">
            <div class="absolute bottom-4 inset-x-0 text-center text-[200px] font-black text-brand/5 opacity-50 leading-none">D</div>
          </div>
        </div>
      </div>

      <!-- Center Status / HUD Overlays -->
      <div class="z-20 w-full max-w-2xl mx-auto p-4 flex flex-col items-center">
        
        <!-- INTRO PHASE -->
        <template v-if="gameState === 'intro'">
          <div class="w-24 h-24 bg-white border border-brand/50 rounded-[28px] overflow-hidden shadow-[0_0_40px_rgba(59,130,246,0.15)] flex items-center justify-center mb-8 relative">
            <img src="/game-car.png" alt="PrepDrive Car Token" class="w-full h-full object-cover scale-[1.1]" />
          </div>
          
          <h2 class="text-2xl md:text-3xl font-medium tracking-tight mb-4 text-white">Start your engine.</h2>
          <p class="text-xs md:text-[13px] text-zinc-400 leading-relaxed mb-10 max-w-sm text-center">
            Questions will appear here. Shift into the correct lane before time runs out.
          </p>

          <button 
            @click="startGame"
            class="px-10 py-4 bg-white hover:bg-zinc-200 active:scale-[0.98] rounded-full text-zinc-900 text-[11px] font-black uppercase tracking-[0.2em] transition-all relative overflow-hidden shadow-lg shadow-white/10 group"
          >
            <span class="flex items-center gap-2">
              Ignite Engine
              <Rocket :size="14" class="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </span>
          </button>
        </template>

        <!-- READING PHASE -->
        <template v-else-if="gameState === 'reading'">
          <div class="w-full max-w-xl bg-zinc-900/90 backdrop-blur-2xl border border-zinc-800/80 rounded-[32px] p-8 md:p-10 shadow-2xl relative overflow-hidden mx-auto">
            <div class="absolute top-0 right-0 w-64 h-64 bg-brand/10 blur-[100px] pointer-events-none translate-x-1/2 -translate-y-1/2"></div>
            
            <div class="flex items-center gap-3 mb-8 relative z-10">
              <span class="px-3 py-1 rounded-full bg-zinc-800 text-zinc-300 text-[10px] font-black uppercase tracking-widest border border-zinc-700">Question {{ currentQuestionIndex + 1 }}</span>
              <span class="w-2 h-2 rounded-full bg-amber-500 animate-pulse shadow-[0_0_10px_rgba(245,158,11,0.5)]"></span>
              <span class="text-[10px] font-bold uppercase tracking-widest text-amber-500/80">Memorize Options</span>
            </div>

            <h2 class="text-xl md:text-2xl font-medium text-white leading-relaxed mb-8 relative z-10">
              {{ currentQuestion.text }}
            </h2>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-3 mb-10 relative z-10">
              <div 
                v-for="(opt, index) in currentQuestion.options" 
                :key="index"
                class="p-4 rounded-xl bg-zinc-950/50 border border-zinc-800/50 flex items-center gap-4 hover:border-zinc-700 transition-colors"
              >
                <div class="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-[11px] font-black text-zinc-300 shrink-0">
                  {{ opt.label }}
                </div>
                <p class="text-[14px] text-zinc-300 font-medium">{{ opt.text }}</p>
              </div>
            </div>

            <button 
              @click="startDriving"
              class="w-full py-4 bg-white hover:bg-zinc-200 active:scale-[0.98] rounded-2xl text-zinc-900 text-[12px] font-black uppercase tracking-[0.2em] transition-all relative z-10 flex items-center justify-center gap-3 shadow-[0_10px_30px_rgba(255,255,255,0.15)] group"
            >
              Start Driving
              <ArrowRight :size="18" class="group-hover:translate-x-1 transition-transform" stroke-width="2.5" />
            </button>
          </div>
        </template>
        
        <!-- DRIVING PHASE -->
        <template v-else-if="gameState === 'driving'">
          <!-- Top contextual HUD -->
          <div class="absolute top-10 left-1/2 -translate-x-1/2 z-30 px-8 py-3.5 rounded-full bg-zinc-950/80 backdrop-blur-xl border border-zinc-800 text-white flex items-center gap-3 shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
            <span class="w-2.5 h-2.5 rounded-full bg-brand animate-pulse shadow-[0_0_10px_rgba(59,130,246,0.6)]"></span>
            <span class="text-[11px] font-black uppercase tracking-widest text-zinc-300">Target Your Lane</span>
          </div>

          <!-- 3D Perspective Road Wrapper -->
          <div class="absolute inset-0 perspective-container overflow-hidden z-0 bg-zinc-950">
            <!-- Central Road Plane -->
            <div class="road-plane absolute bottom-0 left-1/2 -translate-x-1/2 w-[130vw] md:w-[120vw] lg:w-[1200px] h-[150vh] flex bg-zinc-950 border-x border-zinc-800" style="transform-style: preserve-3d;">
              <!-- Grid overlay for a tech aesthetic -->
              <div 
                class="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:100%_40px] pointer-events-none"
                :class="isLockedIn ? 'animate-[moveRoad_0.15s_linear_infinite]' : 'animate-[moveRoad_0.6s_linear_infinite]'"
              ></div>

              <!-- Dark fade-out to black at the horizon -->
              <div class="absolute inset-0 bg-gradient-to-t from-transparent via-zinc-950/90 to-zinc-950 z-10 pointer-events-none" style="mask-image: linear-gradient(to top, transparent 10%, black 60%);"></div>

              <!-- The 4 Lanes -->
              <div v-for="(letter, idx) in ['A','B','C','D']" :key="idx" 
                   @click="setLane(idx)" 
                   class="flex-1 road-lines pointer-events-auto cursor-pointer flex items-end justify-center pb-32 group relative"
                   :class="idx < 3 ? 'border-r-[4px] border-dashed border-white/20' : ''">
                <!-- Lane highlight -->
                <div class="absolute inset-0 transition-all duration-500" :class="currentLane === idx ? 'bg-brand/10 shadow-[inset_0_0_40px_rgba(59,130,246,0.1)]' : 'group-hover:bg-brand/5'"></div>
                <!-- Giant Lane Letter -->
                <span class="text-[160px] font-black text-white/5 relative z-0 transition-all duration-300" :class="{ 'text-brand/40 scale-[1.15] -translate-y-4': currentLane === idx }">{{ letter }}</span>
              </div>
              
              <!-- 3D Obstacle Hardware Barriers -->
              <div v-for="obs in obstacles" :key="obs.id"
                   class="absolute transition-none z-10 flex flex-col justify-end items-center pointer-events-none z-20"
                   :style="{ left: `${obs.lane * 25}%`, width: '25%', bottom: `${obs.y}vh`, height: '10vh' }">
                <!-- Hovering Hardware Box -->
                <div 
                   class="w-[50%] h-[80%] bg-zinc-950 border-[3px] border-red-600 rounded-lg flex justify-between px-3 items-center relative overflow-hidden transition-all duration-150"
                   :class="obs.hit ? 'brightness-[3] shadow-[0_0_80px_rgba(239,68,68,1)] scale-110 !border-white' : 'shadow-[0_-20px_60px_rgba(220,38,38,0.25)]'"
                   style="transform-origin: bottom center; transform: rotateX(-75deg);"
                >
                   <div class="absolute inset-0 bg-[repeating-linear-gradient(45deg,rgba(220,38,38,0.3),rgba(220,38,38,0.3)_15px,transparent_15px,transparent_30px)]"></div>
                   <div class="w-3 h-3 rounded-full bg-red-500 shadow-[0_0_10px_red] animate-ping relative z-10"></div>
                   <div class="w-3 h-3 rounded-full bg-red-500 shadow-[0_0_10px_red] animate-ping relative z-10" style="animation-delay: 500ms"></div>
                </div>
              </div>
              
              <!-- Futuristic Checkpoint Gate -->
              <div v-show="isLockedIn && gateY > -50"
                   class="absolute w-full flex items-end justify-center pointer-events-none z-30 transition-none"
                   :style="{ bottom: `${gateY}vh`, height: '40vh', left: 0 }">
                  <!-- High-tech energy archway -->
                  <div 
                     class="w-[98%] h-full border-x-[12px] border-t-[12px] border-brand/90 rounded-t-[40px] shadow-[0_0_100px_rgba(59,130,246,0.6)] flex items-start justify-center relative overflow-hidden"
                     style="transform-origin: bottom center; transform: rotateX(-75deg);"
                  >
                     <div class="absolute inset-0 bg-gradient-to-b from-brand/40 to-transparent"></div>
                     <div class="mt-6 px-10 py-3 bg-zinc-950/90 border-2 border-brand/60 rounded-full text-white font-black tracking-[0.3em] uppercase shadow-[0_0_40px_rgba(59,130,246,1)] flex items-center gap-3">
                       <span class="w-2 h-2 rounded-full bg-white animate-pulse"></span>
                       EVALUATION ZONE
                       <span class="w-2 h-2 rounded-full bg-white animate-pulse"></span>
                     </div>
                  </div>
              </div>
              
              <!-- Neutral Start Zone Launchpad -->
              <div 
                class="absolute bottom-0 left-1/2 -translate-x-1/2 w-[40%] h-[30vh] flex flex-col justify-end items-center pb-12 transition-all duration-700 pointer-events-none"
                :class="currentLane === -1 ? 'opacity-100' : 'opacity-10'"
              >
                <!-- Glowing borders -->
                <div class="absolute inset-0 border-x-2 border-t-2 border-brand/40 rounded-t-lg bg-gradient-to-t from-brand/20 to-transparent shadow-[0_0_50px_rgba(59,130,246,0.15)]"></div>
                <span class="text-brand/80 font-black tracking-[0.5em] text-xl relative z-10" style="transform: scaleY(2);">START</span>
              </div>
            </div>
          </div>

          <!-- 2D Car overlay -->
          <div class="absolute bottom-[20vh] max-h-32 left-1/2 -translate-x-1/2 w-[130vw] md:w-[120vw] lg:w-[1200px] pointer-events-none z-20">
            <!-- Tracking Parent Wrapper -->
            <div 
              class="absolute bottom-0 transition-all duration-[300ms] ease-[cubic-bezier(0.175,0.885,0.32,1.275)] will-change-transform flex flex-col items-center justify-end"
              :style="{ left: carPosition.left, transform: carPosition.transform }"
            >
               <!-- Floating Target Badge -->
               <div 
                 class="absolute -top-14 whitespace-nowrap px-5 py-2 bg-zinc-950 text-white font-bold tracking-[0.2em] text-xs rounded-xl shadow-[0_10px_20px_rgba(0,0,0,0.8)] border border-brand/40 transition-all duration-300 flex items-center gap-2"
                 :class="currentLane !== -1 ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-90 translate-y-4'"
               >
                 <span class="text-zinc-400 font-medium text-[10px]">TARGET</span>
                 <span class="text-brand text-sm">{{ isLockedIn ? ['A', 'B', 'C', 'D'][lockedAnswer] : (currentLane !== -1 ? ['A', 'B', 'C', 'D'][currentLane] : '-') }}</span>
               </div>

               <!-- The Car Token -->
               <div 
                 class="w-24 h-24 bg-white border-[3px] rounded-3xl overflow-hidden flex items-center justify-center car-idle relative"
                 :class="currentLane !== -1 ? 'border-brand shadow-[0_15px_40px_rgba(59,130,246,0.5)]' : 'border-zinc-300'"
               >
                  <!-- Drop shadow underneath car -->
                  <div class="absolute -bottom-8 w-20 h-4 bg-black/60 blur-md rounded-[100%] shadow-[0_0_20px_rgba(59,130,246,0.2)]"></div>
                  <!-- Image as playing piece -->
                  <img src="/game-car.png" alt="Player Car" class="w-full h-full object-cover scale-[1.15] relative z-10" />
               </div>
            </div>
          </div>

          <!-- ACCELERATE (Submit) -->
          <div v-if="currentLane !== -1 && !isLockedIn" class="absolute bottom-[8vh] left-1/2 -translate-x-1/2 z-30 pointer-events-auto">
            <button 
              @click="lockInAnswer" 
              class="group relative px-10 py-4 bg-white text-black font-bold uppercase tracking-[0.2em] rounded-full shadow-[0_0_40px_rgba(255,255,255,0.15)] hover:shadow-[0_0_60px_rgba(59,130,246,0.3)] transition-all overflow-hidden flex items-center gap-3 active:scale-95"
            >
              <div class="absolute inset-0 bg-brand translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
              <span class="relative z-10 group-hover:text-white transition-colors">Accelerate</span>
              <Rocket class="w-5 h-5 relative z-10 group-hover:text-white transition-colors group-hover:translate-x-1 duration-300" />
            </button>
          </div>
          
          <!-- LOCKED IN HUD -->
          <div v-if="isLockedIn" class="absolute bottom-[10vh] left-1/2 -translate-x-1/2 z-30 flex flex-col items-center animate-pulse pointer-events-none">
            <span class="text-white font-bold tracking-[0.3em] text-sm flex items-center gap-3">
              <span class="w-2 h-2 rounded-full bg-brand animate-ping"></span>
              APPROACHING CHECKPOINT
            </span>
          </div>

          <div v-if="!isLockedIn" class="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/40 text-xs tracking-widest uppercase font-medium whitespace-nowrap">
            Use A, B, C, D or Tap Lanes to Steer.
          </div>
        </template>
        
        <!-- FEEDBACK PHASE -->
        <template v-else-if="gameState === 'feedback'">
          <div 
            class="w-full max-w-md mx-auto bg-zinc-900/90 backdrop-blur-xl border border-zinc-800 rounded-[32px] p-8 md:p-12 shadow-2xl relative overflow-hidden flex flex-col items-center text-center"
            :class="isCorrect ? 'border-brand/30 shadow-[0_0_50px_rgba(59,130,246,0.15)]' : 'border-red-500/30' "
          >
            <!-- Glowing ambient background matching result -->
            <div class="absolute top-0 right-0 w-64 h-64 blur-[100px] pointer-events-none translate-x-1/2 -translate-y-1/2" :class="isCorrect ? 'bg-brand/20' : 'bg-red-500/20'"></div>
            
            <div 
              class="w-20 h-20 rounded-3xl flex items-center justify-center mb-6 relative z-10" 
              :class="isCorrect ? 'bg-brand border border-brand/50 shadow-[0_0_30px_rgba(59,130,246,0.4)]' : 'bg-red-500/10 border border-red-500/30 shadow-[0_0_30px_rgba(239,68,68,0.2)]'"
            >
               <component :is="isCorrect ? 'Check' : 'X'" :size="36" class="text-white" :class="isCorrect ? '' : 'text-red-500'" stroke-width="3" />
            </div>

            <h2 class="text-2xl font-bold text-white mb-2 relative z-10 tracking-tight uppercase" :class="{'text-white text-3xl': isCorrect}">
              {{ isCorrect ? 'Perfect Navigation!' : 'Wrong Answer!' }}
            </h2>
            
            <p v-if="penalties > 0" class="text-red-400 font-bold tracking-[0.2em] mb-4 uppercase text-xs relative z-10 animate-pulse">
               -{{ penalties * 5 }} Points ({{ penalties }} Collisions)
            </p>
            
            <p v-else-if="isCorrect" class="text-brand font-black tracking-widest uppercase mb-8 relative z-10 text-[11px] bg-brand/10 py-2 px-4 rounded-full border border-brand/20">
               +{{ 100 * (multiplier - 0.5) }} Points Added
            </p>
            <div v-else class="mb-8 relative z-10">
               <p class="text-zinc-400 text-[12px] uppercase tracking-widest font-bold mb-3">Correct Lane:</p>
               <div class="inline-flex items-center justify-center w-16 h-16 rounded-[20px] bg-zinc-950 border-2 border-zinc-800 text-white font-black text-3xl shadow-inner">
                 {{ currentQuestion.correct }}
               </div>
            </div>

            <button 
              @click="nextQuestion"
              class="w-full py-4 rounded-2xl text-[12px] font-black uppercase tracking-[0.2em] transition-all relative z-10 flex items-center justify-center gap-3 group"
              :class="isCorrect ? 'bg-white hover:bg-zinc-200 text-zinc-900 shadow-[0_10px_20px_rgba(255,255,255,0.1)]' : 'bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700'"
            >
              {{ isLastQuestion ? 'Complete Run' : 'Next Question' }}
              <ArrowRight :size="18" class="group-hover:translate-x-1 transition-transform" stroke-width="2.5" />
            </button>
          </div>
        </template>

      </div>
    </main>

    <!-- Bottom Instruction Bar -->
    <footer class="p-6 md:px-12 z-10 border-t border-zinc-900 shrink-0 bg-zinc-950/80 backdrop-blur-md">
      <div class="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-zinc-600">
        <div class="flex gap-4 items-center">
           <span class="w-2 h-2 rounded-full bg-brand animate-pulse"></span>
           System Ready
        </div>
        <div class="hidden sm:block">Use A, B, C, D or tap lanes to steer.</div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { ChevronLeft, Rocket, ArrowRight, Check, X } from 'lucide-vue-next';

// Game States: 'intro' | 'reading' | 'driving' | 'feedback'
const gameState = ref('intro');

// Game Engine State
const score = ref(0);
const multiplier = ref(1.0);
const currentQuestionIndex = ref(0);
const isCorrect = ref(false);
const currentLane = ref(-1); // Starts completely neutral
const carTilt = ref(0);
const isLockedIn = ref(false);
const lockedAnswer = ref(-1);
const penalties = ref(0);
const obstacles = ref([]);
const gateY = ref(-100);
let obstacleEngine = null;

const mockQuestions = [
  {
    text: "Which of the following elements is a noble gas and exhibits extremely low chemical reactivity?",
    options: [
      { label: 'A', text: 'Oxygen (O)' },
      { label: 'B', text: 'Argon (Ar)' },
      { label: 'C', text: 'Nitrogen (N)' },
      { label: 'D', text: 'Chlorine (Cl)' }
    ],
    correct: 'B'
  },
  {
    text: "In physics, what is the standard unit of measurement for force?",
    options: [
      { label: 'A', text: 'Watt' },
      { label: 'B', text: 'Joule' },
      { label: 'C', text: 'Newton' },
      { label: 'D', text: 'Pascal' }
    ],
    correct: 'C'
  },
  {
    text: "What part of the cell is primarily responsible for generating the energy needed to power cellular reactions?",
    options: [
      { label: 'A', text: 'Mitochondria' },
      { label: 'B', text: 'Nucleus' },
      { label: 'C', text: 'Ribosome' },
      { label: 'D', text: 'Endoplasmic Reticulum' }
    ],
    correct: 'A'
  }
];

const currentQuestion = computed(() => mockQuestions[currentQuestionIndex.value]);
const isLastQuestion = computed(() => currentQuestionIndex.value >= mockQuestions.length - 1);

const startGame = () => {
  gameState.value = 'reading';
};

const startDriving = () => {
  // Reset car position whenever starting a new drive
  currentLane.value = -1; 
  carTilt.value = 0;
  isLockedIn.value = false;
  gameState.value = 'driving';
};

// --- DRIVING LOGIC ---
const carPosition = computed(() => {
  // Visually calibrated mathematically to perfectly map the perspective track narrowing at 20vh height
  const positions = ['17.5%', '39.5%', '60.5%', '82.5%'];
  // When neutral (-1), dock exactly at 50%
  return { 
    left: currentLane.value === -1 ? '50%' : positions[currentLane.value],
    transform: `translateX(-50%) rotateZ(${carTilt.value}deg)` 
  };
});

const setLane = (idx) => {
  if (gameState.value !== 'driving') return;
  currentLane.value = idx;
  // Add a slight tilt animation
  carTilt.value = idx > 1 ? 10 : -10;
  setTimeout(() => carTilt.value = 0, 300);
};

const moveCar = (dir, targetLane = -1) => {
  if (gameState.value !== 'driving') return;
  
  if (targetLane !== -1) {
    setLane(targetLane);
    return;
  }
};

// Movement Controls
const moveLeft = () => {
  if (gameState.value !== 'driving') return;
  if (currentLane.value === -1) {
    setLane(1); // Jump to Lane B from dead center
  } else if (currentLane.value > 0) {
    setLane(currentLane.value - 1);
  }
};

const moveRight = () => {
  if (gameState.value !== 'driving') return;
  if (currentLane.value === -1) {
    setLane(2); // Jump to Lane C from dead center
  } else if (currentLane.value < 3) {
    setLane(currentLane.value + 1);
  }
};

// --- ANSWER VERIFICATION LOGIC ---
const lockInAnswer = () => {
  if (currentLane.value === -1 || isLockedIn.value) return;
  
  lockedAnswer.value = currentLane.value;
  isLockedIn.value = true;
  penalties.value = 0;
  
  // Generate a massive wave of obstacles dropping in
  const bd = lockedAnswer.value;
  obstacles.value = [
    // Wave 1
    { id: 1, lane: bd, y: 130, hit: false },
    
    // Wave 2
    { id: 2, lane: (bd + 1) % 4, y: 180, hit: false },
    { id: 3, lane: (bd + 3) % 4, y: 180, hit: false },
    
    // Wave 3 tightly packed
    { id: 4, lane: (bd + 2) % 4, y: 240, hit: false },
    { id: 5, lane: bd, y: 240, hit: false },
    
    // Final Wave
    { id: 6, lane: 0, y: 300, hit: false },
    { id: 7, lane: 3, y: 300, hit: false },
  ];
  
  // Spawn the Evaluation Checkpoint Gate mapped perfectly to hit at 2.5 seconds
  gateY.value = 345;
  
  let lastTime = performance.now();
  
  const collisionLoop = (t) => {
    if (!isLockedIn.value) return;
    const delta = (t - lastTime) / 1000;
    lastTime = t;
    
    // Move gate mathematically linked to obstacle speed
    gateY.value -= delta * 130;
    
    obstacles.value.forEach(obs => {
      obs.y -= delta * 130; // Massively sped up
      // Collision box 
      if (obs.y > 10 && obs.y < 35 && !obs.hit) {
         if (obs.lane === currentLane.value) {
            obs.hit = true;
            penalties.value++;
            carTilt.value = 65; // Smash tilt!
            setTimeout(() => carTilt.value = 0, 300);
         }
      }
    });
    
    obstacleEngine = requestAnimationFrame(collisionLoop);
  };
  
  obstacleEngine = requestAnimationFrame(collisionLoop);
  
  // Transition to feedback after a 2.5-second speed thrill
  setTimeout(() => {
    cancelAnimationFrame(obstacleEngine);
    checkAnswer();
  }, 2500);
};

const checkAnswer = () => {
  // Map index to letter
  const selectedLaneLetter = ['A', 'B', 'C', 'D'][lockedAnswer.value];
  const actualCorrectLetter = currentQuestion.value.correct;
  
  if (selectedLaneLetter === actualCorrectLetter) {
    isCorrect.value = true;
    score.value += 100 * multiplier.value;
    multiplier.value = Math.min( multiplier.value + 0.5, 3.0 ); // cap at 3x
    streak.value++;
  } else {
    isCorrect.value = false;
    multiplier.value = 1.0; // reset multiplier
    streak.value = 0;
  }
  
  // Deduct obstacle penalties
  score.value -= (penalties.value * 5);
  // Ensure score doesn't become randomly negative if they had 0
  if (score.value < 0) score.value = 0;
  
  gameState.value = 'feedback';
};

const nextQuestion = () => {
  isLockedIn.value = false;
  if (isLastQuestion.value) {
    // If end of mock queue, return to intro 
    currentQuestionIndex.value = 0;
    score.value = 0;
    multiplier.value = 1.0;
    gameState.value = 'intro';
  } else {
    currentQuestionIndex.value++;
    gameState.value = 'reading';
  }
};

// Keyboard listener for arrows and letters
const handleKeydown = (e) => {
  if (gameState.value !== 'driving') return;
  
  // Quick submit on Enter key
  if (e.key === 'Enter') {
      lockInAnswer();
      return;
  }
  
  if (e.key === 'ArrowLeft') moveLeft();
  if (e.key === 'ArrowRight') moveRight();

  const keyMap = { 'A': 0, 'B': 1, 'C': 2, 'D': 3 };
  const idx = keyMap[e.key.toUpperCase()];
  if (idx !== undefined) moveCar(0, idx);
};

// Mobile Touch/Swipe detect
let touchStartX = 0;
let touchEndX = 0;

const handleTouchStart = (e) => {
  if (gameState.value !== 'driving') return;
  touchStartX = e.changedTouches[0].screenX;
};

const handleTouchEnd = (e) => {
  if (gameState.value !== 'driving') return;
  touchEndX = e.changedTouches[0].screenX;
  handleSwipe();
};

const handleSwipe = () => {
  const swipeThreshold = 40; 
  if (touchEndX < touchStartX - swipeThreshold) moveLeft();
  if (touchEndX > touchStartX + swipeThreshold) moveRight();
};

onMounted(() => {
  window.addEventListener('keydown', handleKeydown);
  window.addEventListener('touchstart', handleTouchStart);
  window.addEventListener('touchend', handleTouchEnd);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown);
  window.removeEventListener('touchstart', handleTouchStart);
  window.removeEventListener('touchend', handleTouchEnd);
  clearTimeout(tiltTimeout);
});
</script>

<style scoped>
/* Keyframe to move the grid coordinates dynamically */
@keyframes moveRoad {
  0% { background-position: 0 0; }
  100% { background-position: 0 40px; }
}

/* Pseudo-3D Perspective */
.perspective-container {
  perspective: 700px;
}

/* Road Plane Tilted Backwards */
.road-plane {
  transform: rotateX(75deg);
  transform-origin: bottom center;
}

/* Moving Road Lines Illusion */
.road-lines {
  /* Creating chunkier, more pronounced racing stripes */
  background-image: linear-gradient(to bottom, transparent 0%, transparent 60%, rgba(255,255,255,0.2) 60%, rgba(255,255,255,0.2) 100%);
  background-size: 100% 250px;
  animation: driveFast 0.25s linear infinite;
}

@keyframes driveFast {
  from { background-position-y: 0px; }
  to { background-position-y: 250px; }
}

/* Car Idle Bounce */
.car-idle {
  animation: carBumpy 1.2s ease-in-out infinite alternate;
}

@keyframes carBumpy {
  0% { margin-bottom: 0px; }
  100% { margin-bottom: 4px; }
}
</style>
