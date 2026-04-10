<template>
  <div class="min-h-screen bg-[#050916] text-white font-['Manrope']">
    <section
      class="relative min-h-[92vh] overflow-hidden border-b border-white/10"
      style="background-image: url('/prepup%20mockup.jpg'); background-size: cover; background-position: center;"
    >
      <div class="absolute inset-0 bg-[linear-gradient(180deg,rgba(4,8,20,0.58),rgba(4,8,20,0.84))]"></div>
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(63,124,255,0.22),transparent_35%),radial-gradient(circle_at_85%_15%,rgba(147,51,234,0.16),transparent_30%)]"></div>

      <nav class="relative z-20 bg-transparent">
        <div class="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
        <div class="font-sans">
          <BrandLogo />
        </div>
        <div class="hidden md:flex items-center gap-7 text-[14px] font-bold text-white/85">
          <a href="#" class="text-white border-b border-[#1a3c8f] pb-1">Home</a>
          <a href="#features" class="hover:text-white">Features</a>
          <a href="#stats" class="hover:text-white">Results</a>
          <a href="#contact" class="hover:text-white">Contact</a>
        </div>
        <div class="flex items-center gap-3">
          <router-link to="/login" class="hidden sm:block text-[14px] font-semibold text-white/90 hover:text-white transition px-4 py-2">
            Log in
          </router-link>
          <router-link to="/register" class="text-[14px] font-semibold text-slate-900 bg-white border border-white px-4 py-2 rounded-lg hover:bg-slate-100 transition shadow-lg shadow-white/5">
            Get started
          </router-link>
        </div>
      </div>
      </nav>

      <div class="relative z-20 max-w-6xl mx-auto px-4 sm:px-6 pt-12 sm:pt-20 pb-16">
        <div class="text-center max-w-3xl mx-auto">
          <h1 class="mt-3 text-[42px] sm:text-[66px] leading-[0.96] font-bold tracking-tight">
            Pass Your Exams Smarter
          </h1>
          <p class="mt-4 text-[18px] font-medium text-white/85">
            Practice real CBT questions, track your progress, and boost your confidence
          </p>
          <div class="mt-7 flex flex-col sm:flex-row justify-center gap-3">
            <router-link to="/register" class="px-5 py-3 rounded-xl bg-white border border-white text-slate-900 text-[15px] font-semibold shadow-[0_8px_24px_rgba(255,255,255,0.14)] hover:bg-slate-100 hover:-translate-y-0.5 transition">
              Start Practicing
            </router-link>
            <router-link to="/practice/sample" class="px-5 py-3 rounded-xl bg-zinc-800/85 backdrop-blur border border-zinc-500/40 text-zinc-100 text-[15px] font-semibold hover:bg-zinc-700/85 transition">
              Try Free Quiz
            </router-link>
          </div>
        </div>

        <div class="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <article class="glass-card p-4 animate-float-slow">
            <p class="text-[13px] text-white/70">Average score lift</p>
            <p class="mt-1 text-[30px] leading-none font-bold">+28%</p>
          </article>
          <article class="glass-card p-4 sm:translate-y-6 animate-float-mid">
            <p class="text-[13px] text-white/70">Questions practiced</p>
            <p class="mt-1 text-[30px] leading-none font-bold">120k+</p>
          </article>
          <article class="glass-card p-4 animate-float-fast">
            <p class="text-[13px] text-white/70">Daily active learners</p>
            <p class="mt-1 text-[30px] leading-none font-bold">4,500+</p>
          </article>
        </div>
      </div>
    </section>

    <main class="bg-black border-t border-white/10">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      <section id="features" class="grid grid-cols-1 md:grid-cols-3 gap-5 rounded-2xl p-4 sm:p-5">
        <article class="feature-card group">
          <div class="icon-chip">01</div>
          <p class="mt-4 text-[18px] font-semibold">Real CBT simulation</p>
          <p class="mt-2 text-[14px] text-white/70 font-normal">Practice under real timing and exam pressure with structured question flows.</p>
        </article>
        <article class="feature-card group">
          <div class="icon-chip">02</div>
          <p class="mt-4 text-[18px] font-semibold">Insightful progress tracking</p>
          <p class="mt-2 text-[14px] text-white/70 font-normal">See weak topics quickly and focus effort where it gives the highest score impact.</p>
        </article>
        <article class="feature-card group">
          <div class="icon-chip">03</div>
          <p class="mt-4 text-[18px] font-semibold">Study and revise faster</p>
          <p class="mt-2 text-[14px] text-white/70 font-normal">Switch to study cards between tests to lock in understanding and improve recall.</p>
        </article>
      </section>

      <section id="stats" class="mt-8 glass-card p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div class="grid grid-cols-3 gap-6 text-center w-full sm:w-auto">
          <div>
            <p class="text-[30px] leading-none font-bold">500+</p>
            <p class="text-[12px] text-white/70 mt-1">Practice sets</p>
          </div>
          <div>
            <p class="text-[30px] leading-none font-bold">98%</p>
            <p class="text-[12px] text-white/70 mt-1">Satisfaction</p>
          </div>
          <div>
            <p class="text-[30px] leading-none font-bold">24/7</p>
            <p class="text-[12px] text-white/70 mt-1">Support</p>
          </div>
        </div>
        <router-link to="/register" class="text-[14px] font-semibold rounded-lg px-5 py-2.5 bg-white border border-white text-slate-900 shadow-[0_8px_24px_rgba(255,255,255,0.14)] hover:bg-slate-100 hover:-translate-y-0.5 transition">
          Get started free
        </router-link>
      </section>

      <section id="contact" class="mt-10 text-center">
        <p class="text-[14px] font-normal text-white/70">Modern • Fast • Secure • Cinematic</p>
        <div class="mt-4 flex flex-col sm:flex-row justify-center gap-3">
          <router-link to="/login" class="px-4 py-2 rounded-lg border border-white/20 text-[14px] font-semibold text-white/90 hover:border-white/35 transition">
            Log in
          </router-link>
          <router-link to="/register" class="px-4 py-2 rounded-lg border border-white bg-white text-[14px] font-semibold text-slate-900 hover:bg-slate-100 transition">
            Create account
          </router-link>
        </div>
      </section>
      </div>
    </main>

    <footer class="bg-black border-t border-white/5 py-10 text-center text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-600">
      © 2026 PrepUp CBT • Excellence in Practice
    </footer>
  </div>
</template>

<script setup>
import BrandLogo from '../components/BrandLogo.vue';
</script>

<style scoped>
.glass-card {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.12), rgba(255, 255, 255, 0.06));
  border: 1px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(12px);
  border-radius: 16px;
  box-shadow: 0 16px 40px rgba(10, 20, 50, 0.35);
}

.feature-card {
  border-radius: 16px;
  border: none;
  background: linear-gradient(135deg, rgba(115, 115, 115, 0.22), rgba(55, 55, 55, 0.18));
  backdrop-filter: blur(10px);
  padding: 20px;
  transition: transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.08), 0 10px 28px rgba(0, 0, 0, 0.32);
}

.feature-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 14px 34px rgba(0, 0, 0, 0.35);
}

.icon-chip {
  width: 34px;
  height: 34px;
  border-radius: 10px;
  display: grid;
  place-items: center;
  font-size: 12px;
  font-weight: 500;
  border: 1px solid rgba(133, 171, 255, 0.55);
  background: rgba(63, 124, 255, 0.2);
  color: #d8e5ff;
}

.animate-float-slow {
  animation: floatSlow 6s ease-in-out infinite;
}

.animate-float-mid {
  animation: floatMid 5.5s ease-in-out infinite;
}

.animate-float-fast {
  animation: floatFast 5s ease-in-out infinite;
}

@keyframes floatSlow {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-6px); }
}

@keyframes floatMid {
  0%, 100% { transform: translateY(4px); }
  50% { transform: translateY(-5px); }
}

@keyframes floatFast {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-8px); }
}
</style>
