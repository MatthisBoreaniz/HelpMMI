<script setup lang="ts">
import { ref } from 'vue'
import { pb } from '@/backend'
import CardAides from '@/components/CardAides.vue'
import ImgPb from '@/components/ImgPb.vue'

import type { AidesResponse, CategoriesResponse } from '@/pocketbase-types'

const showSelect = ref(false)

const toggleSelect = () => {
  showSelect.value = !showSelect.value
}

const aides = ref<AidesResponse[]>([])
const categories = ref<CategoriesResponse[]>([])
const selectedCategory = ref<string | null>(null)

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

const filtrerParCategorie = async (catId: string | null) => {
  selectedCategory.value = catId

  if (!catId) {
    // Reset
    await fetchAllAides()
    return
  }

  aides.value = await pb.collection('Aides').getFullList({
    filter: `relCategories.id ?= "${catId}"`,
    expand: 'relCategories',
  })
}

const FiltreIcon = await pb.collection('LogosAndImages').getFirstListItem('nom="filtreIcone"')
const FiltreCross = await pb.collection('LogosAndImages').getFirstListItem('nom="crossFiltre"')
</script>

<template>
  <div>
    <div class="relative inline-block mb-6">
      <button
        @click="toggleSelect"
        class="border border-Bleu py-4 px-2 rounded-xl text-Bleu flex items-center gap-4 hover:bg-Blanc hover:shadow-lg"
      >
        Catégories
        <ImgPb
          v-if="FiltreIcon.image && !showSelect"
          :record="FiltreIcon"
          :filename="FiltreIcon.image"
          class="w-6 h-6 object-cover hover:border hover:border-Bleu rounded-lg"
        />
        <ImgPb
          v-if="FiltreCross.image && showSelect"
          :record="FiltreCross"
          :filename="FiltreCross.image"
          class="w-6 h-6 object-cover hover:border hover:border-Bleu rounded-lg"
        />
      </button>

      <!-- SELECT -->
      <div v-if="showSelect" class="absolute mt-2 w-56 z-50">
        <select
          v-model="selectedCategory"
          @change="filtrerParCategorie(selectedCategory)"
          class="w-full px-3 py-2 border rounded-lg bg-white shadow-lg cursor-pointer"
        >
          <option :value="null">Toutes les Catégories</option>
          <option v-for="cat in categories" :key="cat.id" :value="cat.id">
            {{ cat.nom }}
          </option>
        </select>
      </div>
    </div>

    <CardAides :aides="aides" />
  </div>
</template>
