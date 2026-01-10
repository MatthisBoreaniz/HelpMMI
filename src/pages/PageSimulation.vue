<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { pb } from '@/backend'
import useAuth from '@/composables/useAuth'
import { trouverAidesEligibles, type AideConditions } from '@/utils/matching'
import type { 
  QuestionsResponse, 
  AidesResponse, 
  UsersResponse 
} from '@/pocketbase-types'
import LayoutDefault from '@/layouts/LayoutDefault.vue'

// --- 1. TYPAGE STRICT ---

type QuestionOption = { 
  label: string; 
  value: string | boolean | number 
}[];

// Extension locale du User
type UserWithReponses = UsersResponse & {
  reponses?: Record<string, any>
  mes_aides?: string[] // On ajoute ce champ pour vérifier s'il a déjà des aides
}

const router = useRouter()
const { currentUser, refreshUser } = useAuth()

// --- 2. ÉTAT ---
const loading = ref(true)
const calculating = ref(false)
const showResetPrompt = ref(false) // <--- NOUVEL ÉTAT POUR L'ALERTE

const questions = ref<QuestionsResponse<QuestionOption>[]>([]);
const userResponses = ref<Record<string, any>>({})

const categories = ['A', 'B', 'C', 'D', 'E']
const currentCategoryIndex = ref(0)

// --- 3. CHARGEMENT ---
onMounted(async () => {
  try {
    const resQuestions = await pb.collection('Questions').getFullList<QuestionsResponse<QuestionOption>>({
      sort: 'categorie',
    })
    questions.value = resQuestions

    const user = currentUser.value as unknown as UserWithReponses | null
    
    // LOGIQUE DE DÉTECTION : A-t-il déjà des aides ?
    if (user?.mes_aides && user.mes_aides.length > 0) {
      showResetPrompt.value = true // On affiche l'alerte
    } 
    
    // On pré-remplit quand même les réponses au cas où il veut juste modifier
    if (user?.reponses) {
      userResponses.value = { ...user.reponses }
    }

  } catch (e) {
    console.error('Erreur chargement', e)
  } finally {
    loading.value = false
  }
})

// --- ACTIONS DE L'ALERTE ---
const confirmRestart = () => {
  // L'utilisateur accepte de refaire
  showResetPrompt.value = false
  // Optionnel : Si tu veux vraiment qu'il reparte de zéro, décommente la ligne suivante :
  // userResponses.value = {} 
  window.scrollTo(0, 0)
}

const cancelRestart = () => {
  // L'utilisateur annule, on le renvoie vers ses résultats
  router.push('/MesAides')
}

// --- 4. LOGIQUE D'AFFICHAGE ---
const currentQuestions = computed(() => {
  const catLettre = categories[currentCategoryIndex.value]
  return questions.value.filter((q) => q.categorie && catLettre && q.categorie.startsWith(catLettre))
})

// Navigation
const nextStep = () => {
  if (currentCategoryIndex.value < categories.length - 1) {
    currentCategoryIndex.value++
    window.scrollTo(0, 0)
    saveProgress()
  } else {
    finishSimulation()
  }
}

const prevStep = () => {
  if (currentCategoryIndex.value > 0) {
    currentCategoryIndex.value--
    window.scrollTo(0, 0)
  }
}

const saveProgress = async () => {
  if (currentUser.value) {
    await pb.collection('users').update(currentUser.value.id, {
      reponses: userResponses.value
    })
  }
}

// --- 5. CALCUL FINAL ---
const finishSimulation = async () => {
  calculating.value = true
  try {
    await saveProgress()

    const allAides = await pb.collection('Aides').getFullList<AidesResponse<AideConditions>>({
      fields: 'id,Conditions' 
    })

    const aidesGagnantes = trouverAidesEligibles(allAides, userResponses.value)
    const idsAides = aidesGagnantes.map(a => a.id)
    console.log(`Résultat : ${idsAides.length} aides éligibles`)

    if (currentUser.value) {
      await pb.collection('users').update(currentUser.value.id, {
        mes_aides: idsAides
      })
      await refreshUser()
    }

    router.push('/MesAides') 

  } catch (err) {
    console.error("Erreur calcul :", err)
  } finally {
    calculating.value = false
  }
}
</script>

<template>
  <LayoutDefault>
      <div class="max-w-2xl mx-auto px-4 py-8">
      
        <div v-if="loading" class="text-center py-10 text-Bleu">
          Chargement...
        </div>
        <div v-else>
      
          <div v-if="showResetPrompt" class="bg-white p-8 rounded-xl shadow-lg border-2 border-Rose text-center">
            <div class="mb-6 flex justify-center">
              <span class="text-5xl">⚠️</span>
            </div>
      
            <h2 class="text-2xl font-bold text-Bleu mb-4 font-agrandir-narrow">
              Vous avez déjà fait une simulation
            </h2>
      
            <p class="text-gray-600 mb-8 text-lg">
              Attention, si vous relancez la simulation maintenant,
              <span class="font-bold text-Rose">vos aides recommandées actuelles seront remplacées</span>
              par les nouveaux résultats à la fin du questionnaire.
            </p>
      
            <div class="flex flex-col md:flex-row gap-4 justify-center">
              <button
                @click="cancelRestart"
                class="px-6 py-3 rounded-lg border-2 border-Bleu text-Bleu font-bold hover:bg-blue-50 transition-colors"
              >
                Annuler (Voir mes aides)
              </button>
      
              <button
                @click="confirmRestart"
                class="px-6 py-3 rounded-lg bg-Rose text-white font-bold hover:bg-pink-600 shadow-md transition-colors"
              >
                Refaire la simulation
              </button>
            </div>
          </div>
          <div v-else>
            <div class="mb-8">
              <div class="text-sm font-bold text-Bleu mb-2">
                Étape {{ currentCategoryIndex + 1 }} / {{ categories.length }}
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  class="bg-Bleu h-2.5 rounded-full transition-all duration-300"
                  :style="{ width: ((currentCategoryIndex + 1) / categories.length) * 100 + '%' }"
                ></div>
              </div>
            </div>
            <div class="space-y-8 min-h-[400px]">
              <div v-for="q in currentQuestions" :key="q.id" class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 class="text-lg font-semibold text-Bleu mb-4">{{ q.question }}</h3>
      
                <div class="flex flex-wrap gap-3">
                  <template v-if="q.options">
                    <button
                      v-for="opt in q.options"
                      :key="opt.label"
                      @click="q.slug && (userResponses[q.slug] = opt.value)"
                      class="px-4 py-2 rounded-lg border transition-all duration-200 text-sm font-medium"
                      :class="[
                        q.slug && userResponses[q.slug] === opt.value
                          ? 'bg-Bleu text-white border-Bleu shadow-md'
                          : 'bg-white text-gray-700 border-gray-300 hover:border-Bleu hover:bg-blue-50'
                      ]"
                    >
                      {{ opt.label }}
                    </button>
                  </template>
                </div>
              </div>
              <div v-if="currentQuestions.length === 0" class="text-gray-500 italic text-center">
                Cliquez sur suivant pour continuer.
              </div>
            </div>
            <div class="flex justify-between mt-10 pt-6 border-t">
              <button
                @click="prevStep"
                :disabled="currentCategoryIndex === 0"
                class="px-6 py-2 rounded-lg text-gray-600 hover:bg-gray-100 disabled:opacity-30"
              >
                ← Retour
              </button>
              <button
                v-if="currentCategoryIndex < categories.length - 1"
                @click="nextStep"
                class="px-6 py-2 rounded-lg bg-Bleu text-white hover:bg-blue-700 transition-colors shadow-lg"
              >
                Suivant →
              </button>
              <button
                v-else
                @click="finishSimulation"
                :disabled="calculating"
                class="px-6 py-2 rounded-lg bg-Rose text-white hover:bg-pink-600 transition-colors shadow-lg flex items-center gap-2"
              >
                <span v-if="calculating">Calcul...</span>
                <span v-else>Voir mes résultats 🎉</span>
              </button>
            </div>
          </div>
      
        </div>
      </div>
  </LayoutDefault>
</template>