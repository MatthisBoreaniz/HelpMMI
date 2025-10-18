<script setup lang="ts">
import useAuth from '@/composables/useAuth'

const { currentUser, logout } = useAuth()
</script>

<template>
  <div class="flex flex-col items-center gap-3">
    <h2 class="text-xl font-semibold">Bonjour, {{ currentUser?.name }}</h2>
    <button
      @click="logout"
      class="bg-red-600 text-white p-2 rounded hover:bg-red-500"
    >
      Déconnexion
    </button>
  </div>
  <pre class="mt-4 p-4 bg-gray-100 border rounded w-96 overflow-x-auto">
    {{ JSON.stringify(currentUser, null, 2) }}
  </pre>
</template>
