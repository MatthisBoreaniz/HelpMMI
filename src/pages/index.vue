<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import CardAides from '@/components/CardAides.vue'
import { RouterLink } from 'vue-router'
import useAuth from '@/composables/useAuth'
import { pb } from '@/backend'
import AideFinder from '@/components/aideFinder.vue'

const { currentUser } = useAuth()

const aides = await pb.collection('Aides').getFullList()


</script>

<template>
  <section class="text-red-500">
    <h1 class="">Welcome to HelpMMI</h1>
    <p class="">
      This is the homepage of the HelpMMI application. Use the navigation to explore different
      features and sections of the app.
    </p>
  </section>
  <RouterLink to="/MesAides" class=""> Go to About Page </RouterLink>
  <RouterLink to="/authPage" class=""> Go to Connexion</RouterLink>
  <div class="mt-8">
    <div v-if="currentUser">
      <h2 class="mt-8 text-2xl font-bold">Vos favoris :</h2>
      <CardAides
        v-if="currentUser.expand?.relFavoris?.length"
        :aides="currentUser.expand.relFavoris"
      />
      <p v-else>Aucun favori pour le moment.</p>
    </div>

    <!-- Liste complète des aides -->
    <h2 class="mt-8 text-2xl font-bold">Toutes les aides :</h2>
    <CardAides :aides="aides" />
  </div>
  <h2>FAQ</h2>
  <AideFinder />

</template>
