<template>
  <NeoAppShell>
    <div class="h-full flex px-2 sm:px-4 lg:px-8 py-4 gap-8">
      <section class="flex-1 flex flex-col min-w-0 h-full overflow-y-auto pb-10 custom-scrollbar pr-4 pt-1">
        <header class="mb-12">
          <div class="flex items-center gap-3 mb-2">
            <span class="text-2xl">⚄</span>
            <span class="text-[10px] font-black uppercase tracking-[0.3em] text-brand">Learning Hub</span>
          </div>
          <h1 class="text-[42px] font-medium text-zinc-800 dark:text-zinc-100 tracking-tight leading-tight">Gamified Mastery</h1>
          <p class="text-[15px] font-normal text-zinc-500 dark:text-zinc-500 mt-2 max-w-xl">
             Challenge your memory through intentional micro-games. Clinical depth meets playful interaction.
          </p>
        </header>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <!-- Game Card 1 -->
          <NeoCard variant="extruded" class="group !rounded-[32px] p-8 flex flex-col cursor-pointer hover:border-brand/30 transition-all border border-white/40 dark:border-white/5 relative overflow-hidden h-[340px]">
            <div class="absolute top-0 right-0 w-32 h-32 bg-brand/5 blur-3xl rounded-full translate-x-12 -translate-y-12"></div>
            
            <span class="text-4xl mb-auto group-hover:scale-110 group-hover:rotate-12 transition-transform duration-500">⏳</span>
            
            <div>
              <h3 class="text-xl font-bold text-zinc-800 dark:text-zinc-100 mb-2">Speed Recall</h3>
              <p class="text-[13px] text-zinc-500 dark:text-zinc-400 mb-6 leading-relaxed">
                Identify the correct answer under extreme time pressure. Sharpens recall speed.
              </p>
              
              <div class="flex items-center justify-between">
                <span class="text-[10px] font-black uppercase tracking-widest text-zinc-400">Memory Level 1</span>
                <button class="w-10 h-10 rounded-full border border-zinc-200 dark:border-zinc-800 flex items-center justify-center group-hover:bg-zinc-900 dark:group-hover:bg-white group-hover:text-white dark:group-hover:text-zinc-900 transition-all">
                  →
                </button>
              </div>
            </div>
          </NeoCard>

          <!-- Game Card 2 -->
          <NeoCard variant="extruded" class="group !rounded-[32px] p-8 flex flex-col cursor-pointer hover:border-brand/30 transition-all border border-white/40 dark:border-white/5 relative overflow-hidden h-[340px]">
             <div class="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 blur-3xl rounded-full translate-x-12 -translate-y-12"></div>
             <span class="text-4xl mb-auto group-hover:scale-110 group-hover:-rotate-12 transition-transform duration-500">🛰️</span>
             
             <div>
               <h3 class="text-xl font-bold text-zinc-800 dark:text-zinc-100 mb-2">Concept Mapping</h3>
               <p class="text-[13px] text-zinc-500 dark:text-zinc-400 mb-6 leading-relaxed">
                 Connect related academic nodes to build a comprehensive cognitive map of your subject.
               </p>
               
               <div class="flex items-center justify-between">
                 <span class="text-[10px] font-black uppercase tracking-widest text-zinc-400">Cognitive Level 2</span>
                 <button class="w-10 h-10 rounded-full border border-zinc-200 dark:border-zinc-800 flex items-center justify-center group-hover:bg-zinc-900 dark:group-hover:bg-white group-hover:text-white dark:group-hover:text-zinc-900 transition-all">
                   →
                 </button>
               </div>
             </div>
          </NeoCard>

          <!-- Game Card 3 -->
          <NeoCard variant="extruded" class="group !rounded-[32px] p-8 flex flex-col cursor-pointer bg-zinc-50/50 dark:bg-zinc-800/40 border border-dashed border-zinc-300 dark:border-white/10 h-[340px]">
            <span class="text-4xl mb-auto opacity-30">🔐</span>
            <div>
              <h3 class="text-xl font-bold text-zinc-400 mb-2">Social Duels</h3>
              <p class="text-[13px] text-zinc-400 mb-6 leading-relaxed">
                Locked. Complete 5 Practice sessions to unlock competitive multiplayer duels.
              </p>
              <div class="w-full h-1 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                <div class="w-[40%] h-full bg-brand"></div>
              </div>
            </div>
          </NeoCard>
        </div>
      </section>
    </div>
  </NeoAppShell>
</template>

<script setup>
import NeoAppShell from '../components/layout/NeoAppShell.vue';
import NeoCard from '../components/common/NeoCard.vue';
</script>
