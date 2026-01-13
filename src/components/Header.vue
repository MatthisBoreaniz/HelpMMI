<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import useAuth from '@/composables/useAuth'
import { RouterLink } from 'vue-router'
import MenuMobileTop from './MenuMobileTop.vue'
import NotifsToast from './notifsToast.vue';
import { ref } from 'vue';

const { currentUser } = useAuth()
const showNotifs = ref(false);
const toggleShowNotifs = () => {
  showNotifs.value = !showNotifs.value;
};
</script>

<template>
  <header class="w-full p-4 flex justify-between items-center h-[10vh]">
    <div>
      <RouterLink to="/">
        <img src="/src/assets/Img/helpMMi.png" alt="Logo HelpMMI" class="h-16 w-auto" />
      </RouterLink>
    </div>

    <div class="hidden md:flex items-center gap-4">
      <div v-if="currentUser" class="flex items-center gap-4 group relative cursor-pointer">
        <div>
          <button @click="toggleShowNotifs" class="bg-Bleu text-white px-4 py-2 rounded hover:bg-Rose">
              Notification
          </button>
          <div v-if="showNotifs" class="absolute right-0 mt-2">
            <NotifsToast />
          </div>
        </div>
        <button>
          <RouterLink to="/authPage" class="bg-Bleu text-white px-4 py-2 rounded hover:bg-Rose">
            Mon Profil
          </RouterLink>
        </button>
      </div>
      <div v-else class="cursor-pointer">

        <RouterLink
          to="/authPage"
          class="bg-Bleu text-white px-4 py-2 rounded hover:bg-Rose"
        >
          Connexion
        </RouterLink>
      </div>
    </div>
    <div class="md:hidden">
      <MenuMobileTop />
    </div>
  </header>
</template>
