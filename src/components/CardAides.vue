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

const FavorisIconOff = await pb.collection('LogosAndImages').getFirstListItem(
  `nom="FavOff"`
);

const FavorisIconOn = await pb.collection('LogosAndImages').getFirstListItem(
  `nom="FavOn"`
);
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
      <button @click="toggleFavorite(aide.id)" class="focus:outline-none">
        <ImgPb
          v-if="isFavorite(aide.id) && FavorisIconOn"
          :record="FavorisIconOn"
          :filename="FavorisIconOn.image"
          class="w-6 h-6"
        />
        <ImgPb
          v-else-if="!isFavorite(aide.id) && FavorisIconOff"
          :record="FavorisIconOff"
          :filename="FavorisIconOff.image"
          class="w-6 h-6"
        />
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
