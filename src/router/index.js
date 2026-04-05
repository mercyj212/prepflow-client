import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../store/auth';

import HomeView from '../views/HomeView.vue';
import DashboardView from '../views/DashboardView.vue';
import QuizView from '../views/QuizView.vue';
import ResultView from '../views/ResultView.vue';
import LoginView from '../views/LoginView.vue';
import RegisterView from '../views/RegisterView.vue';
import AdminDashboardView from '../views/AdminDashboardView.vue';
import FlashcardView from '../views/FlashcardView.vue';
import PracticeView from '../views/PracticeView.vue';
import VerifyEmailView from '../views/VerifyEmailView.vue';
import ForgotPasswordView from '../views/ForgotPasswordView.vue';
import ResetPasswordView from '../views/ResetPasswordView.vue';

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: { requiresAuth: false }
  },
  {
    path: '/verify-email/:token',
    name: 'verify-email',
    component: VerifyEmailView,
    meta: { requiresAuth: false }
  },
  {
    path: '/forgot-password',
    name: 'forgot-password',
    component: ForgotPasswordView,
    meta: { requiresAuth: false }
  },
  {
    path: '/reset-password/:token',
    name: 'reset-password',
    component: ResetPasswordView,
    meta: { requiresAuth: false }
  },
  {
    path: '/practice/:id',
    name: 'practice',
    component: PracticeView,
    meta: { requiresAuth: false }
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView,
  },
  {
    path: '/register',
    name: 'register',
    component: RegisterView,
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: DashboardView,
    meta: { requiresAuth: true }
  },
  {
    path: '/quiz/:id',
    name: 'quiz',
    component: QuizView,
    meta: { requiresAuth: true }
  },
  {
    path: '/flashcards/:id',
    name: 'flashcards',
    component: FlashcardView,
    meta: { requiresAuth: true }
  },
  {
    path: '/result',
    name: 'result',
    component: ResultView,
    meta: { requiresAuth: true }
  },
  {
    path: '/admin',
    name: 'admin',
    component: AdminDashboardView,
    meta: { requiresAuth: true }
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

// Navigation guard
router.beforeEach((to, from) => {
  const authStore = useAuthStore();
  
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return '/login';
  }
  
  if ((to.path === '/login' || to.path === '/register') && authStore.isAuthenticated) {
    if (authStore.user && authStore.user.role === 'admin') {
      return '/admin';
    } else {
      return '/dashboard';
    }
  }
  
  return true; // proceed
});

export default router;