<template>
  <div class="p-4 bg-white rounded-lg shadow-md w-80 max-h-[500px] overflow-y-auto">
    <h2 class="text-center text-lg font-bold mb-4 text-pink-300">Centre des notifications</h2>

    <ul class="flex flex-col gap-2">
      <li
        v-for="notif in notifications"
        :key="notif.id"
        class="flex gap-2 p-2 border-b border-gray-200 items-start hover:bg-gray-50 rounded"
      >
        <div class="flex-1">
          <p class="font-medium">{{ notif.titre }}</p>
          <p class="text-sm text-gray-600">{{ notif.message }}</p>
        </div>
        <button @click="deleteNotification(notif.id)" class="text-red-500 text-xs">Supprimer</button>
      </li>
    </ul>

    <button @click="markAllAsRead" class="mt-4 w-full bg-pink-200 text-white font-bold py-2 rounded hover:bg-pink-300 transition">
      Tous marqués comme lu
    </button>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import useAuth from '@/composables/useAuth'
import useNotifications from '@/composables/useNotif'

const { currentUser } = useAuth()

// Sécurité : On s'assure d'avoir un ID (ce composant ne devrait idéalement s'afficher que si connecté)
const userId = currentUser.value?.id || ''

// CORRECTION 1 : On passe l'argument ici (Expected 1 argument)
// C'est ici que le composable capture l'ID de l'utilisateur pour ses filtres internes
const { notifications, loadNotifications, deleteNotification, markAllAsRead } = useNotifications(userId)

onMounted(() => {
  if (userId) {
    // CORRECTION 2 : On appelle sans argument (Expected 0 arguments)
    // La fonction sait déjà quel utilisateur charger grâce à l'initialisation ci-dessus
    loadNotifications()
  }
})
</script>   