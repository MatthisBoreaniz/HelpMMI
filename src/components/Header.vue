<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import useAuth from '@/composables/useAuth'
import { RouterLink } from 'vue-router'

const { currentUser } = useAuth()
</script>

<template>
  <header class="w-full p-4 flex justify-between items-center h-[10vh]">
    <div>
      <RouterLink to="/">
        <img src="/src/assets/Img/helpMMi.png" alt="Logo HelpMMI" class="h-20 w-auto" />
      </RouterLink>
    </div>

    <div>
      <div v-if="currentUser" class="flex items-center gap-4 group relative cursor-pointer">
        <button>
          <RouterLink to="/authPage" class="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-blue-500">
            Mon Profil
          </RouterLink>
        </button>
      </div>
      <div v-else class="cursor-pointer">

        <RouterLink
          to="/authPage?mode=login"
          class="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-blue-500"
        >
          Connexion
        </RouterLink>
      </div>
    </div>
  </header>
</template>
