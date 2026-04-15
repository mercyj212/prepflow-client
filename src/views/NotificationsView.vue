<template>
  <NeoAppShell>
    <div class="h-full flex px-2 sm:px-4 lg:px-8 py-4 gap-8">
      <section class="flex-1 flex flex-col min-w-0 h-full overflow-y-auto pb-10 custom-scrollbar pr-4 pt-1">
        <header class="mb-12">
          <h1 class="text-[34px] font-medium text-zinc-800 dark:text-zinc-100 tracking-tight mb-1">Notifications</h1>
          <p class="text-[15px] font-normal text-zinc-500 dark:text-zinc-500">System alerts and study reminders.</p>
        </header>

        <div class="flex flex-col gap-4 max-w-3xl">
           <NeoCard variant="extruded" class="!rounded-2xl p-6 flex items-start gap-4 opacity-50">
             <div class="w-10 h-10 rounded-full bg-brand/10 text-brand flex items-center justify-center shrink-0">
               <Bell :size="18" :stroke-width="2" />
             </div>
             <div>
               <h3 class="text-[15px] font-medium text-zinc-800 dark:text-zinc-200">Welcome to PrepFlow!</h3>
               <p class="text-[13px] text-zinc-500 mt-1">We're excited to have you on board. Check out your dashboard to start practicing.</p>
               <span class="text-[10px] font-bold text-zinc-400 mt-3 block uppercase tracking-widest">Just now</span>
             </div>
           </NeoCard>
           
           <div class="py-24 flex flex-col items-center justify-center opacity-40 text-center">
                <div class="w-16 h-16 rounded-[20px] bg-zinc-50 dark:bg-zinc-800/50 flex items-center justify-center mb-6 shadow-neo-inner">
                  <Inbox :size="32" :stroke-width="1.2" class="text-zinc-300" />
                </div>
                <p class="text-[11px] font-black uppercase tracking-[0.2em] text-zinc-400">All caught up</p>
                <p class="text-[13px] font-normal text-zinc-500 mt-1">No other notifications right now.</p>
           </div>
        </div>
      </section>
    </div>
  </NeoAppShell>
</template>

<script setup>
import { Bell, Inbox } from 'lucide-vue-next';
import NeoAppShell from '../components/layout/NeoAppShell.vue';
import NeoCard from '../components/common/NeoCard.vue';
</script>
