import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Toast } from '../types';
import { generateId } from '../utils/helpers';

export const useToastStore = defineStore('toast', () => {
  const toasts = ref<Toast[]>([]);
  
  const addToast = (toast: Omit<Toast, 'id'>) => {
    const id = generateId();
    const newToast: Toast = {
      id,
      ...toast,
    };
    
    toasts.value.push(newToast);
    
    if (toast.duration) {
      setTimeout(() => {
        removeToast(id);
      }, toast.duration);
    }
    
    return id;
  };
  
  const removeToast = (id: string) => {
    const index = toasts.value.findIndex(toast => toast.id === id);
    if (index !== -1) {
      toasts.value.splice(index, 1);
    }
  };
  
  const clearAllToasts = () => {
    toasts.value = [];
  };
  
  return {
    toasts,
    addToast,
    removeToast,
    clearAllToasts,
  };
});