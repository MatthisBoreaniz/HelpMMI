<script setup lang="ts">
import { ref, computed } from 'vue'
import useAuth from '@/composables/useAuth'
import CardAides from '@/components/CardAides.vue'
import { pb } from '@/backend'
import type { AidesResponse, CategoriesResponse } from '@/pocketbase-types'
import LayoutDefault from '@/layouts/LayoutDefault.vue'
import TestFiltre from '@/components/testFiltre.vue'

type AideFavorite = AidesResponse & {
  expand: {
    relCategories: CategoriesResponse
  }
}

const mode = ref<'tout' | 'aides' | 'favoris' | 'obtenues'>('aides')
const { currentUser, refreshUser } = useAuth()
const favorisEnrichis = ref<AideFavorite[]>([])

await refreshUser()

const idsFavoris = currentUser.value?.relFavoris || []

if (idsFavoris.length > 0) {
  const filterString = idsFavoris.map((id: string) => `id="${id}"`).join(' || ')

  try {
    const result = await pb.collection('Aides').getFullList({
      filter: filterString,
      expand: 'relCategories',
    })

    favorisEnrichis.value = result as unknown as AideFavorite[]
    
  } catch (error) {
    console.error("Erreur lors du chargement des favoris :", error)
  }
}

const numberFavoris = computed(() => currentUser.value?.relFavoris?.length || 0)

const handleLocalDelete = (idAide: string) => {
  favorisEnrichis.value = favorisEnrichis.value.filter((aide) => aide.id !== idAide)
  refreshUser()
}
</script>

<template>
  <LayoutDefault>
    <div class="p-10 pt-0">
      <div v-if="!currentUser" class="flex flex-col justify-center items-center w-full">
        <p class="text-center mt-10 text-Rose">
          Veuillez vous connecter pour voir vos aides et favoris.
        </p>
        <a
          href="/authPage"
          class="block text-center p-4 bg-Bleu text-Blanc font-bold text-lg rounded-2xl"
        >
          Aller à la page de connexion
        </a>
      </div>

      <div v-else>
        <!-- Desktop Navigation -->
        <ul class="hidden md:flex flex-wrap gap-2 md:gap-4 text-gray-300 text-sm md:text-xl">
          <li
            @click="mode = 'tout'"
            class="cursor-pointer px-2 md:px-0"
            :class="{ 'text-Bleu font-bold': mode === 'tout' }"
          >
            Toutes les aides
          </li>
          <li
            @click="mode = 'aides'"
            class="cursor-pointer px-2 md:px-0"
            :class="{ 'text-Bleu font-bold': mode === 'aides' }"
          >
            Mes aides
          </li>
          <li
            @click="mode = 'favoris'"
            class="cursor-pointer px-2 md:px-0"
            :class="{ 'text-Bleu font-bold': mode === 'favoris' }"
          >
            Mes favoris ({{ numberFavoris }})
          </li>
          <li
            @click="mode = 'obtenues'"
            class="cursor-pointer px-2 md:px-0"
            :class="{ 'text-Bleu font-bold': mode === 'obtenues' }"
          >
            Aides Obtenues
          </li>
        </ul>

        <!-- Mobile Select -->
        <select v-model="mode" class="md:hidden w-full p-2 rounded border border-Bleu text-gray-300">
          <option value="tout">Toutes les aides</option>
          <option value="aides">Mes aides</option>
          <option value="favoris">Mes favoris ({{ numberFavoris }})</option>
          <option value="obtenues">Aides Obtenues</option>
        </select>

        <div v-if="mode === 'favoris'">
          <div class="flex flex-col gap-6">
            <h1 class="font-bold text-lg font-agrandir-narrow mt-5">
              Retrouvez vos aides mises en favoris
            </h1>
            <div>
              <CardAides
                v-if="favorisEnrichis.length"
                :aides="favorisEnrichis"
                @delete="handleLocalDelete"
              />

              <div v-else class="bg-none rounded-lg border border-Bleu">
                <p class="p-4 text-center">Aucun favori pour le moment.</p>
              </div>
            </div>
          </div>
        </div>
        <div v-if="mode === 'tout'">
              <TestFiltre class="p-10 pt-0" />
        </div>
      </div>
    </div>
  </LayoutDefault>
</template>
