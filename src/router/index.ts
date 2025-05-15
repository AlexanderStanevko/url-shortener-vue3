import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import Home from '../views/Home.vue';
import Login from '../views/Login.vue';
import Register from '../views/Register.vue';
import Dashboard from '../views/Dashboard.vue';
import Analytics from '../views/Analytics.vue';
import Redirect from '../views/Redirect.vue';
import NotFound from '../views/NotFound.vue';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: { title: 'Smart URL Shortener' }
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { title: 'Login - Smart URL Shortener', guest: true }
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta: { title: 'Register - Smart URL Shortener', guest: true }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: { title: 'Dashboard - Smart URL Shortener', requiresAuth: true }
  },
  {
    path: '/analytics/:id',
    name: 'Analytics',
    component: Analytics,
    meta: { title: 'Analytics - Smart URL Shortener', requiresAuth: true }
  },
  {
    path: '/link/:slug',
    name: 'Redirect',
    component: Redirect,
    meta: { title: 'Redirecting...' }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound,
    meta: { title: 'Page Not Found' }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(_, __, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  }
});

// Navigation guards
router.beforeEach((to, _, next) => {
  // Set document title
  document.title = to.meta.title as string || 'Smart URL Shortener';
  
  const authStore = useAuthStore();
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const guestOnly = to.matched.some(record => record.meta.guest);

  if (requiresAuth && !authStore.isAuthenticated) {
    next({ name: 'Login', query: { redirect: to.fullPath } });
  } else if (guestOnly && authStore.isAuthenticated) {
    next({ name: 'Dashboard' });
  } else {
    next();
  }
});

export default router;