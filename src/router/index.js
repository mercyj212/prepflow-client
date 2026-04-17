import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../store/auth';

import HomeView from '../views/HomeView.vue';
import DashboardView from '../views/DashboardView.vue';
import QuizView from '../views/QuizView.vue';
import ResultView from '../views/ResultView.vue';
import LoginView from '../views/LoginView.vue';
import RegisterView from '../views/RegisterView.vue';
import AdminLayout from '../components/layout/AdminLayout.vue';
import AdminOverview from '../views/admin/AdminOverview.vue';
import AdminInventory from '../views/admin/AdminInventory.vue';
import AdminHierarchy from '../views/admin/AdminHierarchy.vue';
import AdminStudents from '../views/admin/AdminStudents.vue';
import FlashcardView from '../views/FlashcardView.vue';
import PracticeView from '../views/PracticeView.vue';
import VerifyEmailView from '../views/VerifyEmailView.vue';
import ForgotPasswordView from '../views/ForgotPasswordView.vue';
import ResetPasswordView from '../views/ResetPasswordView.vue';
import HelpCenterView from '../views/HelpCenterView.vue';
import SubjectSelectorView from '../views/SubjectSelectorView.vue';
import NotFoundView from '../views/NotFoundView.vue';
import MockExamView from '../views/MockExamView.vue';
import ProgressView from '../views/ProgressView.vue';
import FlashcardLandingView from '../views/FlashcardLandingView.vue';
import PracticeLandingView from '../views/PracticeLandingView.vue';
import SettingsView from '../views/SettingsView.vue';
import ChatView from '../views/ChatView.vue';
import GamesView from '../views/GamesView.vue';
import EducationPathSelectorView from '../views/EducationPathSelectorView.vue';
import DepartmentHubView from '../views/DepartmentHubView.vue';
import DepartmentListView from '../views/DepartmentListView.vue';

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
    path: '/practice',
    name: 'practice-landing',
    component: PracticeLandingView,
    meta: { requiresAuth: true }
  },
  {
    path: '/practice/:id',
    name: 'practice',
    component: PracticeView,
    meta: { requiresAuth: true }
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
    path: '/flashcards',
    name: 'flashcards-landing',
    component: FlashcardLandingView,
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
    path: '/mock-exam',
    name: 'mock-exam',
    component: MockExamView,
    meta: { requiresAuth: true }
  },
  {
    path: '/progress',
    name: 'progress',
    component: ProgressView,
    meta: { requiresAuth: true }
  },

  {
    path: '/admin',
    component: AdminLayout,
    meta: { requiresAuth: true, requiresAdmin: true },
    children: [
      { path: '', name: 'admin-overview', component: AdminOverview },
      { path: 'inventory', name: 'admin-inventory', component: AdminInventory },
      { path: 'hierarchy', name: 'admin-hierarchy', component: AdminHierarchy },
      { path: 'students', name: 'admin-students', component: AdminStudents }
    ]
  },
  {
    path: '/help',
    name: 'helpCenter',
    component: HelpCenterView,
    meta: { requiresAuth: false }
  },
  {
    path: '/subjects',
    name: 'education-path',
    component: EducationPathSelectorView,
    meta: { requiresAuth: true }
  },
  {
    path: '/subjects/:path',
    name: 'faculty-list',
    component: DepartmentHubView,
    meta: { requiresAuth: true }
  },
  {
    path: '/subjects/:path/:facultyId',
    name: 'department-list',
    component: DepartmentListView,
    meta: { requiresAuth: true }
  },
  {
    path: '/subjects/:path/:facultyId/:departmentId',
    name: 'subjects',
    component: SubjectSelectorView,
    meta: { requiresAuth: true }
  },
  {
    path: '/settings',
    name: 'settings',
    component: SettingsView,
    meta: { requiresAuth: true }
  },
  {
    path: '/chat',
    name: 'chat',
    component: ChatView,
    meta: { requiresAuth: true }
  },
  {
    path: '/games',
    name: 'games',
    component: GamesView,
    meta: { requiresAuth: true }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: NotFoundView,
    meta: { requiresAuth: false }
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

  if (to.meta.requiresAdmin && authStore.user?.role !== 'admin') {
    return '/dashboard';
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
