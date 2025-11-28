<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import useAuth from '@/composables/useAuth';

// Importation des images (Bonne pratique Vite/Vue)
import iconMaison from '@/assets/Icones/maison.png';
import iconAides from '@/assets/Icones/aides.png';
import iconSimulation from '@/assets/Icones/simulation.png';
import iconInfos from '@/assets/Icones/infos.png';
import iconAnnuaire from '@/assets/Icones/annuaire.png';

const route = useRoute();
const { currentUser } = useAuth();

const menuItems = [
  { 
    label: 'Accueil', 
    path: '/', 
    icon: iconMaison, 
    authRequired: false 
  },
  { 
    label: 'Mes Aides', 
    path: '/MesAides', 
    icon: iconAides, 
    authRequired: true 
  },
  { 
    label: 'Simulation', 
    path: '/simulation',
    icon: iconSimulation, 
    authRequired: false 
  },
  { 
    label: 'Mes Informations', 
    path: '/profil', 
    icon: iconInfos, 
    authRequired: true 
  },
  { 
    label: 'Annuaires', 
    path: '/annuaires', 
    icon: iconAnnuaire, 
    authRequired: false 
  },
];


const filteredMenu = computed(() => {
  return menuItems.filter(item => {

    if (!item.authRequired) return true;

    return !!currentUser.value;
  });
});


const isActive = (path: string) => route.path === path;
</script>

<template>
  <nav class="bg-white p-4 w-80">
    <div class="bg-Rose p-4 rounded-md">
      <ul class="flex flex-col space-y-4 text-lg">
        
        <li 
          v-for="item in filteredMenu" 
          :key="item.path" 
          class="truncate"
        >
          <RouterLink
            :to="item.path"
            class="text-black font-agrandir font-bold flex items-center gap-2 p-2 transition-colors duration-200"
            :class="[
              isActive(item.path) 
                ? 'bg-Blanc rounded-lg shadow-sm' 
                : 'hover:text-Blanc'
            ]"
          >
            <img :src="item.icon" :alt="item.label" class="w-6 h-6 mr-2 object-contain" />
            {{ item.label }}
          </RouterLink>
        </li>

      </ul>
    </div>
  </nav>
</template>