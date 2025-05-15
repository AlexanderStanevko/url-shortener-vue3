<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../stores/auth';
import { useThemeStore } from '../../stores/theme';

const router = useRouter();
const authStore = useAuthStore();
const themeStore = useThemeStore();

const isMenuOpen = ref(false);

const isAuthenticated = computed(() => authStore.isAuthenticated);
const user = computed(() => authStore.user);

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

const closeMenu = () => {
  isMenuOpen.value = false;
};

const logout = () => {
  authStore.logout();
  router.push('/');
  closeMenu();
};
</script>

<template>
  <header class="bg-white dark:bg-neutral-800 shadow-sm sticky top-0 z-10">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <div class="flex">
          <div class="flex-shrink-0 flex items-center">
            <router-link to="/" class="flex items-center space-x-2">
              <span class="text-primary-600 dark:text-primary-400 text-2xl font-bold">Sho.rt</span>
            </router-link>
          </div>
          <nav class="hidden sm:ml-6 sm:flex sm:space-x-8">
            <router-link to="/" class="inline-flex items-center px-1 pt-1 text-sm font-medium border-b-2" :class="[
              $route.path === '/' 
                ? 'border-primary-500 text-neutral-900 dark:text-neutral-100' 
                : 'border-transparent text-neutral-500 hover:border-neutral-300 hover:text-neutral-700 dark:text-neutral-300 dark:hover:text-neutral-100'
            ]">
              Home
            </router-link>
            <router-link v-if="isAuthenticated" to="/dashboard" class="inline-flex items-center px-1 pt-1 text-sm font-medium border-b-2" :class="[
              $route.path === '/dashboard' 
                ? 'border-primary-500 text-neutral-900 dark:text-neutral-100' 
                : 'border-transparent text-neutral-500 hover:border-neutral-300 hover:text-neutral-700 dark:text-neutral-300 dark:hover:text-neutral-100'
            ]">
              Dashboard
            </router-link>
          </nav>
        </div>
        <div class="hidden sm:ml-6 sm:flex sm:items-center">
          <button @click="themeStore.toggleDarkMode" class="p-2 rounded-full text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary-500">
            <span v-if="themeStore.darkMode" class="sr-only">Switch to light mode</span>
            <svg v-if="themeStore.darkMode" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <span v-else class="sr-only">Switch to dark mode</span>
            <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          </button>
          
          <div v-if="isAuthenticated" class="ml-3 relative">
            <div>
              <button @click="toggleMenu" type="button" class="flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500" id="user-menu-button" aria-expanded="false" aria-haspopup="true">
                <span class="sr-only">Open user menu</span>
                <div class="h-8 w-8 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-sm font-medium uppercase text-primary-800 dark:text-primary-200">
                  {{ user?.name.charAt(0) }}
                </div>
              </button>
            </div>
            
            <transition
              enter-active-class="transition ease-out duration-100"
              enter-from-class="transform opacity-0 scale-95"
              enter-to-class="transform opacity-100 scale-100"
              leave-active-class="transition ease-in duration-75"
              leave-from-class="transform opacity-100 scale-100"
              leave-to-class="transform opacity-0 scale-95"
            >
              <div v-if="isMenuOpen" class="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white dark:bg-neutral-800 ring-1 ring-black ring-opacity-5 focus:outline-none" role="menu" aria-orientation="vertical" aria-labelledby="user-menu-button" tabindex="-1">
                <div class="px-4 py-2 text-sm text-neutral-700 dark:text-neutral-300 border-b border-neutral-200 dark:border-neutral-700">
                  <p class="font-medium">{{ user?.name }}</p>
                  <p class="text-xs opacity-75">{{ user?.email }}</p>
                </div>
                <router-link @click="closeMenu" to="/dashboard" class="block px-4 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700" role="menuitem" tabindex="-1" id="user-menu-item-0">Dashboard</router-link>
                <a @click="logout" href="#" class="block px-4 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700" role="menuitem" tabindex="-1" id="user-menu-item-2">Sign out</a>
              </div>
            </transition>
          </div>
          
          <div v-else class="ml-3 flex items-center space-x-2">
            <router-link to="/login" class="btn btn-outline py-1.5 text-sm">Log in</router-link>
            <router-link to="/register" class="btn btn-primary py-1.5 text-sm">Sign up</router-link>
          </div>
        </div>
        
        <div class="-mr-2 flex items-center sm:hidden">
          <button @click="toggleMenu" type="button" class="inline-flex items-center justify-center p-2 rounded-md text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:text-neutral-200 dark:hover:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500" aria-controls="mobile-menu" aria-expanded="false">
            <span class="sr-only">Open main menu</span>
            <svg v-if="!isMenuOpen" class="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <svg v-else class="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile menu -->
    <transition
      enter-active-class="transition ease-out duration-100"
      enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      <div v-if="isMenuOpen" class="sm:hidden" id="mobile-menu">
        <div class="pt-2 pb-3 space-y-1">
          <router-link @click="closeMenu" to="/" class="block pl-3 pr-4 py-2 border-l-4 text-base font-medium" :class="[
            $route.path === '/'
              ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
              : 'border-transparent text-neutral-600 hover:bg-neutral-50 hover:text-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700 dark:hover:text-neutral-100'
          ]">
            Home
          </router-link>
          <router-link v-if="isAuthenticated" @click="closeMenu" to="/dashboard" class="block pl-3 pr-4 py-2 border-l-4 text-base font-medium" :class="[
            $route.path === '/dashboard'
              ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
              : 'border-transparent text-neutral-600 hover:bg-neutral-50 hover:text-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700 dark:hover:text-neutral-100'
          ]">
            Dashboard
          </router-link>
        </div>
        
        <div class="pt-4 pb-3 border-t border-neutral-200 dark:border-neutral-700">
          <div v-if="isAuthenticated" class="space-y-1">
            <div class="px-4 py-2 flex items-center">
              <div class="flex-shrink-0">
                <div class="h-10 w-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-lg font-medium uppercase text-primary-800 dark:text-primary-200">
                  {{ user?.name.charAt(0) }}
                </div>
              </div>
              <div class="ml-3">
                <div class="text-base font-medium text-neutral-800 dark:text-neutral-200">{{ user?.name }}</div>
                <div class="text-sm font-medium text-neutral-500 dark:text-neutral-400">{{ user?.email }}</div>
              </div>
              <button @click="themeStore.toggleDarkMode" class="ml-auto flex-shrink-0 p-1 rounded-full text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary-500">
                <span v-if="themeStore.darkMode" class="sr-only">Switch to light mode</span>
                <svg v-if="themeStore.darkMode" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                <span v-else class="sr-only">Switch to dark mode</span>
                <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              </button>
            </div>
            <router-link @click="closeMenu" to="/dashboard" class="block px-4 py-2 text-base font-medium text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-700 dark:hover:text-neutral-100">Dashboard</router-link>
            <a @click="logout" href="#" class="block px-4 py-2 text-base font-medium text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-700 dark:hover:text-neutral-100">Sign out</a>
          </div>
          
          <div v-else class="px-4 py-3 space-y-2">
            <button @click="themeStore.toggleDarkMode" class="p-2 rounded-full text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary-500">
              <span v-if="themeStore.darkMode" class="sr-only">Switch to light mode</span>
              <svg v-if="themeStore.darkMode" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <span v-else class="sr-only">Switch to dark mode</span>
              <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            </button>
            <div class="flex flex-col space-y-2">
              <router-link @click="closeMenu" to="/login" class="w-full btn btn-outline py-2">Log in</router-link>
              <router-link @click="closeMenu" to="/register" class="w-full btn btn-primary py-2">Sign up</router-link>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </header>
</template>