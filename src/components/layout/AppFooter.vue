<script setup lang="ts">
import { useThemeStore } from '../../stores/theme';

const themeStore = useThemeStore();
const currentYear = new Date().getFullYear();
</script>

<template>
  <footer class="bg-white dark:bg-neutral-800 shadow-sm mt-12">
    <div class="container mx-auto px-4 py-6">
      <div class="flex flex-col md:flex-row md:justify-between md:items-center">
        <div class="flex items-center space-x-2 mb-4 md:mb-0">
          <span class="text-primary-600 dark:text-primary-400 font-bold text-xl">Sho.rt</span>
          <span class="text-neutral-500 dark:text-neutral-400 text-sm">© {{ currentYear }} All rights reserved</span>
        </div>
        
        <div class="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-6">
          <div class="flex space-x-4">
            <a href="#" class="text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-300 text-sm">
              Privacy Policy
            </a>
            <a href="#" class="text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-300 text-sm">
              Terms of Service
            </a>
          </div>
          
          <div class="flex items-center space-x-2">
            <span class="text-neutral-500 dark:text-neutral-400 text-sm">Theme:</span>
            <button 
              @click="themeStore.toggleDarkMode" 
              class="px-3 py-1 rounded-md text-xs font-medium"
              :class="themeStore.darkMode ? 'bg-neutral-700 text-neutral-200' : 'bg-neutral-200 text-neutral-700'"
            >
              {{ themeStore.darkMode ? 'Dark' : 'Light' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>