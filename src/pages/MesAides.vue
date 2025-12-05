<script setup lang="ts">
import { ref, computed } from 'vue'
import useAuth from '@/composables/useAuth'
import CardAides from '@/components/CardAides.vue'
import { pb } from '@/backend'
import LayoutDefault from '@/layouts/LayoutDefault.vue'
import type { AidesResponse, CategoriesResponse } from '@/pocketbase-types'

type AideFavorite = AidesResponse<{
  relCategories: CategoriesResponse
}>

const mode = ref<'aides' | 'favoris' | 'obtenues'>('aides')
const { currentUser, refreshUser } = useAuth()
const favorisEnrichis = ref<AideFavorite[]>([])

const numberFavoris = computed(() => currentUser.value?.expand?.relFavoris?.length || 0)

await refreshUser()

if (currentUser.value?.relFavoris?.length) {
  const promises = currentUser.value.relFavoris.map((favId: string) => 
    pb.collection('Aides').getOne<AideFavorite>(favId, { expand: 'relCategories' })
  )
  favorisEnrichis.value = await Promise.all(promises)
}

const handleLocalDelete = (idAide: string) => {
  favorisEnrichis.value = favorisEnrichis.value.filter(aide => aide.id !== idAide)
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
        <ul class="flex gap-4 text-gray-300 text-base md:text-xl">
          <li
            @click="mode = 'aides'"
            class="cursor-pointer"
            :class="{ 'text-Bleu font-bold': mode === 'aides' }"
          >
            Mes aides
          </li>
          <li
            @click="mode = 'favoris'"
            class="cursor-pointer"
            :class="{ 'text-Bleu font-bold': mode === 'favoris' }"
          >
            Mes favoris ({{ numberFavoris }})
          </li>
          <li
            @click="mode = 'obtenues'"
            class="cursor-pointer"
            :class="{ 'text-Bleu font-bold': mode === 'obtenues' }"
          >
            Aides Obtenues
          </li>
        </ul>

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
      </div>
    </div>
  </LayoutDefault>
</template>