<script setup lang="ts">
import { ref } from 'vue'
import { pb } from '@/backend'
import CardAides from '@/components/CardAides.vue'
import ImgPb from '@/components/ImgPb.vue'

import type { AidesResponse, CategoriesResponse } from '@/pocketbase-types'

// Dropdown state
const showSelect = ref(false)
const toggleSelect = () => {
  showSelect.value = !showSelect.value
}

// Data
const aides = ref<AidesResponse<{ relCategories: CategoriesResponse }>[]>([])
const categories = ref<CategoriesResponse[]>([])
const selectedCategory = ref<string | null>(null)

// Fetch data
const fetchAllAides = async () => {
  aides.value = await pb.collection('Aides').getFullList({
    expand: 'relCategories',
  })
}
const fetchCategories = async () => {
  categories.value = await pb.collection('Categories').getFullList()
}

await fetchAllAides()
await fetchCategories()

// Filtrer par catégorie
const filtrerParCategorie = async (catId: string | null) => {
  selectedCategory.value = catId

  if (!catId) {
    await fetchAllAides()
    return
  }

  aides.value = await pb.collection('Aides').getFullList({
    filter: `relCategories.id ?= "${catId}"`,
    expand: 'relCategories',
  })
}

// Icônes
const FiltreIcon = await pb.collection('LogosAndImages').getFirstListItem('nom="filtreIcone"')
const FiltreCross = await pb.collection('LogosAndImages').getFirstListItem('nom="crossFiltre"')
</script>

<template>
  <div class="relative">
    <!-- Dropdown Bouton -->
    <div class="relative inline-block mb-6">
      <button
        @click="toggleSelect"
        class="border border-Bleu py-3 px-4 rounded-xl text-Bleu flex items-center gap-3 hover:bg-Blanc hover:shadow-lg transition-all duration-300 focus:outline-none"
      >
        Catégories
          <ImgPb
            v-if="!showSelect && FiltreIcon.image"
            :record="FiltreIcon"
            :filename="FiltreIcon.image"
            class="w-6 h-6 object-cover rounded-lg "
          />
          <ImgPb
            v-if="showSelect && FiltreCross.image"
            :record="FiltreCross"
            :filename="FiltreCross.image"
            class="w-6 h-6 object-cover rounded-lg border-l-1"
          />

      </button>

      <!-- Dropdown menu -->
      <transition
        enter-active-class="transition-all duration-300"
        enter-from-class="opacity-0 max-h-0 translate-y-2"
        enter-to-class="opacity-100 max-h-96 translate-y-0"
        leave-active-class="transition-all duration-200"
        leave-from-class="opacity-100 max-h-96 translate-y-0"
        leave-to-class="opacity-0 max-h-0 translate-y-2"
      >
        <div
          v-show="showSelect"
          class="absolute left-0 mt-2 w-56 bg-white rounded-xl shadow-lg overflow-hidden z-50"
        >
          <ul class="flex flex-col">
            <li
              @click="filtrerParCategorie(null); showSelect=false"
              class="px-4 py-3 cursor-pointer hover:bg-indigo-100 transition-colors"
            >
              Toutes les Catégories
            </li>
            <li
              v-for="cat in categories"
              :key="cat.id"
              @click="filtrerParCategorie(cat.id); showSelect=false"
              class="px-4 py-3 cursor-pointer hover:bg-indigo-100 transition-colors"
            >
              {{ cat.nom }}
            </li>
          </ul>
        </div>
      </transition>
    </div>

    <!-- Cartes Aides -->
    <CardAides :aides="aides" />
  </div>
</template>
