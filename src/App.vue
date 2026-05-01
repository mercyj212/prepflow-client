<template>
  <div class="app-container">
    <router-view />
    <CookieConsent />
  </div>
</template>

<script setup>
import CookieConsent from './components/CookieConsent.vue';
</script>

<style>
.app-container {
  min-height: 100vh;
}
</style>
