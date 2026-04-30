<template>
  <main class="not-found-page">
    <header class="page-nav">
      <BrandLogo size="md" theme="dark" />
      <router-link :to="primaryRoute" class="login-link">
        {{ primaryLabel }}
      </router-link>
    </header>

    <section class="hero-wrap" aria-labelledby="not-found-title">
      <div class="cloud cloud-one"></div>
      <div class="cloud cloud-two"></div>
      <div class="cloud cloud-three"></div>

      <div class="number-wrap" aria-hidden="true">
        <span>4</span>
        <span>0</span>
        <span>4</span>
      </div>

      <div class="mascot-frame" aria-hidden="true">
        <img src="/images/not-found-mascot-cutout.png" alt="" class="mascot-image">
      </div>

      <div class="copy">
        <h1 id="not-found-title">Oops, I think we're lost</h1>
        <p>Let's get you back somewhere familiar.</p>

        <router-link to="/" class="home-button">
          <CircleArrowLeft :size="17" />
          Back to home
        </router-link>
      </div>
    </section>
  </main>
</template>

<script setup>
import { computed } from 'vue';
import { CircleArrowLeft } from 'lucide-vue-next';
import BrandLogo from '../components/BrandLogo.vue';
import { useAuthStore } from '../store/auth';

const authStore = useAuthStore();

const primaryRoute = computed(() => (authStore.isAuthenticated ? '/dashboard' : '/login'));
const primaryLabel = computed(() => (authStore.isAuthenticated ? 'Dashboard' : 'Log In'));
</script>

<style scoped>
.not-found-page {
  min-height: 100vh;
  overflow: hidden;
  position: relative;
  color: #18181b;
  background:
    linear-gradient(180deg, #d4d4d8 0%, #e4e4e7 48%, #f4f4f5 100%);
}

.page-nav {
  position: relative;
  z-index: 20;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 22px clamp(20px, 5vw, 48px);
}

.login-link {
  min-width: 92px;
  height: 44px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(24, 24, 27, 0.12);
  border-radius: 14px;
  background: #18181b;
  color: #ffffff;
  font-size: 11px;
  font-weight: 950;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  text-decoration: none;
  box-shadow: 0 16px 34px rgba(24, 24, 27, 0.16);
  transition: transform 180ms ease, box-shadow 180ms ease, background 180ms ease;
}

.login-link:hover {
  transform: translateY(-2px);
  background: #27272a;
  box-shadow: 0 20px 42px rgba(24, 24, 27, 0.22);
}

.hero-wrap {
  position: relative;
  z-index: 1;
  min-height: calc(100vh - 86px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0 20px 54px;
  text-align: center;
}

.number-wrap {
  position: absolute;
  top: clamp(34px, 6vw, 60px);
  left: 50%;
  transform: translateX(-50%);
  width: min(96vw, 1120px);
  display: grid;
  grid-template-columns: 1fr 0.9fr 1fr;
  align-items: center;
  gap: clamp(8px, 3vw, 26px);
  color: rgba(255, 255, 255, 0.72);
  font-size: clamp(9rem, 26vw, 22rem);
  font-weight: 950;
  line-height: 0.78;
  letter-spacing: -0.05em;
  user-select: none;
}

.number-wrap span {
  text-shadow: 0 28px 60px rgba(63, 63, 70, 0.12);
}

.mascot-frame {
  position: relative;
  z-index: 5;
  width: clamp(170px, 23vw, 280px);
  margin-top: clamp(8px, 5vw, 54px);
  filter: drop-shadow(0 28px 32px rgba(63, 63, 70, 0.2));
}

.mascot-image {
  width: 100%;
  height: auto;
  display: block;
}

.copy {
  position: relative;
  z-index: 8;
  margin-top: clamp(18px, 3vw, 28px);
}

.copy h1 {
  max-width: 760px;
  margin: 0 auto;
  color: #172033;
  font-size: clamp(2.15rem, 5vw, 4.45rem);
  font-weight: 950;
  line-height: 1.02;
  letter-spacing: 0;
}

.copy p {
  margin-top: 10px;
  color: rgba(23, 32, 51, 0.55);
  font-size: clamp(0.9rem, 2vw, 1.05rem);
  font-weight: 700;
}

.home-button {
  margin-top: 34px;
  height: 52px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  border: 1px solid rgba(23, 32, 51, 0.16);
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.92);
  padding: 0 22px;
  color: #172033;
  font-size: 13px;
  font-weight: 950;
  text-decoration: none;
  box-shadow: 0 18px 36px rgba(64, 96, 122, 0.16);
  transition: transform 180ms ease, box-shadow 180ms ease, background 180ms ease;
}

.home-button:hover {
  transform: translateY(-2px);
  background: #ffffff;
  box-shadow: 0 22px 42px rgba(64, 96, 122, 0.2);
}

.cloud {
  position: absolute;
  z-index: 0;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.46);
  filter: blur(2px);
}

.cloud::before,
.cloud::after {
  content: "";
  position: absolute;
  border-radius: 50%;
  background: inherit;
}

.cloud-one {
  width: 270px;
  height: 68px;
  left: -36px;
  top: 28%;
}

.cloud-one::before {
  width: 110px;
  height: 110px;
  left: 46px;
  bottom: 0;
}

.cloud-one::after {
  width: 142px;
  height: 142px;
  right: 28px;
  bottom: -8px;
}

.cloud-two {
  width: 360px;
  height: 84px;
  right: -90px;
  top: 31%;
  opacity: 0.7;
}

.cloud-two::before {
  width: 150px;
  height: 150px;
  left: 60px;
  bottom: -6px;
}

.cloud-two::after {
  width: 118px;
  height: 118px;
  right: 72px;
  bottom: 0;
}

.cloud-three {
  width: 280px;
  height: 72px;
  left: 50%;
  bottom: 22%;
  opacity: 0.28;
  transform: translateX(-50%);
}

.cloud-three::before {
  width: 104px;
  height: 104px;
  left: 48px;
  bottom: 0;
}

.cloud-three::after {
  width: 126px;
  height: 126px;
  right: 34px;
  bottom: -8px;
}

@media (max-width: 760px) {
  .page-nav {
    padding: 18px 18px 0;
  }

  .hero-wrap {
    justify-content: flex-start;
    padding-top: 72px;
  }

  .number-wrap {
    top: 90px;
    font-size: clamp(7rem, 32vw, 12rem);
  }

  .mascot-frame {
    margin-top: 10px;
  }

  .cloud-one {
    left: -120px;
    top: 27%;
  }

  .cloud-two {
    right: -170px;
    top: 30%;
  }

  .copy {
    margin-top: 12px;
  }
}
</style>
