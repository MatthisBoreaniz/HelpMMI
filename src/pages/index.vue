<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import CardAides from '@/components/CardAides.vue'
import { RouterLink } from 'vue-router'
import { pb } from '@/backend'
import AideFinder from '@/components/aideFinder.vue'
import { ref, watch, onMounted } from 'vue'
import type { AidesResponse } from '@/pocketbase-types'
import TestFiltre from '@/components/testFiltre.vue'
import LayoutDefault from '@/layouts/LayoutDefault.vue'
import useAuth from '@/composables/useAuth'

type Aide = AidesResponse




// --- Recherche ---
const searchQuery = ref('')
const lesAides = ref<Aide[]>([])
let debounceTimeout: ReturnType<typeof setTimeout>
const isLoading = ref(false)

const lancerRecherche = async () => {
  lesAides.value = []

  if (!searchQuery.value.trim()) return

  isLoading.value = true
  try {
    const result = await pb.collection('Aides').getList(1, 40, {
      filter: `nom ~ "${searchQuery.value}"`,
      sort: '-created',
    })
    lesAides.value = result.items
  } catch (error) {
    console.error('Erreur lors de la recherche PocketBase :', error)
  } finally {
    isLoading.value = false
  }
}

watch(searchQuery, () => {
  clearTimeout(debounceTimeout)
  debounceTimeout = setTimeout(() => {
    lancerRecherche()
  }, 300)
})

// --- Auth utilisateur ---
const { currentUser, refreshUser } = useAuth()

// On rafraîchit le user au montage
onMounted(async () => {
  try {
    await refreshUser()
  } catch (err) {
    console.warn('refreshUser échoué:', err)
  }
})

// --- Toggle Favoris compatible iOS/Android ---
const favoriteAides = ref<any[]>([])

watch(currentUser, () => {
  favoriteAides.value = currentUser.value?.expand?.relFavoris ?? []
})

const isFavorite = (aideId: string) =>
  favoriteAides.value.some(f => f.id === aideId)

const toggleFavorite = async (aideId: string) => {
  if (!currentUser.value) return

  const currentIds = currentUser.value.relFavoris ?? []
  const isFav = currentIds.includes(aideId)

  // Mise à jour locale immédiate
  if (isFav) {
    favoriteAides.value = favoriteAides.value.filter(f => f.id !== aideId)
  } else {
    favoriteAides.value.push({ id: aideId })
  }

  const newIds = isFav
    ? currentIds.filter(id => id !== aideId)
    : [...currentIds, aideId]

  try {
    await pb.collection('users').update(currentUser.value.id, {
      relFavoris: newIds,
    })

    try {
      await refreshUser()
    } catch (err: any) {
      if (err?.message?.includes('autocancelled')) {
        console.warn('refreshUser autocancelled, ignoré')
      } else {
        console.error('Erreur refreshUser:', err)
      }
    }
  } catch (err) {
    console.error('Erreur gestion favoris:', err)
    // rollback local
    favoriteAides.value = isFav
      ? [...favoriteAides.value, { id: aideId }]
      : favoriteAides.value.filter(f => f.id !== aideId)
  }
}
</script>

<template>
  <LayoutDefault>
    <div class="p-6 pt-0">
      <section class="rounded-2xl bg-Bleu text-Blanc lg:mr-4 my-4 p-6 ml-0">
        <div class="flex flex-col justify-center items-center text-center mb-6">
          <img
            src="/src/assets/Img/helpMMi.png"
            alt="HelpMMI Logo"
            class="h-48 md:h-80 mb-4 object-contain"
          />
          <h2 class="font-permanent-marker text-3xl mb-2">VOTRE ESPACE</h2>
          <p class="font-agrandir-narrow text-xl leading-snug max-w-lg">
            Un seul endroit pour comprendre, préparer et demander vos aides.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 w-full">
          <RouterLink
            to="/authPage"
            class="bg-Blanc text-Bleu font-bold font-permanent-marker text-lg md:text-sm rounded-2xl p-4 md:p-6 lg:p-4 flex items-center justify-center hover:scale-105 transition-transform duration-300 shadow-md min-h-[80px] md:min-h-[200px]"
          >PROFIL</RouterLink>
          <RouterLink
            to="/MesAides"
            class="bg-Blanc text-Bleu font-bold font-permanent-marker text-lg md:text-sm rounded-2xl p-4 md:p-6 lg:p-4 flex items-center justify-center hover:scale-105 transition-transform duration-300 shadow-md min-h-[80px] md:min-h-[200px]"
          >MES AIDES</RouterLink>
          <RouterLink
            to="/simulation"
            class="bg-Blanc text-Bleu font-bold font-permanent-marker text-lg md:text-sm rounded-2xl p-4 md:p-6 lg:p-4 flex items-center justify-center hover:scale-105 transition-transform duration-300 shadow-md min-h-[80px] md:min-h-[200px]"
          >SIMULATION</RouterLink>
          <RouterLink
            to="/annuaire"
            class="bg-Blanc text-Bleu font-bold font-permanent-marker text-lg md:text-sm rounded-2xl p-4 md:p-6 lg:p-4 flex items-center justify-center hover:scale-105 transition-transform duration-300 shadow-md min-h-[80px] md:min-h-[200px]"
          >ANNUAIRE</RouterLink>
        </div>
      </section>

      <section>
        <h2 class="font-permanent-marker text-xl text-Bleu">RETROUVEZ TOUTES LES AIDES</h2>
        <div class="max-w-4xl">
          <div class="flex w-full mb-8 shadow-sm">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Rechercher une aide..."
              class="flex-grow p-3 pl-4 border-2 border-r-0 border-Bleu rounded-l-xl bg-[#FFFEF5] text-Bleu placeholder-Bleu outline-none focus:ring-2 focus:ring-blue-500 transition-all font-agrandir"
            />
            <button
              @click="lancerRecherche"
              class="bg-Bleu hover:bg-Bleu text-white px-6 rounded-r-xl flex items-center justify-center transition-colors border-2 border-Bleu"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="2.5"
                stroke="currentColor"
                class="w-6 h-6"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                />
              </svg>
            </button>
          </div>

          <div class="space-y-6">
            <p
              v-if="lesAides.length === 0 && searchQuery"
              class="text-center text-Bleu font-permanent-marker"
            >
              Aucune aide trouvée pour "{{ searchQuery }}"
            </p>

            <div v-for="aide in lesAides" :key="aide.id" class="z-10 mb-10">
              <h3 class="font-permanent-marker text-xl text-Bleu mb-2 ml-2">
                {{ aide.nom }}
              </h3>
              <CardAides
                :aides="[aide as any]"
                :favoriteAides="favoriteAides"
                :isFavorite="isFavorite"
                :toggleFavorite="toggleFavorite"
              />
            </div>
          </div>
        </div>
      </section>

      <TestFiltre />
      <AideFinder class="z-50" />
    </div>
  </LayoutDefault>
</template>
