<template>
  <div class="homepage-wrapper min-h-screen font-sans transition-colors duration-500 overflow-hidden relative">
    
    <!-- Background Decor (Gradient blobs) -->
    <div class="bg-shape shape-1"></div>
    <div class="bg-shape shape-2"></div>
    <div class="bg-shape shape-3"></div>
    
    <!-- Navbar -->
    <nav class="glass-nav sticky top-0 z-50 px-6 py-4 flex items-center justify-between transition-all duration-300">
      <div class="max-w-7xl mx-auto w-full flex items-center justify-between">
        <BrandLogo />
        <div class="flex items-center gap-6">
          <ThemeToggle />
          <router-link 
            to="/login"
            class="nav-link text-sm font-semibold tracking-wide transition-all"
          >
            Log in
          </router-link>
          <router-link 
            to="/register"
            class="premium-btn text-sm font-semibold"
          >
            <span class="btn-content">Sign up</span>
          </router-link>
        </div>
      </div>
    </nav>

    <main class="flex-grow flex flex-col items-center justify-center relative z-10 w-full max-w-7xl mx-auto px-6 py-16 lg:py-24">
      
      <!-- Hero Section -->
      <section class="hero-section grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full min-h-[60vh]">
        <div class="hero-content space-y-8 animate-slide-up">
          <div class="badge-wrapper inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase">
            <span class="pulse-dot"></span>
            Elevate Your Learning
          </div>
          
          <h1 class="hero-title text-5xl lg:text-[4.5rem] font-black tracking-tight leading-[1.05]">
            Master your studies. <br/>
            <span class="text-gradient">Without the stress.</span>
          </h1>
          
          <p class="hero-desc text-lg lg:text-xl max-w-lg leading-relaxed">
            Experience the future of education. PrepUp combines intelligent analytics, dynamic flashcards, and an elite assessment engine to transform how you learn.
          </p>

          <div class="hero-actions flex flex-col sm:flex-row items-center gap-5 pt-4">
            <router-link to="/register" class="glow-btn group w-full sm:w-auto">
              <span>Start For Free</span>
              <svg class="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path></svg>
            </router-link>
            <router-link to="/login" class="outline-btn w-full sm:w-auto">
              Sign in to Dashboard
            </router-link>
          </div>
        </div>
        
        <div class="hero-visual relative flex justify-center items-center animate-float">
          <div class="visual-glow"></div>
          <img src="/hero-abstract.png" alt="Abstract Learning Visual" class="w-full max-w-[500px] h-auto object-contain drop-shadow-2xl z-10" />
        </div>
      </section>

      <!-- Features Section -->
      <section class="features-grid mt-32 grid grid-cols-1 md:grid-cols-3 gap-8 w-full z-10">
        <!-- Feature 1 -->
        <div class="feature-card group" style="--delay: 0.1s">
          <div class="card-glow"></div>
          <div class="card-content">
            <div class="icon-box">
               <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path></svg>
            </div>
            <h3 class="text-2xl font-bold mb-4">Structured Validation</h3>
            <p class="leading-relaxed opacity-80">
              Rigorous, timed assessments designed to build confidence in any subject. Track long-term progression instantly.
            </p>
          </div>
        </div>

        <!-- Feature 2 -->
        <div class="feature-card group" style="--delay: 0.2s">
          <div class="card-glow"></div>
          <div class="card-content">
            <div class="icon-box">
              <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002 2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
            </div>
            <h3 class="text-2xl font-bold mb-4">Interactive Retention</h3>
            <p class="leading-relaxed opacity-80">
              High-fidelity 3D flashcards crafted to enhance active recall and spatial memory before your major exams.
            </p>
          </div>
        </div>

        <!-- Feature 3 -->
        <div class="feature-card group" style="--delay: 0.3s">
          <div class="card-glow"></div>
          <div class="card-content">
            <div class="icon-box">
              <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
            </div>
            <h3 class="text-2xl font-bold mb-4">Actionable Analytics</h3>
            <p class="leading-relaxed opacity-80">
              Insightful data visualizations that pinpoint your weaknesses, allowing for laser-focused study optimization.
            </p>
          </div>
        </div>
      </section>
    </main>
    
    <AppFooter class="relative z-10 border-t border-zinc-200 dark:border-white/10" />
  </div>
</template>

<script setup>
import BrandLogo from '../components/BrandLogo.vue';
import ThemeToggle from '../components/ThemeToggle.vue';
import AppFooter from '../components/AppFooter.vue';
</script>

<style scoped>
/* MONOCHROMATIC PREMIUM — Neutral zinc palette only */

.homepage-wrapper {
  --bg-color: #ffffff;
  --text-primary: #0f172a;
  --text-secondary: #64748b;
  --nav-bg: rgba(255, 255, 255, 0.75);
  --border-color: rgba(0, 0, 0, 0.07);
  --blob-color: rgba(0, 0, 0, 0.04);
  --card-bg: rgba(255, 255, 255, 0.7);
  --card-border: rgba(0, 0, 0, 0.06);
  --glow-color: rgba(0, 0, 0, 0.06);
  --btn-glow: 0 8px 20px -4px rgba(0, 0, 0, 0.2);

  background-color: var(--bg-color);
  color: var(--text-primary);
}

</style>

<style>
html.dark .homepage-wrapper {
  --bg-color: #0a0a0a;
  --text-primary: #f8fafc;
  --text-secondary: #94a3b8;
  --nav-bg: rgba(10, 10, 10, 0.75);
  --border-color: rgba(255, 255, 255, 0.07);
  --blob-color: rgba(255, 255, 255, 0.025);
  --card-bg: rgba(255, 255, 255, 0.03);
  --card-border: rgba(255, 255, 255, 0.06);
  --glow-color: rgba(255, 255, 255, 0.04);
  --btn-glow: 0 8px 25px -4px rgba(0, 0, 0, 0.5);
}
</style>

<style scoped>

/* Background shapes — very subtle, no color */
.bg-shape {
  position: absolute;
  filter: blur(120px);
  border-radius: 50%;
  z-index: 0;
  pointer-events: none;
  animation: blob-float 25s infinite alternate ease-in-out;
}
.shape-1 {
  top: -10%; left: -5%;
  width: 45vw; height: 45vw;
  background: var(--blob-color);
}
.shape-2 {
  bottom: 5%; right: -8%;
  width: 35vw; height: 35vw;
  background: var(--blob-color);
  animation-delay: -8s;
}

/* Navbar */
.glass-nav {
  background: var(--nav-bg);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-bottom: 1px solid var(--border-color);
}
.nav-link { color: var(--text-secondary); }
.nav-link:hover { color: var(--text-primary); }

/* Buttons — black/white only */
.premium-btn {
  border-radius: 10px;
  background: var(--text-primary);
  color: var(--bg-color);
  padding: 0.5rem 1.25rem;
  transition: all 0.2s ease;
}
.premium-btn:hover {
  transform: translateY(-1px);
  box-shadow: var(--btn-glow);
}

.glow-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: var(--text-primary);
  color: var(--bg-color);
  padding: 1rem 2rem;
  border-radius: 14px;
  font-weight: 700;
  box-shadow: var(--btn-glow);
  transition: all 0.25s ease;
}
.glow-btn:hover {
  transform: translateY(-2px);
  opacity: 0.85;
}

.outline-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  color: var(--text-primary);
  border: 1px solid var(--border-color);
  padding: 1rem 2rem;
  border-radius: 14px;
  font-weight: 600;
  transition: all 0.25s ease;
}
.outline-btn:hover {
  background: var(--card-bg);
  border-color: var(--text-secondary);
  transform: translateY(-2px);
}

/* Badge */
.badge-wrapper {
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  backdrop-filter: blur(8px);
  color: var(--text-secondary);
}
.pulse-dot {
  width: 7px; height: 7px;
  background-color: var(--text-primary);
  border-radius: 50%;
  opacity: 0.5;
  animation: pulse 2.5s infinite;
}

/* Hero text — no gradient, just muted */
.text-gradient { color: var(--text-secondary); }
.hero-desc { color: var(--text-secondary); }

/* Feature Cards */
.feature-card {
  position: relative;
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  border-radius: 24px;
  padding: 2.5rem;
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  transition: all 0.35s cubic-bezier(0.25, 0.8, 0.25, 1);
  overflow: hidden;
  animation: slide-up 0.8s forwards;
  opacity: 0;
  transform: translateY(30px);
  animation-delay: var(--delay);
}
.feature-card:hover {
  transform: translateY(-6px);
  border-color: var(--text-secondary);
  box-shadow: 0 20px 40px -12px var(--glow-color);
}
.card-content { position: relative; z-index: 10; }
.icon-box {
  width: 52px; height: 52px;
  background: var(--bg-color);
  border: 1px solid var(--border-color);
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
  color: var(--text-primary);
  transition: all 0.3s ease;
}
.feature-card:hover .icon-box {
  background: var(--text-primary);
  color: var(--bg-color);
  border-color: transparent;
  transform: scale(1.05) rotate(-4deg);
}
.card-glow {
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
  background: radial-gradient(circle at 50% 0%, var(--glow-color) 0%, transparent 60%);
  opacity: 0;
  transition: opacity 0.4s;
}
.feature-card:hover .card-glow { opacity: 1; }

/* Animations */
.animate-slide-up { animation: slide-up 1s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
.animate-float { animation: float 6s ease-in-out infinite; }

@keyframes slide-up {
  from { opacity: 0; transform: translateY(40px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes blob-float {
  0%   { transform: translate(0, 0) scale(1); }
  50%  { transform: translate(20px, -30px) scale(1.04); }
  100% { transform: translate(0, 0) scale(1); }
}
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50%       { transform: translateY(-16px); }
}
@keyframes pulse {
  0%, 100% { opacity: 0.5; }
  50%       { opacity: 1; }
}

.visual-glow {
  position: absolute;
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  width: 280px; height: 280px;
  background: var(--blob-color);
  filter: blur(70px);
  border-radius: 50%;
  z-index: 0;
}
</style>
