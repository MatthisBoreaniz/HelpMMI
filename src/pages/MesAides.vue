<script setup lang="ts">
import { ref, computed, watch } from 'vue' // <-- 1. Import de watch
import useAuth from '@/composables/useAuth'
import CardAides from '@/components/CardAides.vue'
import { pb } from '@/backend'
import type { AidesResponse, CategoriesResponse } from '@/pocketbase-types'
import LayoutDefault from '@/layouts/LayoutDefault.vue'
import TestFiltre from '@/components/testFiltre.vue'

// Type strict
type AideFavorite = AidesResponse & {
  expand: {
    relCategories: CategoriesResponse
  }
}

const mode = ref<'tout' | 'aides' | 'favoris' | 'obtenues'>('aides')
const { currentUser, refreshUser } = useAuth()

// Listes de données
const favorisEnrichis = ref<AideFavorite[]>([])
const mesAidesEnrichies = ref<AideFavorite[]>([])
const aidesObtenuesEnrichies = ref<AideFavorite[]>([])

// 1. Récupération initiale de l'utilisateur
await refreshUser()

// --- FONCTIONS DE CHARGEMENT RÉUTILISABLES ---

// A. Charger les favoris
const loadFavoris = async () => {
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
  } else {
    favorisEnrichis.value = [] // Important : vider si plus de favoris
  }
}

// B. Charger mes aides (simulation)
const loadMesAides = async () => {
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
}

// C. Charger aides obtenues
const loadAidesObtenues = async () => {
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
  } else {
    aidesObtenuesEnrichies.value = []
  }
}

// --- INITIALISATION ---
// On lance les chargements une première fois
await Promise.all([loadFavoris(), loadMesAides(), loadAidesObtenues()])


// --- SURVEILLANCE (WATCHERS) ---
// C'est ici que la magie opère : si currentUser change, on recharge les listes

// 1. Si la liste des IDs favoris change, on recharge `favorisEnrichis`
watch(() => currentUser.value?.relFavoris, async () => {
  await loadFavoris()
}, { deep: true })

// 2. Si la liste des aides obtenues change, on recharge `aidesObtenuesEnrichies`
watch(() => currentUser.value?.aides_obtenues, async () => {
  await loadAidesObtenues()
}, { deep: true })


const numberFavoris = computed(() => currentUser.value?.relFavoris?.length || 0)

// Fonction de suppression locale
const handleLocalDelete = async (idAide: string) => {
  
  // 1. On retire toujours l'aide de la liste locale des favoris
  // (Car si on clique sur le cœur, ce n'est plus un favori)
  favorisEnrichis.value = favorisEnrichis.value.filter((aide) => aide.id !== idAide)

  // ⚠️ 2. IMPORTANT : ON NE TOUCHE PAS à 'mesAidesEnrichies' ni 'aidesObtenuesEnrichies'
  // Ce n'est pas parce qu'on retire une aide des favoris qu'elle n'est plus éligible !
  
  // 3. On rafraichit l'utilisateur pour que le cœur se mette à jour visuellement
  await refreshUser()
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
            <h1 v-if="currentUser?.expand.aides_obtenues" class="font-bold text-lg font-agrandir-narrow mt-2 text-green-600 flex items-center gap-2">
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