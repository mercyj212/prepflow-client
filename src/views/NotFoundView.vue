<template>
  <main class="not-found-page">
    <header class="page-nav">
      <BrandLogo size="md" theme="light" />
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
        <img src="/not-found-character.png" alt="" class="mascot-image">
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
  height: 100vh;
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
  height: 78px;
  padding: 16px clamp(20px, 5vw, 48px);
}

.login-link {
  min-width: 132px;
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
  transition: transform 180ms ease, box-shadow 180ms ease, background 180ms ease, color 180ms ease, border-color 180ms ease;
}

.login-link:hover {
  transform: translateY(-2px);
  border-color: #18181b;
  background: #ffffff;
  color: #18181b;
  box-shadow: 0 20px 42px rgba(24, 24, 27, 0.18);
}

.hero-wrap {
  position: relative;
  z-index: 1;
  height: calc(100vh - 78px);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0 20px clamp(18px, 4vh, 34px);
  text-align: center;
}

.number-wrap {
  position: absolute;
  top: clamp(10px, 3vh, 30px);
  left: 50%;
  transform: translateX(-50%);
  width: min(96vw, 1120px);
  display: grid;
  grid-template-columns: 1fr 0.9fr 1fr;
  align-items: center;
  gap: clamp(8px, 3vw, 26px);
  color: rgba(255, 255, 255, 0.72);
  font-size: clamp(7rem, 22vw, 18rem);
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
  width: clamp(140px, 19vw, 230px);
  max-height: 40vh;
  margin-top: clamp(0px, 2vh, 18px);
  filter: drop-shadow(0 28px 32px rgba(63, 63, 70, 0.2));
}

.mascot-image {
  width: 100%;
  max-height: 40vh;
  height: auto;
  display: block;
  object-fit: contain;
}

.copy {
  position: relative;
  z-index: 8;
  margin-top: clamp(8px, 2vh, 18px);
}

.copy h1 {
  max-width: 760px;
  margin: 0 auto;
  color: #172033;
  font-size: clamp(1.85rem, 4vw, 3.55rem);
  font-weight: 950;
  line-height: 1.02;
  letter-spacing: 0;
}

.copy p {
  margin-top: 8px;
  color: rgba(23, 32, 51, 0.55);
  font-size: clamp(0.9rem, 2vw, 1.05rem);
  font-weight: 700;
}

.home-button {
  margin-top: clamp(16px, 3vh, 26px);
  height: 48px;
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
    height: 68px;
    padding: 12px 18px;
  }

  .hero-wrap {
    height: calc(100vh - 68px);
    justify-content: center;
    padding: 0 16px 20px;
  }

  .number-wrap {
    top: 14px;
    font-size: clamp(5.8rem, 29vw, 9rem);
  }

  .mascot-frame {
    width: clamp(118px, 39vw, 170px);
    max-height: 34vh;
    margin-top: 0;
  }

  .mascot-image {
    max-height: 34vh;
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
    margin-top: 8px;
  }

  .copy h1 {
    font-size: clamp(1.6rem, 8vw, 2.4rem);
  }

  .copy p {
    margin-top: 6px;
  }

  .home-button {
    margin-top: 16px;
    height: 44px;
  }
}
</style>
