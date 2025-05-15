import { defineStore } from 'pinia';
import { ref, markRaw } from 'vue';
import { generateId } from '../utils/helpers';

export const useModalStore = defineStore('modal', () => {
  const isOpen = ref(false);
  const id = ref('');
  const title = ref('');
  const content = ref('');
  const component = ref<any>(null);
  const props = ref<any>(null);
  
  const openModal = (options: {
    title: string,
    content?: string,
    component?: any,
    props?: any
  }) => {
    id.value = generateId();
    title.value = options.title;
    content.value = options.content || '';
    component.value = options.component ? markRaw(options.component) : null;
    props.value = options.props || null;
    isOpen.value = true;
  };
  
  const closeModal = () => {
    isOpen.value = false;
    
    setTimeout(() => {
      id.value = '';
      title.value = '';
      content.value = '';
      component.value = null;
      props.value = null;
    }, 300);
  };
  
  return {
    isOpen,
    id,
    title,
    content,
    component,
    props,
    openModal,
    closeModal,
  };
});