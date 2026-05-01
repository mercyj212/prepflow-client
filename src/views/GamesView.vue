<template>
  <NeoAppShell>
    <div class="h-full flex px-2 sm:px-4 lg:px-8 py-4 gap-8">
      <section class="flex-1 flex flex-col min-w-0 h-full overflow-y-auto pb-10 custom-scrollbar pr-4 pt-1">
        <header class="mb-12">
          <div class="flex items-center gap-3 mb-2">
            <Dices :size="20" :stroke-width="1.5" class="text-zinc-600 dark:text-zinc-400" />
            <span class="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 dark:text-zinc-400">Learning Hub</span>
          </div>
          <h1 class="text-[42px] font-medium text-zinc-800 dark:text-zinc-100 tracking-tight leading-tight">Gamified Mastery</h1>
          <p class="text-[15px] font-normal text-zinc-500 dark:text-zinc-500 mt-2 max-w-xl leading-relaxed">
             Challenge your memory through intentional micro-games. Clinical depth meets playful interaction.
          </p>
        </header>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <!-- PrepDrive Game Card (LOCKED UNLESS ADMIN) -->
          <NeoCard 
            @click="handlePrepDriveClick" 
            variant="extruded" 
            class="group !rounded-[32px] p-8 flex flex-col transition-all relative overflow-hidden h-[360px] bg-zinc-50 dark:bg-zinc-900 hover:border-brand/50 dark:hover:border-brand/30 border-zinc-100 dark:border-white/5 cursor-pointer"
          >
            <div class="absolute top-0 right-0 w-48 h-48 bg-brand/10 dark:bg-brand/20 blur-3xl rounded-full translate-x-16 -translate-y-16"></div>
            
            <div class="w-16 h-16 rounded-[24px] bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 flex items-center justify-center shadow-neo-inner transition-transform duration-500 mb-auto relative z-10 group-hover:scale-110 group-hover:-rotate-6">
               <Gamepad2 :size="32" :stroke-width="1.5" />
            </div>
            
            <div class="absolute top-6 right-6 z-20">
              <div class="px-3 py-1 rounded-full bg-brand/10 dark:bg-brand/20 border border-brand/20 dark:border-brand/30 text-brand font-bold text-[10px] tracking-widest uppercase flex items-center gap-2 shadow-sm">
                <span class="w-1.5 h-1.5 rounded-full bg-brand animate-pulse"></span>
                Active Mission
              </div>
            </div>
            
            <div class="mt-8 relative z-10 transition-all duration-300">
              <h3 class="text-xl font-medium text-zinc-800 dark:text-zinc-100 mb-2">PrepDrive</h3>
              <p class="text-[13px] text-zinc-500 dark:text-zinc-400 mb-6 leading-relaxed">
                A quiz-based driving game where you move into the lane of the correct answer.
              </p>
              
              <div class="flex items-center justify-between">
                <span class="text-[10px] font-black uppercase tracking-widest text-brand">Read. Choose. Drive. Learn.</span>
                <div 
                  class="w-10 h-10 rounded-full border border-zinc-200 dark:border-zinc-700 flex items-center justify-center bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 group-hover:scale-110 transition-transform shadow-lg shadow-black/10 dark:shadow-white/10"
                >
                  <ArrowRight :size="18" :stroke-width="2" class="group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            </div>
          </NeoCard>

          <!-- Speed Recall Game Card -->
          <NeoCard 
            @click="$router.push('/games/speed-recall')"
            variant="extruded" 
            class="group !rounded-[32px] p-8 flex flex-col cursor-pointer hover:border-zinc-300 dark:hover:border-white/20 transition-all border border-zinc-100 dark:border-white/5 relative overflow-hidden h-[360px]"
          >
            <div class="absolute top-0 right-0 w-32 h-32 bg-zinc-900/5 dark:bg-white/5 blur-3xl rounded-full translate-x-12 -translate-y-12"></div>
            
            <div class="w-16 h-16 rounded-[24px] bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center shadow-neo-inner group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500 mb-auto">
              <Timer :size="32" :stroke-width="1.2" class="text-zinc-600 dark:text-zinc-400" />
            </div>
            
            <div class="mt-8">
              <h3 class="text-xl font-medium text-zinc-800 dark:text-zinc-100 mb-2">Speed Recall</h3>
              <p class="text-[13px] text-zinc-500 dark:text-zinc-400 mb-6 leading-relaxed">
                Identify the correct answer under extreme time pressure. Sharpens recall speed.
              </p>
              
              <div class="flex items-center justify-between">
                <span class="text-[10px] font-black uppercase tracking-widest text-zinc-400">Memory Level 1</span>
                <div class="w-10 h-10 rounded-full border border-zinc-200 dark:border-zinc-800 flex items-center justify-center group-hover:bg-zinc-900 dark:group-hover:bg-white group-hover:text-white dark:group-hover:text-zinc-900 transition-all">
                  <ArrowRight :size="18" :stroke-width="2" class="group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            </div>
          </NeoCard>

          <!-- Concept Mapping Game Card -->
          <NeoCard
            @click="$router.push('/games/concept-mapping')"
            variant="extruded"
            class="group !rounded-[32px] p-8 flex flex-col cursor-pointer hover:border-zinc-300 dark:hover:border-white/20 transition-all border border-zinc-100 dark:border-white/5 relative overflow-hidden h-[360px]"
          >
             <div class="absolute top-0 right-0 w-32 h-32 bg-zinc-900/5 dark:bg-white/5 blur-3xl rounded-full translate-x-12 -translate-y-12"></div>
             
             <div class="w-16 h-16 rounded-[24px] bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center shadow-neo-inner group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-500 mb-auto">
               <Network :size="32" :stroke-width="1.2" class="text-zinc-600 dark:text-zinc-400" />
             </div>
             
             <div class="mt-8">
               <h3 class="text-xl font-medium text-zinc-800 dark:text-zinc-100 mb-2">Concept Mapping</h3>
               <p class="text-[13px] text-zinc-500 dark:text-zinc-400 mb-6 leading-relaxed">
                 Connect related academic nodes to build a comprehensive cognitive map of your subject.
               </p>
               
               <div class="flex items-center justify-between">
                 <span class="text-[10px] font-black uppercase tracking-widest text-zinc-400">Paid Courses Only</span>
                 <div class="w-10 h-10 rounded-full border border-zinc-200 dark:border-zinc-800 flex items-center justify-center group-hover:bg-zinc-900 dark:group-hover:bg-white group-hover:text-white dark:group-hover:text-zinc-900 transition-all">
                   <ArrowRight :size="18" :stroke-width="2" class="group-hover:translate-x-0.5 transition-transform" />
                 </div>
               </div>
             </div>
          </NeoCard>

          <!-- Social Duels Game Card -->
          <NeoCard
            @click="$router.push('/games/social-duels')"
            variant="extruded"
            class="group !rounded-[32px] p-8 flex flex-col cursor-pointer hover:border-zinc-300 dark:hover:border-white/20 transition-all border border-zinc-100 dark:border-white/5 relative overflow-hidden h-[360px]"
          >
            <div class="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 dark:bg-rose-400/10 blur-3xl rounded-full translate-x-12 -translate-y-12"></div>

            <div class="w-16 h-16 rounded-[24px] bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center shadow-neo-inner group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-500 mb-auto relative z-10">
              <Swords :size="32" :stroke-width="1.2" class="text-zinc-600 dark:text-zinc-400" />
            </div>

            <div class="absolute top-6 right-6 z-20">
              <div class="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold text-[10px] tracking-widest uppercase flex items-center gap-2 shadow-sm">
                Live
              </div>
            </div>
            
            <div class="mt-8 relative z-10">
              <h3 class="text-xl font-medium text-zinc-800 dark:text-zinc-100 mb-2">Social Duels</h3>
              <p class="text-[13px] text-zinc-500 dark:text-zinc-400 mb-6 leading-relaxed">
                Pick a paid course and battle a rival through timed quiz rounds.
              </p>
              
              <div class="flex items-center justify-between">
                <span class="text-[10px] font-black uppercase tracking-widest text-zinc-400">Paid Courses Only</span>
                <div class="w-10 h-10 rounded-full border border-zinc-200 dark:border-zinc-800 flex items-center justify-center group-hover:bg-zinc-900 dark:group-hover:bg-white group-hover:text-white dark:group-hover:text-zinc-900 transition-all">
                  <ArrowRight :size="18" :stroke-width="2" class="group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            </div>
          </NeoCard>
          <!-- End of Game Cards Grid -->
        </div>

        <!-- Leaderboard Section (Moved Below) -->
        <div class="mt-12 mb-8">
          <div class="flex items-center justify-between mb-6">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-[12px] bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center shadow-neo-inner">
                <Trophy class="w-5 h-5 text-zinc-800 dark:text-zinc-100" />
              </div>
              <h2 class="text-2xl font-semibold text-zinc-800 dark:text-zinc-100 tracking-tight">
                {{ activeLeaderboard === 'prepDrive' ? 'Top Drivers' : 'Top Recalls' }}
              </h2>
            </div>

            <!-- Game Toggle -->
            <div class="flex bg-zinc-100 dark:bg-zinc-800/50 p-1 rounded-xl border border-zinc-200 dark:border-white/5">
              <button 
                @click="setActiveLeaderboard('prepDrive')"
                :class="[
                  'px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all',
                  activeLeaderboard === 'prepDrive' 
                    ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-sm' 
                    : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300'
                ]"
              >
                PrepDrive
              </button>
              <button 
                @click="setActiveLeaderboard('speedRecall')"
                :class="[
                  'px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all',
                  activeLeaderboard === 'speedRecall' 
                    ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-sm' 
                    : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300'
                ]"
              >
                Recall
              </button>
            </div>
          </div>
          
          <NeoCard variant="extruded" class="!rounded-[32px] p-6 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800">
            <div v-if="loadingLeaderboard" class="flex flex-col gap-4">
              <div v-for="i in 3" :key="i" class="flex items-center gap-4 p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/20 border border-zinc-100 dark:border-white/5 animate-pulse">
                <div class="w-10 h-10 rounded-full bg-zinc-200 dark:bg-zinc-800 shrink-0"></div>
                <div class="flex-1 space-y-2">
                    <div class="h-4 bg-zinc-200 dark:bg-zinc-800 w-2/3 rounded"></div>
                    <div class="h-3 bg-zinc-200 dark:bg-zinc-800 w-1/3 rounded"></div>
                </div>
              </div>
            </div>
            <div v-else-if="leaderboard.length === 0" class="text-sm text-zinc-500 text-center py-10">
              No scores recorded yet for {{ activeLeaderboard === 'prepDrive' ? 'PrepDrive' : 'Speed Recall' }}.
            </div>
            <div v-else class="flex flex-col gap-4 max-h-[400px] overflow-y-auto custom-scrollbar pr-2 pb-2">
              <div 
                v-for="(player, idx) in leaderboard" 
                :key="idx" 
                :class="[
                  'flex items-center gap-4 p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-700/50 transition-all relative overflow-hidden shrink-0',
                  idx === 0 ? 'p-8 scale-[1.02] border-zinc-900/30 dark:border-white/40 shadow-xl ring-1 ring-zinc-900/20 dark:ring-white/20' : 'hover:border-zinc-200 dark:hover:border-zinc-600'
                ]"
              >
                <!-- Rank Badge -->
                <div 
                  :class="[
                    'w-12 h-12 rounded-2xl flex items-center justify-center text-xs font-black shrink-0 transition-transform',
                    idx === 0 ? 'bg-zinc-900 dark:bg-white text-white dark:text-black scale-110 shadow-lg' : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'
                  ]"
                >
                  {{ getRankLabel(idx) }}
                </div>

                <div class="flex-1 min-w-0">
                  <p 
                    :class="[
                      'font-semibold truncate',
                      idx === 0 ? 'text-xl text-zinc-900 dark:text-white' : 'text-base text-zinc-800 dark:text-zinc-200'
                    ]"
                  >
                    {{ player.fullName }}
                  </p>
                  <div class="flex items-center gap-2 mt-1">
                    <span 
                      :class="[
                        'font-mono',
                        idx === 0 ? 'text-lg text-brand font-bold' : 'text-sm text-emerald-500 dark:text-emerald-400'
                      ]"
                    >
                      {{ (activeLeaderboard === 'prepDrive' ? player.prepDriveScore : player.speedRecallScore)?.toLocaleString() || 0 }} pts
                    </span>
                    <span class="text-[11px] text-zinc-400 dark:text-zinc-500">
                      • {{ (activeLeaderboard === 'prepDrive' ? player.prepDriveAwards : player.speedRecallAwards) || 0 }} awards
                    </span>
                  </div>
                </div>

                <!-- 1st Place Trophy -->
                <div v-if="idx === 0" class="flex items-center justify-center pr-2">
                  <div class="relative animate-trophy-shake">
                    <div class="absolute inset-0 bg-yellow-500/20 blur-xl rounded-full animate-pulse"></div>
                    <Trophy :size="48" class="text-yellow-500 relative z-10 filter drop-shadow-lg" />
                  </div>
                </div>
              </div>
            </div>
          </NeoCard>
        </div>
      </section>

      <!-- PrepDrive Modal -->
      <div v-if="showPrepDriveModal" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/20 dark:bg-black/60 backdrop-blur-sm">
        <NeoCard class="w-full max-w-md !rounded-[32px] overflow-hidden shadow-2xl flex flex-col border border-zinc-200 dark:border-white/5 bg-white dark:bg-zinc-900">
          <!-- Header -->
          <div class="flex items-center justify-between p-6 pb-4 border-b border-zinc-100 dark:border-white/5">
             <div class="flex items-center gap-3">
               <div class="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-900 dark:text-zinc-100">
                 <Gamepad2 :size="16" />
               </div>
               <h3 class="text-[11px] font-black uppercase tracking-[0.2em] text-zinc-800 dark:text-zinc-200">PrepDrive</h3>
             </div>
             <button @click="showPrepDriveModal = false" class="p-2 -mr-2 -mt-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 hover:text-zinc-600 transition-colors">
               <X :size="18" />
             </button>
          </div>
          
          <div class="p-6">
            <h4 class="text-sm font-black uppercase tracking-[0.2em] text-zinc-400 mb-5">How to play</h4>
            <ul class="space-y-4 mb-8">
              <li class="flex items-start gap-4">
                <span class="w-6 h-6 rounded-full bg-zinc-900 dark:bg-white flex items-center justify-center text-[10px] font-bold text-white dark:text-zinc-900 shrink-0 mt-0.5 shadow-md">1</span>
                <p class="text-[13px] text-zinc-600 dark:text-zinc-300 pt-0.5 font-medium">Tap <strong class="text-zinc-800 dark:text-zinc-100">Start Game</strong> to launch the simulation.</p>
              </li>
              <li class="flex items-start gap-4">
                <span class="w-6 h-6 rounded-full bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-white/5 flex items-center justify-center text-[10px] font-bold text-zinc-500 shrink-0 mt-0.5">2</span>
                <p class="text-[13px] text-zinc-600 dark:text-zinc-300 pt-0.5 font-medium">Steer left or right to dodge traffic and obstacles.</p>
              </li>
              <li class="flex items-start gap-4">
                <span class="w-6 h-6 rounded-full bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-white/5 flex items-center justify-center text-[10px] font-bold text-zinc-500 shrink-0 mt-0.5">3</span>
                <p class="text-[13px] text-zinc-600 dark:text-zinc-300 pt-0.5 font-medium">Reach a glowing checkpoint gateway to trigger a question.</p>
              </li>
              <li class="flex items-start gap-4">
                <span class="w-6 h-6 rounded-full bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-white/5 flex items-center justify-center text-[10px] font-bold text-zinc-500 shrink-0 mt-0.5">4</span>
                <p class="text-[13px] text-zinc-600 dark:text-zinc-300 pt-0.5 font-medium">Answer correctly to boost speed and earn shield charges.</p>
              </li>
              <li class="flex items-start gap-4">
                <span class="w-6 h-6 rounded-full bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-white/5 flex items-center justify-center text-[10px] font-bold text-zinc-500 shrink-0 mt-0.5">5</span>
                <p class="text-[13px] text-zinc-600 dark:text-zinc-300 pt-0.5 font-medium">Avoid collisions to keep your lives and momentum.</p>
              </li>
            </ul>

            <div class="flex items-center gap-3 w-full">
              <button 
                @click="showPrepDriveModal = false" 
                class="flex-1 py-3 px-4 rounded-2xl bg-zinc-50 border border-zinc-200 hover:bg-zinc-100 dark:bg-zinc-800 dark:border-white/5 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-300 text-[11px] font-black uppercase tracking-widest transition-colors flex items-center justify-center"
              >
                Cancel
              </button>
              <button 
                @click="$router.push('/games/prepdrive')"
                class="flex-[2] py-3 px-4 rounded-2xl bg-zinc-900 dark:bg-white hover:opacity-90 active:scale-[0.98] text-white dark:text-zinc-900 text-[11px] font-black uppercase tracking-widest transition-all flex items-center justify-center shadow-lg shadow-black/10 dark:shadow-white/10 group"
              >
                Start Game
                <ArrowRight :size="14" :stroke-width="2.5" class="ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </NeoCard>
      </div>

      <!-- Coming Soon Toast -->
      <Transition
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="transform translate-y-8 opacity-0"
        enter-to-class="transform translate-y-0 opacity-100"
        leave-active-class="transition duration-200 ease-in"
        leave-from-class="transform translate-y-0 opacity-100"
        leave-to-class="transform translate-y-8 opacity-0"
      >
        <div v-if="showComingSoonToast" class="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] px-6 py-4 bg-zinc-900 border border-zinc-800 rounded-full shadow-2xl flex items-center gap-3">
          <Lock class="w-4 h-4 text-brand" />
          <p class="text-[13px] font-medium text-zinc-100 tracking-wide">PrepDrive is currently under development and will be available soon.</p>
        </div>
      </Transition>

    </div>
  </NeoAppShell>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useAuthStore } from '../store/auth';
import { 
  Dices, 
  Timer, 
  Network, 
  Lock, 
  ArrowRight,
  Gamepad2,
  X,
  Trophy,
  Swords
} from 'lucide-vue-next';
import NeoAppShell from '../components/layout/NeoAppShell.vue';
import NeoCard from '../components/common/NeoCard.vue';
import api from '../api/axios';

const authStore = useAuthStore();
const isAdmin = computed(() => authStore.user?.role === 'admin');

const showPrepDriveModal = ref(false);
const showComingSoonToast = ref(false);

const handlePrepDriveClick = () => {
  showPrepDriveModal.value = true;
};

// Leaderboard state and fetch
const leaderboard = ref([]);
const loadingLeaderboard = ref(true);
const activeLeaderboard = ref('prepDrive');

const fetchLeaderboard = async (game = 'prepDrive') => {
  loadingLeaderboard.value = true;
  try {
    const res = await api.get(`/game/leaderboard?game=${game}`);
    if (res.data.success) {
      leaderboard.value = res.data.data;
    }
  } catch (err) {
    console.error('Failed to fetch leaderboard:', err);
  } finally {
    loadingLeaderboard.value = false;
  }
};

const setActiveLeaderboard = (game) => {
  activeLeaderboard.value = game;
  fetchLeaderboard(game);
};

const getRankLabel = (idx) => {
  const n = idx + 1;
  if (n === 1) return '1st';
  if (n === 2) return '2nd';
  if (n === 3) return '3rd';
  return n + 'th';
};

onMounted(() => {
  fetchLeaderboard();
});
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 10px;
}

@keyframes trophy-shake {
  0% { transform: rotate(0deg) scale(1); }
  25% { transform: rotate(-10deg) scale(1.1); }
  50% { transform: rotate(10deg) scale(1.1); }
  75% { transform: rotate(-10deg) scale(1.1); }
  100% { transform: rotate(0deg) scale(1); }
}

.animate-trophy-shake {
  animation: trophy-shake 0.8s cubic-bezier(0.36, 0.07, 0.19, 0.97) infinite;
  transform-origin: bottom center;
}
</style>
