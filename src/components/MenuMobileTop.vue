<script setup lang="ts">
import { ref } from 'vue'
import useAuth from '@/composables/useAuth'
import NotifsToast from './notifsToast.vue'
import { pb } from '@/backend'
import ImgPb from './ImgPb.vue'
const { currentUser } = useAuth()

const isOpen = ref(false)
const toggleMenu = () => {
  isOpen.value = !isOpen.value
}
const showNotifs = ref(false);
const toggleShowNotifs = () => {
  showNotifs.value = !showNotifs.value;
};

const iconNotif = await pb
      .collection('LogosAndImages')
      .getFirstListItem('nom="notifIcon"')
</script>

<template>
  <nav class="md:hidden relative">
    <div class="flex space-x-4">
      <div v-if=currentUser class="flex items-center gap-4 group relative cursor-pointer">
        <button @click="toggleShowNotifs" class="bg-Bleu text-white px-4 py-2 rounded hover:bg-Rose flex items-center justify-center">
          <ImgPb v-if="iconNotif" :record="iconNotif" :filename="iconNotif.image" class="w-6 h-6"/>
        </button>
        <div v-if="showNotifs" class="absolute top-5 right-0 mt-2 z-50">
          <NotifsToast />
        </div>
      </div>
      <!-- Hamburger button -->
      <button
        @click="toggleMenu"
        class="w-10 h-10 relative flex items-center justify-center z-50 focus:outline-none shadow-md p-2 rounded-md bg-white"
      >
        <!-- Barre 1 -->
        <div
          class="absolute w-8 h-1 bg-Rose rounded transition-all duration-300"
          :class="isOpen ? 'rotate-45 translate-y-0.5 ' : '-translate-y-1'"
        ></div>
        <!-- Barre 2 -->
        <div
          class="absolute w-8 h-1 bg-Rose rounded transition-all duration-300"
          :class="isOpen ? '-rotate-45 -translate-y-0.5' : 'translate-y-1'"
        ></div>
      </button>
    </div>

    <!-- Menu mobile -->
    <div
      v-scroll-lock="isOpen"
      v-if="isOpen"
      class="fixed inset-0 bg-Rose z-40 flex flex-col items-center justify-center transition-transform duration-300 min-h-screen"
    >
      <img src="/src/assets//Img//helpMMi.png" alt="HelpMMI Logo" class="w-40 mb-8" />
      <ul class="flex flex-col items-center p-6 space-y-6 text-lg text-white">
        <li @click="isOpen = false">
          <RouterLink to="/" class="flex items-center gap-2 font-bold hover:text-Bleu">
            Accueil
          </RouterLink>
        </li>
        <li v-if="currentUser" @click="isOpen = false">
          <RouterLink to="/MesAides" class="flex items-center gap-2 font-bold hover:text-Bleu">
            Aides
          </RouterLink>
        </li>
        <li @click="isOpen = false">
          <RouterLink
            to="/PageSimulation"
            class="flex items-center gap-2 font-bold hover:text-Bleu"
          >
            Simulation
          </RouterLink>
        </li>
        <li v-if="currentUser" @click="isOpen = false">
          <RouterLink to="/mesInfos" class="flex items-center gap-2 font-bold hover:text-Bleu">
            Mes Informations
          </RouterLink>
        </li>
        <li @click="isOpen = false">
          <RouterLink to="/contact" class="flex items-center gap-2 font-bold hover:text-Bleu">
            Annuaires
          </RouterLink>
        </li>
      </ul>
      <div v-if="currentUser" class="flex items-center gap-4 group relative cursor-pointer mt-6">
        <button @click="isOpen = false">
          <RouterLink
            to="/authPage"
            class="bg-white text-Rose px-4 py-2 rounded hover:bg-Rose hover:text-white hover:border hover:border-white"
          >
            Mon Profil
          </RouterLink>
        </button>
      </div>
      <div v-else class="cursor-pointer mt-6">
        <RouterLink
          to="/authPage?mode=login"
          class="bg-white text-Rose px-4 py-2 rounded hover:bg-Rose hover:text-white hover:border-white"
          @click="isOpen = false"
        >
          Connexion
        </RouterLink>
      </div>
    </div>
  </nav>
</template>
