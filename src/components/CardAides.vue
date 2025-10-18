<script setup lang="ts">
import type { AidesResponse } from '@/pocketbase-types'
import useAuth from '@/composables/useAuth'
import { computed } from 'vue'
import { pb } from '@/backend';

defineProps<{ aides: AidesResponse[] }>()

const { currentUser, refreshUser } = useAuth()

// Computed pour récupérer les favoris complets
const favoriteAides = computed(() => currentUser.value?.expand?.relFavoris ?? [])

// Vérifie si une aide est favorite
const isFavorite = (aideId: string) => favoriteAides.value.some(f => f.id === aideId)

// Ajouter / retirer des favoris
const toggleFavorite = async (aideId: string) => {
  if (!currentUser.value) return

  const currentIds = currentUser.value.relFavoris ?? []
  const newIds = isFavorite(aideId)
    ? currentIds.filter(id => id !== aideId)
    : [...currentIds, aideId]

  try {
    await pb.collection('users').update(currentUser.value.id, {
      relFavoris: newIds
    })
    await refreshUser()
  } catch (err) {
    console.error('Erreur gestion favoris:', err)
  }
}
</script>

<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
    <div
      v-for="aide in aides"
      :key="aide.id"
      class="bg-white rounded-2xl shadow p-4 flex flex-col items-center"
    >
      <h3 class="text-lg font-semibold mb-2">{{ aide.nom }}</h3>
      <div v-if="currentUser">
          <button
            @click="toggleFavorite(aide.id)"
            :class="[
              'px-4 py-2 rounded-xl transition-colors',
              isFavorite(aide.id) ? 'bg-red-500 text-white' : 'bg-blue-500 text-white'
            ]"
          >
            {{ isFavorite(aide.id) ? 'Retirer des favoris' : 'Ajouter aux favoris' }}
          </button>
      </div>
    </div>
  </div>
</template>
