<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import LayoutDefault from '@/layouts/LayoutDefault.vue'
import { onMounted } from 'vue'
import useAuth from '@/composables/useAuth'
import { pb } from '@/backend'
const { ensureAuthReady } = useAuth()

onMounted(async () => {
  await ensureAuthReady()
})

const listeAides = await pb.collection('Aides').getFullList({
  sort: '-created',
})

</script>

<template>
  <LayoutDefault>
    <div class=" grid gap-6 sm:grid-cols-2 lg:grid-cols-3 p-10">
      <div
        v-for="uneAide in listeAides"
        :key="uneAide.id"
        class="p-6 border border-Rose/30 rounded-2xl shadow-sm bg-white hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
      >
        <!-- Titre -->
        <h2 class="text-xl font-bold text-Rose mb-3 line-clamp-2">
          {{ uneAide.nom }}
        </h2>

        <!-- Contact -->
        <div class="bg-Rose/10 rounded-xl p-3 mb-4 break-words">
          <p class="text-gray-800 font-medium">
            <span v-html="uneAide.Contact"></span>
          </p>
        </div>

        <!-- Bouton -->
        <RouterLink
          :to="`/aides/${uneAide.id}`"
          class="inline-flex justify-center items-center w-full bg-Bleu text-white p-4 rounded-xl hover:bg-Rose transition duration-200 font-semibold"
        >
          Voir les détails
        </RouterLink>
      </div>
    </div>
  </LayoutDefault>
</template>
