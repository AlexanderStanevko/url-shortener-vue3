<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const router = useRouter();
const authStore = useAuthStore();

const name = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const isLoading = ref(false);
const error = ref('');

const register = async () => {
  if (!name.value || !email.value || !password.value) {
    error.value = 'Please fill in all required fields';
    return;
  }
  
  if (password.value !== confirmPassword.value) {
    error.value = 'Passwords do not match';
    return;
  }
  
  if (password.value.length < 8) {
    error.value = 'Password must be at least 8 characters long';
    return;
  }
  
  isLoading.value = true;
  error.value = '';
  
  try {
    const success = await authStore.register(name.value, email.value, password.value);
    
    if (success) {
      router.push('/dashboard');
    } else {
      error.value = authStore.error || 'Registration failed';
    }
  } catch (e) {
    console.error('Registration error:', e);
    error.value = 'An unexpected error occurred';
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="flex justify-center py-12">
    <div class="w-full max-w-md">
      <div class="card bg-white dark:bg-neutral-800 shadow-md rounded-lg p-8">
        <div class="text-center mb-6">
          <h1 class="text-2xl font-bold text-neutral-900 dark:text-neutral-100">Create an account</h1>
          <p class="mt-2 text-neutral-600 dark:text-neutral-400">
            Sign up to start creating and tracking shortened URLs.
          </p>
        </div>
        
        <div v-if="error" class="mb-4 p-3 bg-error-100 text-error-700 dark:bg-error-900/30 dark:text-error-400 rounded-md text-sm">
          {{ error }}
        </div>
        
        <form @submit.prevent="register" class="space-y-5">
          <div>
            <label for="name" class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Full name</label>
            <input
              id="name"
              v-model="name"
              type="text"
              autocomplete="name"
              required
              class="input"
              :disabled="isLoading"
            />
          </div>
          
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
              autocomplete="new-password"
              required
              class="input"
              :disabled="isLoading"
            />
            <p class="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
              Must be at least 8 characters
            </p>
          </div>
          
          <div>
            <label for="confirm-password" class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Confirm password</label>
            <input
              id="confirm-password"
              v-model="confirmPassword"
              type="password"
              autocomplete="new-password"
              required
              class="input"
              :disabled="isLoading"
            />
          </div>
          
          <div class="flex items-center">
            <input
              id="terms"
              type="checkbox"
              required
              class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-neutral-300 rounded"
              :disabled="isLoading"
            />
            <label for="terms" class="ml-2 block text-sm text-neutral-700 dark:text-neutral-300">
              I agree to the
              <a href="#" class="text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300">terms of service</a>
              and
              <a href="#" class="text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300">privacy policy</a>
            </label>
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
              <span>{{ isLoading ? 'Creating account...' : 'Create account' }}</span>
            </button>
          </div>
        </form>
        
        <div class="mt-6 text-center">
          <p class="text-sm text-neutral-600 dark:text-neutral-400">
            Already have an account?
            <router-link to="/login" class="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300">
              Log in
            </router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>