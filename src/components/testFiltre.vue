<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { pb } from '@/backend'
import CardAides from '@/components/CardAides.vue'
import ImgPb from '@/components/ImgPb.vue'

import type { AidesResponse, CategoriesResponse } from '@/pocketbase-types'

// Dropdown state
const showSelect = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)

const toggleSelect = () => {
  showSelect.value = !showSelect.value
}

const closeDropdown = () => {
  showSelect.value = false
}

const handleClickOutside = (event: MouseEvent) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    closeDropdown()
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

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

const visibleCount = ref(3)

const showMore = () => {
  visibleCount.value += 3
} 

const showLess = () => {
  visibleCount.value -= 3;
  visibleCount.value -= 3;
  if (visibleCount.value < 3) visibleCount.value = 3;

  const el = document.getElementById('backScroll');
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  } else {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

}

const aidesAffichees = computed(() => {
  return aides.value.slice(0, visibleCount.value)
})
</script>

<template>
  <div class="relative">
    <!-- Dropdown Bouton -->
    <div class="relative mb-6 w-full flex justify-center" id="backScroll" ref="dropdownRef">
      <div class="flex justify-center">
      <button
        @click="toggleSelect"
        class="border mt-2 border-Bleu py-3 px-4 rounded-xl text-Bleu flex items-center gap-3 hover:bg-Blanc hover:shadow-lg transition-all duration-300 focus:outline-none"
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
      </div>

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
        class="absolute left-1/2 -translate-x-1/2 mt-2 w-56 bg-white rounded-xl shadow-lg overflow-hidden z-50"
      >
        <ul class="flex flex-col">
        <li
          @click="filtrerParCategorie(null); closeDropdown()"
          class="px-4 py-3 cursor-pointer hover:bg-indigo-100 transition-colors"
        >
          Toutes les Catégories
        </li>
        <li
          v-for="cat in categories"
          :key="cat.id"
          @click="filtrerParCategorie(cat.id); closeDropdown()"
          class="px-4 py-3 cursor-pointer hover:bg-indigo-100 transition-colors"
        >
          {{ cat.nom }}
        </li>
        </ul>
      </div>
      </transition>
    </div>

    <!-- Cartes Aides -->
    <CardAides :aides="aidesAffichees" />

    <!-- Boutons Voir Plus / Voir Moins -->
    <div class="flex justify-center mt-6 space-x-4">
      <button
        v-if="visibleCount < aides.length"
        @click="showMore"
        class="bg-Bleu text-Blanc px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
      >
        Voir Plus
      </button>
      <button
        v-if="visibleCount > 3"
        @click="showLess"
        class="bg-Bleu text-Blanc px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
      >
        Voir Moins
      </button>
    </div>
  </div>
</template>
