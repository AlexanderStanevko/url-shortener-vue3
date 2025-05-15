<script setup lang="ts">
import { onMounted, watch } from 'vue';
import { useThemeStore } from './stores/theme';
import { useToastStore } from './stores/toast';
import AppHeader from './components/layout/AppHeader.vue';
import AppFooter from './components/layout/AppFooter.vue';
import Toast from './components/common/Toast.vue';
import Modal from './components/common/Modal.vue';
import { useModalStore } from './stores/modal';

const themeStore = useThemeStore();
const toastStore = useToastStore();
const modalStore = useModalStore();

onMounted(() => {
  themeStore.initialize();
});

watch(() => themeStore.darkMode, (isDark) => {
  if (isDark) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
});
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <AppHeader />
    
    <main class="flex-grow container mx-auto px-4 py-6">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
    
    <AppFooter />
    
    <div class="fixed bottom-4 right-4 z-50">
      <transition-group name="toast">
        <Toast 
          v-for="toast in toastStore.toasts" 
          :key="toast.id" 
          :toast="toast" 
          @close="toastStore.removeToast(toast.id)" 
        />
      </transition-group>
    </div>
    
    <Modal 
      v-if="modalStore.isOpen" 
      :title="modalStore.title"
      :content="modalStore.content"
      :component="modalStore.component"
      :props="modalStore.props"
      @close="modalStore.closeModal()"
    />
  </div>
</template>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateY(30px);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
</style>