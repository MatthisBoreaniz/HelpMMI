<script setup lang="ts">
import { ref, computed } from 'vue'
import useAuth from '@/composables/useAuth'
import CardAides from '@/components/CardAides.vue'
import { pb } from '@/backend'
import type { AidesResponse, CategoriesResponse } from '@/pocketbase-types'
import LayoutDefault from '@/layouts/LayoutDefault.vue'
import TestFiltre from '@/components/testFiltre.vue'

// Type strict pour les aides avec catégories étendues
type AideFavorite = AidesResponse & {
  expand: {
    relCategories: CategoriesResponse
  }
}

// État de l'interface
const mode = ref<'tout' | 'aides' | 'favoris' | 'obtenues'>('aides')
const { currentUser, refreshUser } = useAuth()

// Listes de données
const favorisEnrichis = ref<AideFavorite[]>([])
const mesAidesEnrichies = ref<AideFavorite[]>([])
const aidesObtenuesEnrichies = ref<AideFavorite[]>([])

// 1. Récupération de l'utilisateur
await refreshUser()

// 2. Chargement des FAVORIS
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
    console.error("Erreur chargement favoris :", error)
  }
}

// 3. Chargement de MES AIDES (Résultats simulation)
const idsMesAides = currentUser.value?.mes_aides || [] 
if (idsMesAides.length > 0) {
  const filterString = idsMesAides.map((id: string) => `id="${id}"`).join(' || ')
  try {
    const result = await pb.collection('Aides').getFullList({
      filter: filterString,
      expand: 'relCategories',
    })
    mesAidesEnrichies.value = result as unknown as AideFavorite[]
  } catch (error) {
    console.error("Erreur chargement Mes Aides :", error)
  }
}

// 4. Chargement des AIDES OBTENUES (Complétées à 100%)
const idsAidesObtenues = currentUser.value?.aides_obtenues || []
if (idsAidesObtenues.length > 0) {
  const filterString = idsAidesObtenues.map((id: string) => `id="${id}"`).join(' || ')
  try {
    const result = await pb.collection('Aides').getFullList({
      filter: filterString,
      expand: 'relCategories',
    })
    aidesObtenuesEnrichies.value = result as unknown as AideFavorite[]
  } catch (error) {
    console.error("Erreur chargement Aides Obtenues :", error)
  }
}

const numberFavoris = computed(() => currentUser.value?.relFavoris?.length || 0)

// Fonction de suppression locale (met à jour toutes les listes pour éviter un refresh page)
const handleLocalDelete = (idAide: string) => {
  favorisEnrichis.value = favorisEnrichis.value.filter((aide) => aide.id !== idAide)
  mesAidesEnrichies.value = mesAidesEnrichies.value.filter((aide) => aide.id !== idAide)
  aidesObtenuesEnrichies.value = aidesObtenuesEnrichies.value.filter((aide) => aide.id !== idAide)
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
          class="block text-center p-4 bg-Bleu text-Blanc font-bold text-lg rounded-2xl mt-4 hover:bg-blue-800 transition-colors"
        >
          Aller à la page de connexion
        </a>
      </div>

      <div v-else>
        
        <ul class="hidden md:flex flex-wrap gap-2 md:gap-4 text-gray-300 text-sm md:text-xl border-b border-gray-100 pb-2 mb-6">
          <li
            @click="mode = 'tout'"
            class="cursor-pointer px-2 md:px-0 hover:text-Bleu transition-colors"
            :class="{ 'text-Bleu font-bold border-b-2 border-Bleu': mode === 'tout' }"
          >
            Toutes les aides
          </li>
          <li
            @click="mode = 'aides'"
            class="cursor-pointer px-2 md:px-0 hover:text-Bleu transition-colors"
            :class="{ 'text-Bleu font-bold border-b-2 border-Bleu': mode === 'aides' }"
          >
            Mes aides
          </li>
          <li
            @click="mode = 'favoris'"
            class="cursor-pointer px-2 md:px-0 hover:text-Bleu transition-colors"
            :class="{ 'text-Bleu font-bold border-b-2 border-Bleu': mode === 'favoris' }"
          >
            Mes favoris ({{ numberFavoris }})
          </li>
          <li
            @click="mode = 'obtenues'"
            class="cursor-pointer px-2 md:px-0 hover:text-green-600 transition-colors"
            :class="{ 'text-green-600 font-bold border-b-2 border-green-600': mode === 'obtenues' }"
          >
            Aides Obtenues
          </li>
        </ul>

        <div class="md:hidden mb-6">
          <select v-model="mode" class="w-full p-3 rounded-xl border border-Bleu text-Bleu font-bold bg-white focus:outline-none focus:ring-2 focus:ring-Bleu">
            <option value="tout">Toutes les aides</option>
            <option value="aides">Mes aides recommandées</option>
            <option value="favoris">Mes favoris ({{ numberFavoris }})</option>
            <option value="obtenues">✅ Aides Obtenues</option>
          </select>
        </div>

        <div v-if="mode === 'favoris'">
          <div class="flex flex-col gap-6">
            <h1 class="font-bold text-lg font-agrandir-narrow mt-2 text-Bleu">
              Retrouvez vos aides mises en favoris
            </h1>
            <div>
              <CardAides
                v-if="favorisEnrichis.length"
                :aides="favorisEnrichis"
                @delete="handleLocalDelete"
              />

              <div v-else class="bg-gray-50 rounded-lg border border-Bleu/30 border-dashed p-8 text-center">
                <p class="text-gray-500">Aucun favori pour le moment. ❤️</p>
              </div>
            </div>
          </div>
        </div>

        <div v-if="mode === 'aides'">
          <div class="flex flex-col gap-6">
            <h1 class="font-bold text-lg font-agrandir-narrow mt-2 text-Bleu">
              Aides qui pourraient vous intéresser
            </h1>
            <div>
              <CardAides
                v-if="mesAidesEnrichies.length"
                :aides="mesAidesEnrichies"
                @delete="handleLocalDelete"
              />

              <div v-else class="bg-gray-50 rounded-lg border border-Bleu/30 border-dashed p-8 text-center">
                <p class="text-gray-500 mb-4">Nous n'avons pas encore trouvé d'aides pour vous.</p>
                <RouterLink 
                  to="/PageSimulation" 
                  class="inline-block px-6 py-2 bg-Bleu text-white rounded-lg font-bold hover:bg-blue-700 transition-colors"
                >
                  Lancer la simulation
                </RouterLink>
              </div>
            </div>
          </div>
        </div>

        <div v-if="mode === 'obtenues'">
          <div class="flex flex-col gap-6">
            <h1 class="font-bold text-lg font-agrandir-narrow mt-2 text-green-600 flex items-center gap-2">
              <span>🎉</span> Félicitations ! Vos aides complétées
            </h1>
            <div>
              <CardAides
                v-if="aidesObtenuesEnrichies.length"
                :aides="aidesObtenuesEnrichies"
                @delete="handleLocalDelete"
              />

              <div v-else class="bg-green-50 rounded-lg border border-green-200 border-dashed p-8 text-center">
                <p class="text-green-800 font-medium mb-2">Vous n'avez pas encore terminé de démarche.</p>
                <p class="text-sm text-green-600">
                  Pour obtenir une aide, cliquez sur une carte, suivez les instructions et cochez toutes les étapes !
                </p>
              </div>
            </div>
          </div>
        </div>

        <div v-if="mode === 'tout'">
           <TestFiltre class="mt-2" />
        </div>

      </div>
    </div>
  </LayoutDefault>
</template>