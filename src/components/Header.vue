<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import useAuth from '@/composables/useAuth'
import MenuMobileTop from './MenuMobileTop.vue'
import NotifsToast from './notifsToast.vue'
import { pb } from '@/backend'
import ImgPb from './ImgPb.vue'

const { currentUser } = useAuth()
const showNotifs = ref(false)
const toggleShowNotifs = () => (showNotifs.value = !showNotifs.value)

const iconNotif = await pb
      .collection('LogosAndImages')
      .getFirstListItem('nom="notifIcon"')
</script>

<template>
  <header class="w-full p-4 flex justify-between items-center h-[10vh]">
    <div>
      <RouterLink to="/">
        <img src="/src/assets/Img/helpMMi.png" alt="Logo HelpMMI" class="h-16 w-auto" />
      </RouterLink>
    </div>

    <div class="hidden md:flex items-center gap-4">
      <template v-if="currentUser">
        <div class="flex items-center gap-4 group relative cursor-pointer">
          <button @click="toggleShowNotifs" class="bg-Bleu text-white px-4 py-2 rounded hover:bg-Rose flex items-center gap-2">
            <ImgPb v-if="iconNotif" :record="iconNotif" :filename="iconNotif.image" class="w-6 h-6"/>
            Notification
          </button>
          <div v-if="showNotifs" class="absolute top-5 right-0 mt-2 z-50">
            <NotifsToast />
          </div>

          <RouterLink
            to="/authPage"
            class="bg-Bleu text-white px-4 py-2 rounded hover:bg-Rose"
          >
            Mon Profil
          </RouterLink>
        </div>
      </template>

      <RouterLink
        v-else
        to="/authPage"
        class="bg-Bleu text-white px-4 py-2 rounded hover:bg-Rose"
      >
        Connexion
      </RouterLink>
    </div>

    <div class="md:hidden">
      <MenuMobileTop />
    </div>
  </header>
</template>
