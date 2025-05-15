<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import ShortenerForm from '../components/url/ShortenerForm.vue';

const router = useRouter();
const authStore = useAuthStore();

const isAuthenticated = computed(() => authStore.isAuthenticated);

const redirectToDashboard = () => {
  router.push('/dashboard');
};
</script>

<template>
  <div class="flex flex-col min-h-[calc(100vh-4rem)]">
    <!-- Hero Section -->
    <section class="py-12 md:py-20 bg-gradient-to-br from-primary-500 to-primary-700 dark:from-primary-700 dark:to-primary-900 text-white">
      <div class="container mx-auto px-4">
        <div class="max-w-4xl mx-auto text-center">
          <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            Shorten, Share, Track
          </h1>
          <p class="text-xl md:text-2xl mb-8 text-white/80">
            Create shortened URLs that are easy to share and track with our powerful analytics.
          </p>
          
          <div v-if="isAuthenticated" class="mt-8">
            <button @click="redirectToDashboard" class="btn px-6 py-3 bg-white text-primary-700 hover:bg-neutral-100">
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    </section>
    
    <!-- Shortener Section -->
    <section class="py-12 -mt-8">
      <div class="container mx-auto px-4">
        <ShortenerForm />
      </div>
    </section>
    
    <!-- Features Section -->
    <section class="py-12 bg-neutral-50 dark:bg-neutral-800/30">
      <div class="container mx-auto px-4">
        <h2 class="text-3xl font-bold text-center mb-12">
          Powerful Features
        </h2>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="bg-white dark:bg-neutral-800 p-6 rounded-lg shadow-md">
            <div class="w-12 h-12 bg-primary-100 dark:bg-primary-900/50 rounded-lg text-primary-600 dark:text-primary-400 flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold mb-2">URL Shortening</h3>
            <p class="text-neutral-600 dark:text-neutral-400">
              Create short, memorable links that redirect to your long URLs. Custom slugs available for registered users.
            </p>
          </div>
          
          <div class="bg-white dark:bg-neutral-800 p-6 rounded-lg shadow-md">
            <div class="w-12 h-12 bg-primary-100 dark:bg-primary-900/50 rounded-lg text-primary-600 dark:text-primary-400 flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold mb-2">Click Analytics</h3>
            <p class="text-neutral-600 dark:text-neutral-400">
              Track and analyze every click with detailed statistics. See when, where, and how users interact with your links.
            </p>
          </div>
          
          <div class="bg-white dark:bg-neutral-800 p-6 rounded-lg shadow-md">
            <div class="w-12 h-12 bg-primary-100 dark:bg-primary-900/50 rounded-lg text-primary-600 dark:text-primary-400 flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold mb-2">Link Management</h3>
            <p class="text-neutral-600 dark:text-neutral-400">
              Organize and manage all your shortened links from one dashboard. Edit, delete, and track performance easily.
            </p>
          </div>
        </div>
      </div>
    </section>
    
    <!-- CTA Section -->
    <section class="py-12 md:py-20 bg-primary-500 dark:bg-primary-700 text-white">
      <div class="container mx-auto px-4 text-center">
        <h2 class="text-3xl md:text-4xl font-bold mb-4">
          Ready to get started?
        </h2>
        <p class="text-xl mb-8 text-white/80">
          Sign up for free and start shortening your URLs with advanced analytics.
        </p>
        <div class="flex flex-wrap justify-center gap-4">
          <router-link to="/register" class="btn px-6 py-3 bg-white text-primary-700 hover:bg-neutral-100">
            Sign up for free
          </router-link>
          <router-link to="/login" class="btn px-6 py-3 border-2 border-white text-white hover:bg-white/10">
            Log in
          </router-link>
        </div>
      </div>
    </section>
  </div>
</template>