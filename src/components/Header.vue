<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import useAuth from '@/composables/useAuth'
import MenuMobileTop from './MenuMobileTop.vue'
import NotifsToast from './notifsToast.vue'
import { pb } from '@/backend'
import ImgPb from './ImgPb.vue'

const { currentUser } = useAuth()

// --- état pour le menu notifications ---
const showNotifs = ref(false)
const notifRef = ref<HTMLElement | null>(null)
const toastRef = ref<HTMLElement | null>(null)

// Toggle affichage notifications
const toggleShowNotifs = () => (showNotifs.value = !showNotifs.value)

// Icône notification depuis PocketBase
const iconNotif = await pb.collection('LogosAndImages').getFirstListItem('nom="notifIcon"')

// --- Click outside safe ---
const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as Node
  if (!notifRef.value || !toastRef.value) return

  // ferme seulement si click en dehors du bouton ET du toast
  if (!notifRef.value.contains(target) && !toastRef.value.contains(target)) {
    showNotifs.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <header class="w-full p-4 flex justify-between items-center h-[10vh]">
    <!-- Logo -->
    <div>
      <RouterLink to="/">
        <img src="/src/assets/Img/Logo-simple.svg" alt="Logo HelpMMI" class="h-16 w-auto" />
      </RouterLink>
    </div>

    <!-- Menu desktop -->
    <div class="hidden md:flex items-center gap-4">
      <template v-if="currentUser">
        <div class="flex items-center gap-4 group relative cursor-pointer">
          <!-- Bouton Notifications -->
          <div ref="notifRef" class="relative">
            <button
              @click="toggleShowNotifs"
              class="bg-Bleu text-white px-4 py-2 rounded hover:bg-Rose flex items-center gap-2"
            >
              <ImgPb
                v-if="iconNotif"
                :record="iconNotif"
                :filename="iconNotif.image"
                class="w-6 h-6"
              />
              Notification
            </button>

            <!-- Popup notifications -->
            <div
              v-if="showNotifs"
              ref="toastRef"
              class="absolute top-5 right-0 mt-2 z-50"
            >
              <NotifsToast />
            </div>
          </div>

          <!-- Bouton profil -->
          <RouterLink to="/authPage" class="bg-Bleu text-white px-4 py-2 rounded hover:bg-Rose">
            Mon Profil
          </RouterLink>
        </div>
      </template>

      <!-- Connexion si pas connecté -->
      <RouterLink v-else to="/authPage" class="bg-Bleu text-white px-4 py-2 rounded hover:bg-Rose">
        Connexion
      </RouterLink>
    </div>

    <!-- Menu mobile -->
    <div class="md:hidden">
      <MenuMobileTop />
    </div>
  </header>
</template>