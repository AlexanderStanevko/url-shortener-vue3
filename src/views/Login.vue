<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

const email = ref('');
const password = ref('');
const rememberMe = ref(false);
const isLoading = ref(false);
const error = ref('');

const redirectPath = computed(() => route.query.redirect as string || '/dashboard');

const login = async () => {
  if (!email.value || !password.value) {
    error.value = 'Please enter both email and password';
    return;
  }
  
  isLoading.value = true;
  error.value = '';
  
  try {
    const success = await authStore.login(email.value, password.value);
    
    if (success) {
      router.push(redirectPath.value);
    } else {
      error.value = authStore.error || 'Invalid email or password';
    }
  } catch (e) {
    console.error('Login error:', e);
    error.value = 'An unexpected error occurred';
  } finally {
    isLoading.value = false;
  }
};

const fillDemoCredentials = () => {
  email.value = 'demo@example.com';
  password.value = 'password123';
};
</script>

<template>
  <div class="flex justify-center py-12">
    <div class="w-full max-w-md">
      <div class="card bg-white dark:bg-neutral-800 shadow-md rounded-lg p-8">
        <div class="text-center mb-6">
          <h1 class="text-2xl font-bold text-neutral-900 dark:text-neutral-100">Log in to your account</h1>
          <p class="mt-2 text-neutral-600 dark:text-neutral-400">
            Welcome back! Please enter your credentials.
          </p>
        </div>
        
        <div v-if="error" class="mb-4 p-3 bg-error-100 text-error-700 dark:bg-error-900/30 dark:text-error-400 rounded-md text-sm">
          {{ error }}
        </div>
        
        <form @submit.prevent="login" class="space-y-6">
          <div>
            <label for="email" class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Email address</label>
            <input
              id="email"
              v-model="email"
              type="email"
              autocomplete="email"
              required
              class="input"
              :disabled="isLoading"
            />
          </div>
          
          <div>
            <label for="password" class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Password</label>
            <input
              id="password"
              v-model="password"
              type="password"
              autocomplete="current-password"
              required
              class="input"
              :disabled="isLoading"
            />
          </div>
          
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <input
                id="remember-me"
                v-model="rememberMe"
                type="checkbox"
                class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-neutral-300 rounded"
                :disabled="isLoading"
              />
              <label for="remember-me" class="ml-2 block text-sm text-neutral-700 dark:text-neutral-300">
                Remember me
              </label>
            </div>
            
            <div class="text-sm">
              <a href="#" class="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300">
                Forgot your password?
              </a>
            </div>
          </div>
          
          <div>
            <button
              type="submit"
              class="w-full btn btn-primary py-2.5"
              :disabled="isLoading"
            >
              <svg v-if="isLoading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>{{ isLoading ? 'Logging in...' : 'Log in' }}</span>
            </button>
          </div>
          
          <div class="text-center">
            <button
              type="button"
              @click="fillDemoCredentials"
              class="text-sm text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300"
            >
              Use demo credentials
            </button>
          </div>
        </form>
        
        <div class="mt-6 text-center">
          <p class="text-sm text-neutral-600 dark:text-neutral-400">
            Don't have an account?
            <router-link to="/register" class="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300">
              Sign up
            </router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>