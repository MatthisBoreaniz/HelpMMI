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
    <div class="grid gap-4 p-4 sm:grid-cols-2 lg:grid-cols-3">
      <div
        v-for="uneAide in listeAides"
        :key="uneAide.id"
        class="p-4 border border-Rose/30 rounded-2xl shadow-sm bg-white hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
      >
        <!-- Titre -->
        <h2 class="text-lg font-bold text-Rose mb-2 line-clamp-2">
          {{ uneAide.nom }}
        </h2>

        <!-- Contact -->
        <div class="bg-Rose/10 rounded-xl p-2 mb-3 break-words">
          <p class="text-gray-800 font-medium break-words break-all">
            <span class="break-words break-all" v-html="uneAide.Contact"></span>
          </p>
        </div>

        <!-- Bouton -->
        <RouterLink
          :to="`/aides/${uneAide.id}`"
          class="inline-flex justify-center items-center w-full bg-Bleu text-white p-3 rounded-xl hover:bg-Rose transition duration-200 font-semibold"
        >
          Voir les détails
        </RouterLink>
      </div>
    </div>
  </LayoutDefault>
</template>
