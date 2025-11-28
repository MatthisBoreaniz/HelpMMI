<script setup lang="ts">
import type { AidesResponse, CategoriesResponse } from '@/pocketbase-types'
import useAuth from '@/composables/useAuth'
import { computed } from 'vue'
import { pb } from '@/backend'
import ImgPb from '@/components/ImgPb.vue'
import { RouterLink } from 'vue-router'

// On définit le type générique ici pour dire à TypeScript que "expand" contient "relCategories"
// Assure-toi que le PARENT envoie bien ces données.
defineProps<{
  aides: AidesResponse<{ relCategories: CategoriesResponse,}>[]
}>()

const { currentUser, refreshUser } = useAuth()

// ... (Le reste de ta logique favoris reste identique) ...

const favoriteAides = computed(() => currentUser.value?.expand?.relFavoris ?? [])

const isFavorite = (aideId: string) => favoriteAides.value.some((f) => f.id === aideId)

const toggleFavorite = async (aideId: string) => {
  if (!currentUser.value) return
  const currentIds = currentUser.value.relFavoris ?? []
  const newIds = isFavorite(aideId)
    ? currentIds.filter((id) => id !== aideId)
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

const FavorisIconOff = await pb.collection('LogosAndImages').getFirstListItem(`nom="FavOff"`)
const FavorisIconOn = await pb.collection('LogosAndImages').getFirstListItem(`nom="FavOn"`)

// SUPPRIME LE FETCH 'aideCategorie' ICI, IL EST INUTILE
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    <RouterLink
      v-for="aide in aides"
      :key="aide.id"
      :to="{ path: `/aides/${aide.id}` }"
      class="group relative w-full aspect-[4/5] md:aspect-square overflow-hidden rounded-[2rem] shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
    >
      <ImgPb
        v-if="aide.imageCard"
        :record="aide"
        :filename="aide.imageCard"
        class="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
      />
      <div v-else class="absolute inset-0 bg-gray-300 w-full h-full"></div>

      <div
        class="absolute inset-0 transition-colors duration-300 mix-blend-multiply z-10"
           :class="{
              'bg-Bleu-clair': aide.expand?.relCategories?.nom === 'finances',
              'bg-Rose/85': aide.expand?.relCategories?.nom === 'sante',
              'bg-Bleu/85': aide.expand?.relCategories?.nom ===  'entrepreunariat'
            }"
      ></div>

      <div class="absolute inset-0 z-20 p-5 flex flex-col justify-between">
        <div class="flex justify-end">
          <button
            v-if="currentUser"
            @click.prevent="toggleFavorite(aide.id)"
            class="focus:outline-none transform transition hover:scale-110 active:scale-95"
          >
            <ImgPb
              v-if="isFavorite(aide.id) && FavorisIconOn"
              :record="FavorisIconOn"
              :filename="FavorisIconOn.image"
              class="w-8 h-8 drop-shadow-md"
            />
            <ImgPb
              v-else-if="!isFavorite(aide.id) && FavorisIconOff"
              :record="FavorisIconOff"
              :filename="FavorisIconOff.image"
              class="w-8 h-8 drop-shadow-md opacity-80 hover:opacity-100"
            />
          </button>
        </div>

        <div class="flex-grow flex items-center justify-center">
          <h3
            class="text-white font-permanent-marker text-xl md:text-2xl text-center leading-tight drop-shadow-lg rotate-[-2deg]"
          >
            {{ aide.nom }}
          </h3>
        </div>

        <div class="w-full">
          <div
            class="bg-[#FFFBF5] font-agrandir font-bold text-lg py-3 rounded-2xl text-center shadow-md group-hover:bg-white transition-colors"
            :class="{
              'text-Bleu-clair': aide.expand?.relCategories?.nom === 'finances',
              'text-Rose': aide.expand?.relCategories?.nom === 'sante',
              'text-Bleu': aide.expand?.relCategories?.nom ===  'entrepreunariat'
            }"
          >
            Découvrir
          </div>
        </div>
      </div>
    </RouterLink>
  </div>
</template>
