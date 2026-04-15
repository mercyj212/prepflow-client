<template>
  <NeoAppShell>
    <div class="h-full flex flex-col md:flex-row overflow-hidden bg-[var(--neo-surface)]">
      <!-- Chat List Sidebar -->
      <aside class="w-full md:w-80 border-r border-zinc-100 dark:border-white/5 flex flex-col bg-zinc-50/50 dark:bg-zinc-900/20">
        <header class="p-6 border-b border-zinc-100 dark:border-white/5">
          <h2 class="text-xs font-black uppercase tracking-[0.2em] text-zinc-400 mb-4">Messages</h2>
          <NeoCard variant="depressed" class="!rounded-2xl p-3 flex items-center gap-3 border-[0.5px] border-black/5 dark:border-white/5">
            <Search :size="14" class="text-zinc-400" />
            <input type="text" placeholder="Search chats..." class="bg-transparent border-none outline-none text-xs w-full text-zinc-700 dark:text-zinc-300">
          </NeoCard>
        </header>
        
        <div class="flex-1 overflow-y-auto custom-scrollbar">
          <div v-for="i in 3" :key="i" class="p-4 flex items-center gap-4 cursor-pointer hover:bg-white dark:hover:bg-zinc-800 transition-colors border-b border-zinc-50/50 dark:border-white/5 group">
            <div class="w-12 h-12 rounded-full border-2 border-white dark:border-zinc-800 shadow-sm overflow-hidden bg-zinc-200">
              <img :src="`https://api.dicebear.com/7.x/notionists/svg?seed=ai${i}`" class="w-full h-full object-cover">
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex justify-between items-center mb-1">
                <span class="text-[13px] font-bold text-zinc-800 dark:text-zinc-200">PrepUp AI Tutor</span>
                <span class="text-[10px] text-zinc-400">12:30 PM</span>
              </div>
              <p class="text-[11px] text-zinc-500 truncate">How can I help you with Biology today?</p>
            </div>
          </div>
        </div>
      </aside>

      <!-- Main Chat Area -->
      <section class="flex-1 flex flex-col relative bg-white dark:bg-zinc-900/30">
        <!-- Ambient Glows -->
        <div class="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-brand/5 dark:bg-brand/10 blur-[120px] rounded-full pointer-events-none"></div>

        <header class="h-16 flex items-center px-8 border-b border-zinc-100 dark:border-white/5 z-10">
          <div class="flex items-center gap-4">
            <div class="w-8 h-8 rounded-full border border-zinc-200 dark:border-zinc-700 overflow-hidden">
               <img src="https://api.dicebear.com/7.x/notionists/svg?seed=ai1" class="w-full h-full object-cover">
            </div>
            <div>
              <h3 class="text-[13px] font-bold text-zinc-800 dark:text-zinc-100">PrepUp AI Tutor</h3>
              <div class="flex items-center gap-1.5">
                <span class="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                <span class="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">Always Online</span>
              </div>
            </div>
          </div>
        </header>

        <div class="flex-1 overflow-y-auto p-8 flex flex-col gap-6 custom-scrollbar relative z-10">
          <!-- Welcome Message -->
          <div class="flex flex-col items-center justify-center my-12 opacity-50">
            <div class="w-16 h-16 rounded-[24px] bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-4 shadow-neo-inner">
              <Sparkles :size="28" :stroke-width="1.2" class="text-zinc-400" />
            </div>
            <p class="text-[11px] font-black uppercase tracking-[0.3em] text-center text-zinc-400">Encrypted Learning Session</p>
          </div>

          <!-- Chat Bubbles -->
          <div class="max-w-[80%] p-5 rounded-[24px] rounded-tl-sm bg-zinc-100 dark:bg-zinc-800/80 text-[13px] text-zinc-700 dark:text-zinc-300 leading-relaxed border border-white/40 dark:border-white/5">
            Hello! I'm your dedicated PrepUp AI Study Assistant. You can ask me to explain concepts, generate practice questions, or organize your study schedule. What's on your mind?
          </div>
        </div>

        <footer class="p-6 z-10">
          <NeoCard variant="depressed" class="!rounded-[28px] p-2 flex items-center gap-2 border-[0.5px] border-black/5 dark:border-white/5 bg-zinc-50/50 dark:bg-zinc-950/40">
            <input type="text" placeholder="Type a message..." class="flex-1 bg-transparent border-none outline-none px-4 text-[13px] text-zinc-700 dark:text-zinc-200">
            <button class="w-10 h-10 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 flex items-center justify-center transition-transform active:scale-90 hover:scale-105">
              <Send :size="16" />
            </button>
          </NeoCard>
        </footer>
      </section>
    </div>
  </NeoAppShell>
</template>

<script setup>
import { Search, Sparkles, Send } from 'lucide-vue-next';
import NeoAppShell from '../components/layout/NeoAppShell.vue';
import NeoCard from '../components/common/NeoCard.vue';
</script>
