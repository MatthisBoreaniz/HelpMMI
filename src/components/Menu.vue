<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import useAuth from '@/composables/useAuth';
const { currentUser } = useAuth();
</script>



<template>
  <nav class="bg-white p-4 w-80">
    <div class="bg-Rose p-4 rounded-md">
        <ul class="flex flex-col space-y-4 text-lg">
          <li class="truncate">
            <RouterLink to="/" class="text-black font-agrandir hover:text-Blanc font-bold flex items-center gap-2">
              <img src="@/assets/Icones/maison.png" alt="Accueil" class="w-6 h-6 mr-2" />
              Accueil
            </RouterLink>
          </li>
          <li v-if="currentUser" class="truncate">
            <RouterLink to="/MesAides" class="text-black font-agrandir hover:text-Blanc font-bold flex items-center gap-2">
              <img src="@/assets/Icones/aides.png" alt="Mes Aides" class="w-5h-5 mr-2" />
              Mes Aides
            </RouterLink>
          </li>
          <li class="truncate">
            <RouterLink to="/contact" class="text-black font-agrandir hover:text-Blanc font-bold flex items-center gap-2">
              <img src="@/assets/Icones/simulation.png" alt="Simulation" class="w-5h-5 mr-2" />
              Simulation
            </RouterLink>
          </li>
          <li v-if="currentUser" class="truncate">
            <RouterLink to="/contact" class="text-black font-agrandir hover:text-Blanc font-bold flex items-center gap-2">
              <img src="@/assets/Icones/infos.png" alt="Mes Informations" class="w-5h-5 mr-2" />
              Mes Informations
            </RouterLink>
          </li>
          <li class="truncate">
            <RouterLink to="/contact" class="text-black font-agrandir hover:text-Blanc font-bold flex items-center gap-2">
              <img src="@/assets/Icones/annuaire.png" alt="Annuaires" class="w-5h-5 mr-2" />
              Annuaires
            </RouterLink>
          </li>
        </ul>
    </div>
  </nav>

</template>