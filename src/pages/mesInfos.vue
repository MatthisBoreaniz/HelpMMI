<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { pb } from '@/backend'
import useAuth from '@/composables/useAuth'
import type { AidesResponse, CategoriesResponse, QuestionsResponse } from '@/pocketbase-types'
import LayoutDefault from '@/layouts/LayoutDefault.vue'
import { watch } from 'vue'
import CardAides from '@/components/CardAides.vue'


type QuestionOption = {
  label: string
  value: string | number | boolean
}

type QuestionResponseWithOptions = QuestionsResponse<QuestionOption[]>

type AideEnrichie = AidesResponse<{
  relCategories: CategoriesResponse
}> & {
  expand: {
    relCategories: CategoriesResponse
  }
}

const aidesEnrichies = ref<AideEnrichie[]>([])
const loadingAides = ref(false)

const { currentUser, ensureAuthReady } = useAuth()
onMounted(async () => {
  await ensureAuthReady()
})
const questions = ref<QuestionResponseWithOptions[]>([])
const loading = ref(true)

onMounted(async () => {
  try {
    // On force le typage du JSON options ici
    questions.value = await pb.collection('Questions').getFullList<QuestionResponseWithOptions>({
      sort: 'categorie',
    })
  } catch (e) {
    console.error("Erreur chargement questions", e)
  } finally {
    loading.value = false
  }
})
type UserReponses = Record<string, string | number | boolean>

type UserWithReponses = UserReponses & { reponses?: Record<string, string | number | boolean> }
const displayableResponses = computed(() => {
  const user = currentUser.value as UserWithReponses | null
  if (!user) return []

  const userRep = user.reponses ?? {}

  return questions.value
    .map((q) => {
      if (!q.slug) return null

      const rawValue = userRep[q.slug]
      if (rawValue === undefined || rawValue === null) return null

      const foundOption = q.options?.find(
        (opt) => opt.value === rawValue
      )

      return {
        id: q.id,
        question: q.question,
        categorie: q.categorie,
        reponseLabel: foundOption
          ? foundOption.label
          : String(rawValue),
      }
    })
    .filter(Boolean)
})

const loadAidesEnrichies = async () => {
  if (!currentUser.value?.mes_aides?.length) {
    aidesEnrichies.value = []
    return
  }

  loadingAides.value = true

  const filter = currentUser.value.mes_aides
    .map(id => `id="${id}"`)
    .join(' || ')

  try {
    aidesEnrichies.value = await pb
      .collection('Aides')
      .getFullList<AideEnrichie>({
        filter,
        expand: 'relCategories',
        requestKey: null,
      })
  } catch (e) {
    console.error('Erreur chargement aides enrichies', e)
  } finally {
    loadingAides.value = false
  }
}

watch(
  () => currentUser.value?.mes_aides,
  () => loadAidesEnrichies(),
  { immediate: true }
)

</script>

<template>
  <LayoutDefault>
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-xl font-agrandir-narrow font-bold text-Bleu">
            Mon Profil Simulé
          </h2>
          <RouterLink
            to="/PageSimulation"
            class="text-xs sm:text-sm font-bold text-Rose border border-Rose px-3 py-1 rounded-full hover:bg-Rose hover:text-white transition-colors"
          >
            Modifier
          </RouterLink>
        </div>
        <div v-if="loading" class="text-center text-gray-400 py-4 text-sm">
          Chargement...
        </div>
        <div v-else-if="displayableResponses.length === 0" class="text-center py-6 text-gray-500 text-sm">
          <p>Aucune information renseignée.</p>
          <RouterLink to="/PageSimulation" class="text-Bleu font-bold underline mt-2 block">
            Compléter mon profil
          </RouterLink>
        </div>
        <ul v-else class="space-y-3">
          <li
            v-for="item in displayableResponses"
            :key="item?.id"
            class="flex flex-col sm:flex-row sm:justify-between sm:items-center border-b border-gray-50 pb-2 last:border-0"
          >
            <span class="text-gray-500 text-sm font-medium mb-1 sm:mb-0 sm:mr-4">
              {{ item?.question }}
            </span>
            <span class="font-bold text-Bleu text-sm sm:text-base text-right">
              {{ item?.reponseLabel }}
            </span>
          </li>
        </ul>
      </div>

      <!-- Aides recommandées -->
<div v-if="aidesEnrichies.length" class="my-10 mx-5">
  <h3 class="text-lg md:text-xl font-bold text-Bleu mb-4">
    Aides recommandées selon votre profil
  </h3>

  <CardAides :aides="aidesEnrichies" />
</div>

<div v-else-if="!loadingAides" class="mt-10 text-sm text-gray-500">
  Aucune aide correspondante pour le moment.
</div>

<div v-if="loadingAides" class="mt-10 text-gray-400 text-sm">
  Chargement des aides...
</div>
    </LayoutDefault>
</template>