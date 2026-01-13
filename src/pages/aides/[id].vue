<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { pb } from '@/backend'
import ImgPb from '@/components/ImgPb.vue'
import { useRoute } from 'vue-router'
import LayoutDefault from '@/layouts/LayoutDefault.vue'
import type { AidesResponse, EtapesResponse } from '@/pocketbase-types'
import sanitizeHtml from 'sanitize-html'
import useAuth from '@/composables/useAuth' // <--- IMPORT AJOUTÉ

const route = useRoute('/aides/[id]')

// On récupère l'utilisateur
const { currentUser, refreshUser } = useAuth()

type AideAvecEtapes = AidesResponse & {
  expand: {
    Etapes_via_relAide: EtapesResponse[];
  }
};

const aide = await pb
  .collection('Aides')
  .getOne(route.params.id as string, {
    expand: 'Etapes_via_relAide',
  }) as unknown as AideAvecEtapes;

const stepIcon = await pb.collection('LogosAndImages').getFirstListItem('nom="stepIcon"')
const stepArrow = await pb.collection('LogosAndImages').getFirstListItem('nom="stepArrow"')

// --- LOGIQUE DE VALIDATION ---

// Vérifie si une étape est cochée
const isEtapeValidated = (etapeId: string) => {
  return currentUser.value?.etapes_validees?.includes(etapeId) || false
}

// Coche/Décoche une étape et vérifie si l'aide est complétée
const toggleEtape = async (etapeId: string) => {
  // Si pas connecté, on ne fait rien (ou rediriger vers login)
  if (!currentUser.value) return 

  let newEtapesValidees = [...(currentUser.value.etapes_validees || [])]
  let newAidesObtenues = [...(currentUser.value.aides_obtenues || [])]

  // 1. Bascule l'état de l'étape
  if (newEtapesValidees.includes(etapeId)) {
    newEtapesValidees = newEtapesValidees.filter(id => id !== etapeId)
  } else {
    newEtapesValidees.push(etapeId)
  }

  // 2. Vérifie si TOUTES les étapes de CETTE aide sont validées
  const stepsDeCetteAide = aide.expand?.Etapes_via_relAide || []
  
  // On regarde si chaque ID d'étape de l'aide est présent dans la liste des validées
  const isComplete = stepsDeCetteAide.length > 0 && stepsDeCetteAide.every(step => 
    newEtapesValidees.includes(step.id)
  )

  // 3. Gestion de l'aide obtenue
  if (isComplete) {
    if (!newAidesObtenues.includes(aide.id)) {
      newAidesObtenues.push(aide.id)
      // Tu peux ajouter un confetti ou une alerte ici !
    }
  } else {
    // Si on décoche une étape, on perd le statut "obtenue"
    if (newAidesObtenues.includes(aide.id)) {
      newAidesObtenues = newAidesObtenues.filter(id => id !== aide.id)
    }
  }

  // 4. Sauvegarde dans PocketBase
  try {
    await pb.collection('users').update(currentUser.value.id, {
      etapes_validees: newEtapesValidees,
      aides_obtenues: newAidesObtenues
    })
    await refreshUser() // Mise à jour locale
  } catch (err) {
    console.error("Erreur sauvegarde étape", err)
  }
}
</script>

<template>
<LayoutDefault>
  <div class="space-y-6 p-4 mx-auto px-4">

    <div class="relative w-full rounded-2xl shadow-md overflow-hidden bg-Bleu  transition-transform">
      <div
        class="absolute inset-0 bg-Bleu/70 backdrop-blur-sm mix-blend-multiply transition-colors duration-300"
        :style="aide.imageCard ? {
          backgroundImage: `url('${pb.getFileUrl(aide, aide.imageCard)}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        } : {}"
      ></div>
      
      <div v-if="currentUser?.aides_obtenues?.includes(aide.id)" class="absolute top-2 right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full z-20 shadow-md animate-pulse">
        COMPLÉTÉE 🎉
      </div>

      <div class="relative px-4 py-4 text-center">
        <h2 class="text-white font-permanent-marker text-lg sm:text-xl md:text-2xl">
          {{ aide.nom }}
        </h2>
      </div>
    </div>

    <section class="w-full space-y-2">
      <h2 class="inline-block bg-Bleu text-white font-permanent-marker text-lg rounded-2xl px-3 py-2">
        Découvrir
      </h2>
      <div class="overflow-x-auto">
        <div class="max-w-full break-words [&_img]:max-w-full [&_img]:h-auto [&_img]:mx-auto [&_iframe]:w-full [&_iframe]:aspect-video [&_iframe]:block [&_table]:w-full [&_table]:table-auto p-3 bg-white shadow-sm rounded-xl text-gray-600 text-sm">
          <div v-html="sanitizeHtml(aide.Description)"></div>
        </div>
      </div>
    </section>

    <section v-if="aide.Astuce" class="w-full space-y-2">
      <h2 class="inline-block bg-Bleu-clair text-white font-permanent-marker text-lg rounded-2xl px-3 py-2">
        Astuce
      </h2>
      <div class="overflow-x-auto">
        <div class="max-w-full break-words [&_img]:max-w-full [&_img]:h-auto [&_img]:mx-auto [&_iframe]:w-full [&_iframe]:aspect-video [&_iframe]:block [&_table]:w-full [&_table]:table-auto p-3 border-2 border-Bleu-clair border-dashed rounded-xl bg-white shadow-sm text-gray-600 text-sm">
          <div v-html="sanitizeHtml(aide.Astuce)"></div>
        </div>
      </div>
    </section>

    <section class="w-full space-y-2">
      <h2 class="inline-block bg-Rose text-white font-permanent-marker text-lg rounded-2xl px-3 py-2">
        ÉTAPES À SUIVRE
      </h2>
      
      <div v-if="currentUser" class="text-xs text-gray-500 text-right mb-1">
        Cliquez sur les ronds pour valider les étapes
      </div>

      <div class="border-2 border-Rose rounded-xl bg-white shadow-sm overflow-hidden">
        <details
          v-for="etape in (aide.expand?.Etapes_via_relAide || []).slice().sort((a,b)=> (Number(a.ordre)||0)-(Number(b.ordre)||0))"
          :key="etape.id"
          class="group border-b border-Rose last:border-0"
        >
          <summary class="flex items-center justify-between p-3 cursor-pointer list-none hover:bg-Rose/5 transition-colors gap-2">
            
            <div class="flex items-center gap-3 min-w-0">
              
              <div 
                @click.stop="toggleEtape(etape.id)"
                class="relative flex-shrink-0 w-8 h-8 flex items-center justify-center font-bold rounded-full overflow-hidden transition-all duration-300 border-2"
                :class="isEtapeValidated(etape.id) 
                  ? 'bg-green-500 border-green-500 text-white scale-110' 
                  : 'bg-Rose text-white border-Rose group-hover:scale-105'"
              >
                <svg v-if="isEtapeValidated(etape.id)" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path></svg>
                
                <span v-else class="z-10">{{ etape.ordre }}</span>

                <ImgPb v-if="stepIcon && !isEtapeValidated(etape.id)" :record="stepIcon" :filename="stepIcon.image" class="absolute inset-0 w-full h-full object-cover rounded-full opacity-50 mix-blend-multiply" />
              </div>

              <h3 
                class="font-bold text-sm break-words leading-tight transition-colors duration-300"
                :class="isEtapeValidated(etape.id) ? 'text-gray-400 line-through' : 'text-gray-800'"
              >
                {{ etape.titre }}
              </h3>
            </div>

            <div class="flex-shrink-0">
              <img v-if="stepArrow" :src="pb.getFileUrl(stepArrow, stepArrow.image)" alt="Flèche"
                   class="w-4 h-4 transform transition-transform duration-300 group-open:rotate-180" />
            </div>
          </summary>

          <div class="overflow-x-auto">
            <div class="max-w-full break-words [&_img]:max-w-full [&_img]:h-auto [&_img]:mx-auto [&_iframe]:w-full [&_iframe]:aspect-video [&_iframe]:block [&_table]:w-full [&_table]:table-auto p-3 text-gray-600 text-sm bg-gray-50/50">
              <div v-html="sanitizeHtml(etape.contenu)"></div>
              
              <div v-if="currentUser && !isEtapeValidated(etape.id)" class="mt-4 text-center">
                <button 
                  @click="toggleEtape(etape.id)"
                  class="text-xs bg-white border border-green-500 text-green-600 px-3 py-1 rounded-full hover:bg-green-50 transition-colors"
                >
                  Marquer cette étape comme faite
                </button>
              </div>
            </div>
          </div>
        </details>
      </div>
    </section>

    <section class="w-full space-y-2">
      <h2 class="inline-block bg-Rose text-white font-permanent-marker text-lg rounded-2xl px-3 py-2">
        Documents
      </h2>
      <div class="overflow-x-auto">
        <div class="max-w-full break-words [&_img]:max-w-full [&_img]:h-auto [&_img]:mx-auto [&_iframe]:w-full [&_iframe]:aspect-video [&_iframe]:block [&_table]:w-full [&_table]:table-auto p-3 border-2 border-Rose rounded-xl bg-white shadow-sm text-gray-600 text-sm">
          <div v-html="sanitizeHtml(aide.Document)"></div>
        </div>
      </div>
    </section>

    <section class="w-full space-y-2">
      <h2 class="inline-block bg-Bleu text-white font-permanent-marker text-lg rounded-2xl px-3 py-2">
        Adresses et contacts
      </h2>
      <div class="overflow-x-auto">
        <div class="max-w-full break-words [&_img]:max-w-full [&_img]:h-auto [&_img]:mx-auto [&_iframe]:w-full [&_iframe]:aspect-video [&_iframe]:block [&_table]:w-full [&_table]:table-auto p-3 border-2 border-Bleu rounded-xl bg-white shadow-sm text-gray-600 text-sm">
          <div v-html="sanitizeHtml(aide.Contact)"></div>
        </div>
      </div>
    </section>

  </div>
</LayoutDefault>
</template>