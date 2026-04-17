<template>
  <footer class="bg-black text-white py-16 px-6 sm:px-12 md:px-24 relative overflow-hidden">
    <!-- Optional: Subtle grid background like other sections -->
    <div class="absolute inset-0 opacity-[0.03] pointer-events-none grid-pattern"></div>

    <div class="max-w-7xl mx-auto relative z-10">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-12 sm:gap-20 items-end">
        <div class="text-left">
          <BrandLogo size="md" :is-light="false" class="mb-8" />
          <div class="flex flex-col gap-4">
            <p class="text-[11px] font-black text-zinc-400 uppercase tracking-[0.3em] leading-relaxed">
              PREPUP BETTER STUDYING <br/> SYSTEM: ONLINE READY
            </p>
            <nav class="flex gap-6 mt-4">
              <a href="#" class="text-[10px] font-bold uppercase tracking-widest text-zinc-500 hover:text-white transition-colors">Privacy</a>
              <a href="#" class="text-[10px] font-bold uppercase tracking-widest text-zinc-500 hover:text-white transition-colors">Terms</a>
              <a href="#" class="text-[10px] font-bold uppercase tracking-widest text-zinc-500 hover:text-white transition-colors">Contact</a>
            </nav>
          </div>
        </div>

        <div class="text-left md:text-right flex flex-col md:items-end gap-3">
           <p class="text-[10px] font-black text-zinc-300 tracking-[0.4em] uppercase">© 2026 PREPUP CBT</p>
           <p class="text-[9px] font-bold text-zinc-600 tracking-[0.2em] uppercase max-w-[240px] md:text-right">
             BUILT FOR STUDENTS SCALING AFRICA. <br/> 
             ENGINEERED FOR SUPREME PERFORMANCE.
           </p>
        </div>
      </div>
      
      <!-- Bottom Accent Line -->
      <div class="mt-16 pt-8 border-t border-white/5 flex items-center justify-between">
        <div class="w-2 h-2 rounded-full bg-zinc-800"></div>
        <div class="text-[8px] font-mono text-zinc-700 tracking-[0.5em] uppercase">SECURE SESSION ACQUIRED</div>
        <div class="w-2 h-2 rounded-full bg-zinc-800"></div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import BrandLogo from '../BrandLogo.vue';
</script>

<style scoped>
.grid-pattern { 
  background-image: radial-gradient(circle at 1px 1px, white 1px, transparent 0); 
  background-size: 40px 40px; 
}
</style>
