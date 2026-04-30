import './style.css';

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import { useAuthStore } from './store/auth';
import { warmUpApi } from './api/axios';

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);

window.addEventListener('prepflow:session-expired', () => {
  const authStore = useAuthStore();
  authStore.user = null;
  if (router.currentRoute.value.meta.requiresAuth) {
    router.replace('/login');
  }
});

warmUpApi();

app.mount('#app');
