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
          <!-- Game Card 1 -->
          <NeoCard variant="extruded" class="group !rounded-[32px] p-8 flex flex-col cursor-pointer hover:border-zinc-300 dark:hover:border-white/20 transition-all border border-zinc-100 dark:border-white/5 relative overflow-hidden h-[360px]">
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

          <!-- Game Card 2 -->
          <NeoCard variant="extruded" class="group !rounded-[32px] p-8 flex flex-col cursor-pointer hover:border-zinc-300 dark:hover:border-white/20 transition-all border border-zinc-100 dark:border-white/5 relative overflow-hidden h-[360px]">
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
                 <span class="text-[10px] font-black uppercase tracking-widest text-zinc-400">Cognitive Level 2</span>
                 <div class="w-10 h-10 rounded-full border border-zinc-200 dark:border-zinc-800 flex items-center justify-center group-hover:bg-zinc-900 dark:group-hover:bg-white group-hover:text-white dark:group-hover:text-zinc-900 transition-all">
                   <ArrowRight :size="18" :stroke-width="2" class="group-hover:translate-x-0.5 transition-transform" />
                 </div>
               </div>
             </div>
          </NeoCard>

          <!-- Game Card 3 -->
          <NeoCard variant="extruded" class="group !rounded-[32px] p-8 flex flex-col cursor-not-allowed bg-zinc-50/50 dark:bg-zinc-800/40 border border-dashed border-zinc-200 dark:border-white/10 h-[360px]">
            <div class="w-16 h-16 rounded-[24px] bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center shadow-neo-inner opacity-40 mb-auto">
              <Lock :size="32" :stroke-width="1.2" class="text-zinc-400" />
            </div>
            
            <div class="mt-8">
              <h3 class="text-xl font-medium text-zinc-400 mb-2">Social Duels</h3>
              <p class="text-[13px] text-zinc-400 mb-6 leading-relaxed">
                Locked. Complete 5 Practice sessions to unlock competitive multiplayer duels.
              </p>
              <div class="w-full h-1 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                <div class="w-[40%] h-full bg-zinc-400"></div>
              </div>
            </div>
          </NeoCard>
        </div>
      </section>
    </div>
  </NeoAppShell>
</template>

<script setup>
import { 
  Dices, 
  Timer, 
  Network, 
  Lock, 
  ArrowRight 
} from 'lucide-vue-next';
import NeoAppShell from '../components/layout/NeoAppShell.vue';
import NeoCard from '../components/common/NeoCard.vue';
</script>
