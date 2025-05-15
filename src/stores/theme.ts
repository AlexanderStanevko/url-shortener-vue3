import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useThemeStore = defineStore('theme', () => {
  // State
  const darkMode = ref(false);
  
  // Actions
  const toggleDarkMode = () => {
    darkMode.value = !darkMode.value;
    localStorage.setItem('darkMode', darkMode.value.toString());
  };
  
  const setDarkMode = (value: boolean) => {
    darkMode.value = value;
    localStorage.setItem('darkMode', value.toString());
  };
  
  const initialize = () => {
    // Check localStorage first
    const savedMode = localStorage.getItem('darkMode');
    
    if (savedMode !== null) {
      darkMode.value = savedMode === 'true';
    } else {
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      darkMode.value = prefersDark;
      localStorage.setItem('darkMode', prefersDark.toString());
    }
    
    // Apply theme to document
    if (darkMode.value) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };
  
  return {
    darkMode,
    toggleDarkMode,
    setDarkMode,
    initialize,
  };
});