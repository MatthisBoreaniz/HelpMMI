<template>
  <div class="z-50 p-4 bg-white rounded-xl shadow-lg w-80 max-h-[500px] flex flex-col">
    <h2 class="text-center text-lg font-bold mb-4 text-Rose flex-shrink-0">
      Centre des notifications
    </h2>

    <ul class="flex-1 flex flex-col gap-3 overflow-y-auto pr-1">
      <li
        v-for="notif in notifications"
        :key="notif.id"
        :class="[
          'flex justify-between items-start gap-2 p-3 border-b border-gray-200 rounded transition',
          notif.read ? 'bg-gray-100' : 'hover:bg-gray-50 bg-white shadow-md',
        ]"
      >
        <div class="flex-1">
          <p class="font-semibold text-gray-800">{{ notif.titre }}</p>
          <p class="text-sm text-gray-600 mt-1">{{ notif.message }}</p>
        </div>

        <div class="flex flex-col gap-1 items-end">
          <button
            v-if="!notif.read"
            @click.stop="markAsRead(notif.id)"
            class="text-green-600 text-xs hover:text-green-700 transition"
            title="Marquer comme lu"
          >
            Marquer lu
          </button>
          <button
            v-else
            class="text-Bleu text-xs hover:text-Rose transition"
            title="Notification lue"
          >
            Notification lue
          </button>

          <button
            @click.stop="deleteNotification(notif.id)"
            class="text-red-500 text-xs hover:text-red-600 transition"
            title="Supprimer"
          >
            Supprimer
          </button>
        </div>
      </li>
    </ul>

    <div class="mt-4 flex flex-col gap-2 flex-shrink-0">
      <button
        @click="markAllAsRead"
        class="w-full bg-Bleu text-white font-bold py-2 rounded hover:bg-Bleu/80 transition"
      >
        Tous marqués comme lu
      </button>
      <button
        @click="deleteAllNotifications"
        class="w-full bg-red-500 text-white font-bold py-2 rounded hover:bg-red-600 transition"
      >
        Supprimer tout
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue'
import useAuth from '@/composables/useAuth'
import useNotifications from '@/composables/useNotif'

const { currentUser } = useAuth()
const userId = computed(() => currentUser.value?.id || '')

const {
  notifications,
  loadNotifications,
  deleteNotification,
  markAllAsRead,
  deleteAllNotifications,
  markAsRead,
} = useNotifications(userId.value)

onMounted(() => {
  if (userId.value) {
    loadNotifications()
  }
})
</script>