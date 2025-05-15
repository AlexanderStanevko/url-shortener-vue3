import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useThemeStore = defineStore('theme', () => {
  const darkMode = ref(false);
  
  const toggleDarkMode = () => {
    darkMode.value = !darkMode.value;
    localStorage.setItem('darkMode', darkMode.value.toString());
  };
  
  const setDarkMode = (value: boolean) => {
    darkMode.value = value;
    localStorage.setItem('darkMode', value.toString());
  };
  
  const initialize = () => {
    const savedMode = localStorage.getItem('darkMode');
    
    if (savedMode !== null) {
      darkMode.value = savedMode === 'true';
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      darkMode.value = prefersDark;
      localStorage.setItem('darkMode', prefersDark.toString());
    }
    
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