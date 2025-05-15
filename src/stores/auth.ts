import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { User } from '../types';
import { useToastStore } from './toast';
import { generateId } from '../utils/helpers';

export const useAuthStore = defineStore('auth', () => {
  const toastStore = useToastStore();
  
  const user = ref<User | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);
  
  const mockUsers = [
    {
      id: '1',
      name: 'Demo User',
      email: 'demo@example.com',
      password: 'password123',
      createdAt: new Date().toISOString(),
    },
    {
      id: '2',
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'admin123',
      createdAt: new Date().toISOString(),
    }
  ];
  
  try {
    const savedUser = localStorage.getItem('authUser');
    if (savedUser) {
      user.value = JSON.parse(savedUser);
    }
  } catch (e) {
    console.error('Failed to parse saved user from localStorage', e);
  }
  
  const isAuthenticated = computed(() => !!user.value);

  const login = async (email: string, password: string) => {
    loading.value = true;
    error.value = null;

    await new Promise(resolve => setTimeout(resolve, 800));
    
    try {
      const foundUser = mockUsers.find(u => u.email === email && u.password === password);
      
      if (foundUser) {
        const { password, ...userWithoutPassword } = foundUser;
        user.value = userWithoutPassword as User;
        
        localStorage.setItem('authUser', JSON.stringify(user.value));
        
        toastStore.addToast({
          type: 'success',
          message: `Welcome back, ${user.value.name}!`,
          duration: 3000,
        });
        
        return true;
      } else {
        error.value = 'Invalid email or password';
        toastStore.addToast({
          type: 'error',
          message: 'Invalid email or password',
          duration: 3000,
        });
        return false;
      }
    } catch (e) {
      error.value = 'An error occurred during login';
      toastStore.addToast({
        type: 'error',
        message: 'An error occurred during login',
        duration: 3000,
      });
      return false;
    } finally {
      loading.value = false;
    }
  };
  
  const register = async (name: string, email: string, password: string) => {
    loading.value = true;
    error.value = null;
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    try {
      if (mockUsers.some(u => u.email === email)) {
        error.value = 'Email is already taken';
        toastStore.addToast({
          type: 'error',
          message: 'Email is already taken',
          duration: 3000,
        });
        return false;
      }
      
      const newUser = {
        id: generateId(),
        name,
        email,
        password,
        createdAt: new Date().toISOString(),
      };
      
      mockUsers.push(newUser);
      
      const { password: _, ...userWithoutPassword } = newUser;
      user.value = userWithoutPassword as User;
      
      localStorage.setItem('authUser', JSON.stringify(user.value));
      
      toastStore.addToast({
        type: 'success',
        message: `Welcome, ${user.value.name}!`,
        duration: 3000,
      });
      
      return true;
    } catch (e) {
      error.value = 'An error occurred during registration';
      toastStore.addToast({
        type: 'error',
        message: 'An error occurred during registration',
        duration: 3000,
      });
      return false;
    } finally {
      loading.value = false;
    }
  };
  
  const logout = () => {
    user.value = null;
    localStorage.removeItem('authUser');
    
    toastStore.addToast({
      type: 'info',
      message: 'You have been logged out',
      duration: 3000,
    });
  };
  
  const checkAuth = () => {
    const savedUser = localStorage.getItem('authUser');
    
    if (savedUser) {
      try {
        user.value = JSON.parse(savedUser);
        return true;
      } catch (e) {
        console.error('Failed to parse saved user', e);
        return false;
      }
    }
    
    return false;
  };
  
  return {
    user,
    loading,
    error,
    isAuthenticated,
    login,
    register,
    logout,
    checkAuth,
  };
});