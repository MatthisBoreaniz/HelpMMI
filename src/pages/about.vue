<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { AidesResponse } from '@/pocketbase-types';
import { pb } from '@/backend';
import useAuth from '@/composables/useAuth';
import CardAides from '@/components/CardAides.vue';

const { currentUser } = useAuth();
const aides = ref<AidesResponse[]>([]);

onMounted(async () => {
  try {
    aides.value = await pb.collection('Aides').getFullList()
  } catch (err) {
    console.error('Erreur récupération aides:', err)
  }
})

</script>

<template>
  <div v-if="currentUser" class="flex flex-col items-center justify-center m-10 gap-6">
    <h1 class="font-bold">Mes favoris</h1>
     <div v-if="currentUser">
        <h2 class="mt-8 text-2xl font-bold">Vos favoris :</h2>
        <CardAides
          v-if="currentUser.expand?.relFavoris?.length"
          :aides="currentUser.expand.relFavoris"
        />
        <p v-else>Aucun favori pour le moment.</p>
      </div>
  </div>

</template>
