<script setup lang="ts">
import type { AidesResponse, CategoriesResponse } from '@/pocketbase-types'
import useAuth from '@/composables/useAuth'
import { computed } from 'vue'
import { pb } from '@/backend'
import ImgPb from '@/components/ImgPb.vue'
import { RouterLink } from 'vue-router'

defineProps<{
  aides: AidesResponse<{ relCategories: CategoriesResponse}>[]
}>()

const emit = defineEmits<{
  (e: 'delete', id: string): void
}>()

const { currentUser, refreshUser } = useAuth()

const favoriteAides = computed(() => currentUser.value?.expand?.relFavoris ?? [])

const isFavorite = (aideId: string) => favoriteAides.value.some((f) => f.id === aideId)

const toggleFavorite = async (aideId: string) => {
  if (!currentUser.value) return
  const currentIds = currentUser.value.relFavoris ?? []
  const removing = isFavorite(aideId)
  
  const newIds = removing
    ? currentIds.filter((id) => id !== aideId)
    : [...currentIds, aideId]

  try {
    await pb.collection('users').update(currentUser.value.id, {
      relFavoris: newIds,
    })

    if (removing) {
      emit('delete', aideId)
    }

    await refreshUser()
  } catch (err) {
    console.error('Erreur gestion favoris:', err)
  }
}

const FavorisIconOff = await pb.collection('LogosAndImages').getFirstListItem(`nom="FavOff"`)
const FavorisIconOn = await pb.collection('LogosAndImages').getFirstListItem(`nom="FavOn"`)
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
        class="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 blur-sm"
      />
      <div v-else class="absolute inset-0 bg-gray-400 w-full h-full"></div>

      <div
        class="absolute inset-0 transition-colors duration-300 mix-blend-multiply z-10"
        :class="{
          'bg-Bleu-clair': aide.expand?.relCategories?.nom === 'finances',
          'bg-Rose': aide.expand?.relCategories?.nom === 'sante',
          'bg-Bleu': aide.expand?.relCategories?.nom === 'entrepreunariat',
          'bg-green-500/85': aide.expand?.relCategories?.nom === 'test',
        }"
      ></div>
      <div
        class="absolute inset-0 transition-colors duration-300 mix-blend-multiply z-5 bg-black/20"
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
          >
            Découvrir
          </div>
        </div>
      </div>
    </RouterLink>
  </div>
</template>