<script setup lang="ts">
import type { AidesResponse } from '@/pocketbase-types'
import useAuth from '@/composables/useAuth'
import { computed } from 'vue'
import { pb } from '@/backend'
import ImgPb from '@/components/ImgPb.vue'

defineProps<{ aides: AidesResponse[] }>()

const { currentUser, refreshUser } = useAuth()

const favoriteAides = computed(() => currentUser.value?.expand?.relFavoris ?? [])

const isFavorite = (aideId: string) =>
  favoriteAides.value.some(f => f.id === aideId)

const toggleFavorite = async (aideId: string) => {
  if (!currentUser.value) return
  const currentIds = currentUser.value.relFavoris ?? []
  const newIds = isFavorite(aideId)
    ? currentIds.filter(id => id !== aideId)
    : [...currentIds, aideId]

  try {
    await pb.collection('users').update(currentUser.value.id, {
      relFavoris: newIds,
    })
    await refreshUser()
  } catch (err) {
    console.error('Erreur gestion favoris:', err)
  }
}
</script>

<template>
  <div
    v-for="aide in aides"
    :key="aide.id"
    class="bg-amber-200 rounded-2xl shadow p-4 flex flex-col items-center relative overflow-visible"
  >
    <h3 class="text-lg font-semibold mb-2">{{ aide.nom }}</h3>

    <!-- Bouton favori -->
    <div v-if="currentUser" class="absolute top-2 right-2 z-50">
      <button
        @click="toggleFavorite(aide.id)"
        class="p-4 bg-white/30 rounded-full hover:bg-white/50 active:scale-90 transition-transform duration-150"
        style="touch-action: manipulation; -webkit-tap-highlight-color: transparent;"
      >
        <span
          :class="isFavorite(aide.id) ? 'text-red-500' : 'text-white'"
          class="text-2xl select-none pointer-events-none"
        >
          ♥
        </span>
      </button>
    </div>

    <!-- Image -->
    <ImgPb
      v-if="aide.imageCard"
      :record="aide"
      :filename="aide.imageCard"
      class="w-full h-32 object-cover mb-4 rounded"
    />
  </div>
</template>
