<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import useAuth from '@/composables/useAuth'
import { RouterLink } from 'vue-router'
import MenuMobileTop from './MenuMobileTop.vue';

const { currentUser } = useAuth()
</script>

<template>
  <header class="w-full p-4 flex justify-between items-center h-[10vh]">
    <div>
      <RouterLink to="/">
        <img src="/src/assets/Img/helpMMi.png" alt="Logo HelpMMI" class="h-20 w-auto" />
      </RouterLink>
    </div>

    <div class="hidden md:flex items-center gap-4">
      <div v-if="currentUser" class="flex items-center gap-4 group relative cursor-pointer">
        <button>
          <RouterLink to="/authPage" class="bg-Bleu text-white px-4 py-2 rounded hover:bg-Rose">
            Mon Profil
          </RouterLink>
        </button>
      </div>
      <div v-else class="cursor-pointer">

        <RouterLink
          to="/authPage?mode=login"
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
