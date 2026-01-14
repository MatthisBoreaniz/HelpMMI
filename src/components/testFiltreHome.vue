<script setup lang="ts">
import { computed, ref } from 'vue'
import { pb } from '@/backend'
import CardAides from '@/components/CardAides.vue'
// ImgPb n'est plus nécessaire car on a retiré le bouton avec les icônes
import type { AidesResponse, CategoriesResponse } from '@/pocketbase-types'

// --- 1. DÉFINITION DU TYPE STRICT ---
type AideAvecCategorie = AidesResponse & {
  expand: {
    relCategories: CategoriesResponse
  }
}

// Data
const aides = ref<AideAvecCategorie[]>([])
const categories = ref<CategoriesResponse[]>([])
const selectedCategory = ref<string | null>(null) // null = "Toutes les catégories"

// Fetch data
const fetchAllAides = async () => {
  const result = await pb.collection('Aides').getFullList({
    expand: 'relCategories',
    sort: '-created',
  })

  // --- FORCER LE TYPE ---
  aides.value = result as unknown as AideAvecCategorie[]
}

const fetchCategories = async () => {
  categories.value = await pb.collection('Categories').getFullList({
    sort: 'nom',
  })
}

// Initial fetch
await fetchAllAides()
await fetchCategories()

// Filtrer par catégorie
const filtrerParCategorie = async (catId: string | null) => {
  selectedCategory.value = catId
  // Réinitialiser le compteur de vue quand on change de filtre
  visibleCount.value = 3

  if (!catId) {
    await fetchAllAides()
    return
  }

  const result = await pb.collection('Aides').getFullList({
    filter: `relCategories.id ?= "${catId}"`,
    expand: 'relCategories',
    sort: '-created',
  })

  // --- FORCER LE TYPE ---
  aides.value = result as unknown as AideAvecCategorie[]
}

// Pagination
const visibleCount = ref(3)

const showMore = () => {
  visibleCount.value += 3
}

const showLess = () => {
  visibleCount.value -= 6
  if (visibleCount.value < 3) visibleCount.value = 3

  const el = document.getElementById('backScroll')
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  } else {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const aidesAffichees = computed(() => {
  return aides.value.slice(0, visibleCount.value)
})
</script>

<template>
<div class="relative w-full">

  <!-- Catégories -->
  <div
    id="backScroll"
    class="
      flex gap-2 sm:gap-3
      mb-6 sm:mb-8
      w-full
      px-2 sm:px-4
      overflow-x-auto sm:overflow-visible
      flex-nowrap sm:flex-wrap
      scrollbar-hide
    "
  >
    <button
      @click="filtrerParCategorie(null)"
      class="whitespace-nowrap px-4 sm:px-5 py-2 text-sm sm:text-base rounded-full border transition-all duration-300 font-medium"
      :class="[
        selectedCategory === null
          ? 'bg-Bleu text-white border-Bleu shadow-md'
          : 'bg-white text-Rose border-Rose hover:bg-blue-50',
      ]"
    >
      Toutes
    </button>

    <button
      v-for="cat in categories"
      :key="cat.id"
      @click="filtrerParCategorie(cat.id)"
      class="whitespace-nowrap px-4 sm:px-5 py-2 text-sm sm:text-base rounded-full border transition-all duration-300 font-medium"
      :class="[
        selectedCategory === cat.id
          ? 'bg-Bleu text-white border-Bleu shadow-md'
          : 'bg-white text-Rose border-Rose hover:bg-blue-50',
      ]"
    >
      {{ cat.nom }}
    </button>
  </div>

  <!-- Cards -->
  <CardAides :aides="aidesAffichees" />

  <!-- Actions -->
  <div
    class="
      flex flex-col sm:flex-row
      justify-center
      gap-3 sm:gap-4
      mt-6 sm:mt-8
      pb-6 sm:pb-8
      px-2 sm:px-4
    "
  >
    <button
      v-if="visibleCount < aides.length"
      @click="showMore"
      class="
        bg-Bleu text-Blanc
        px-6 py-2
        text-sm sm:text-base
        rounded-lg
        hover:bg-blue-700
        transition-colors
        shadow-md
        w-full sm:w-auto
      "
    >
      Voir plus
    </button>

    <button
      v-if="visibleCount > 3"
      @click="showLess"
      class="
        border border-Bleu text-Bleu
        px-6 py-2
        text-sm sm:text-base
        rounded-lg
        hover:bg-blue-50
        transition-colors
        w-full sm:w-auto
      "
    >
      Voir moins
    </button>
  </div>
</div>
</template>
