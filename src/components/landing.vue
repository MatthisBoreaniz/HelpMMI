<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { onMounted } from 'vue'
import useAuth from '@/composables/useAuth'
import { RouterLink } from 'vue-router'
import ImgPb from './ImgPb.vue'
import { pb } from '@/backend'
import TestFiltreHome from '@/components/testFiltreHome.vue'
const imgAccueil = await pb.collection('LogosAndImages').getFirstListItem('nom="ImgAccueil"')
const { ensureAuthReady } = useAuth()

onMounted(async () => {
  await ensureAuthReady()
})
</script>

<template>
  <div class="lg:p-20 lg:pt-0 pt-0 p-10">
    <div
      class="relative h-[70vh] rounded-2xl bg-cover bg-center flex flex-col justify-center items-center text-white text-center px-4"
    >
      <div class="absolute h-full w-full z-10 bg-black/30 rounded-2xl"></div>
      <ImgPb
        v-if="imgAccueil"
        :record="imgAccueil"
        :filename="imgAccueil.image"
        class="absolute inset-0 rounded-2xl w-full h-full object-cover"
      />
      <section class="flex flex-col justify-center items-center relative z-20">
        <h1 class="font-permanent-marker text-2xl md:text-4xl mb-4">
          Parce qu'être étudiant c'est déjà un sport
        </h1>
        <p class="font-agrandir text-lg md:text-xl max-w-2xl">
          HelpMMI est un site internet qui regroupe un ensemble d'aide étudiante et facilite la
          recherche d'aide pour les étudiantes dans le but de réduire leur stress.
        </p>
        <button class="m-10">
          <RouterLink
            to="/authPage"
            class="mt-6 bg-Blanc text-black font-bold py-3 px-6 rounded-full hover:bg-gray-200 transition"
            >s'inscrire / se connecter
          </RouterLink>
        </button>
      </section>
    </div>

    <div class="my-10">
      <h2 class="uppercase font-permanent-marker text-Rose text-2xl mb-3 md:mb-5">
        Explorer les différentes aides
      </h2>
      <TestFiltreHome />
    </div>
    <div class="my-10">
      <h2 class="uppercase font-permanent-marker text-Rose text-2xl mb-3 md:mb-5">
        Ce que nous vous proposons
      </h2>
    <div class="grid md:grid-cols-3 gap-6">
      <div
        class="bg-Bleu text-white rounded-2xl overflow-hidden flex flex-col justify-between space-y-3 p-10 md:px-16 md:pt-10 md:pb-10 hover:scale-105 transition-transform duration-300 h-full"
      >
        <div>
        <div class="flex justify-start">
          <img
            src="/src/assets/Icones/MascotteChat-landingPage.svg"
            alt="Icon Simulation"
            class="h-16 mb-4"
          />
        </div>

        <h3
          class="text-lg md:text-xl font-permanent-marker leading-tight break-words line-clamp-2"
        >
          Accompagnement par l'IA
        </h3>

        <p class="mt-2 text-xs md:text-sm font-agrandir">
          Trouvez les informations dont vous avez besoins. Ne restez pas seul. Grâce à notre
          chat interactif vous pourrez demander tout ce dont vous aurez besoin et éclaircir les
          incompréhension
        </p>
        </div>
      </div>
      <div
        class="bg-Bleu text-white rounded-2xl overflow-hidden flex flex-col justify-between space-y-3 p-10 md:px-16 md:pt-10 md:pb-10 hover:scale-105 transition-transform duration-300 h-full"
      >
        <div>
        <div class="flex justify-start">
          <img
            src="/src/assets/Icones/Mascotte-landingPage.svg"
            alt="Icon Simulation"
            class="h-16 mb-4"
          />
        </div>

        <h3
          class="text-lg md:text-xl font-permanent-marker leading-tight break-words line-clamp-2"
        >
          Favoris
        </h3>

        <p class="mt-2 text-xs md:text-sm font-agrandir">
          Gardez un œil sur les aides qui vous intéressent le plus ! En un clic, vous pouvez
          ajouter vos aides favorites pour les retrouver facilement plus tard. Cette
          fonctionnalité vous permet de planifier vos démarches et de ne rien oublier. Simple,
          rapide et pratique.
        </p>
        </div>
      </div>
      <div
        class="bg-Bleu text-white rounded-2xl overflow-hidden flex flex-col justify-between space-y-3 p-10 md:px-16 md:pt-10 md:pb-10 hover:scale-105 transition-transform duration-300 h-full"
      >
        <div>
        <div class="flex justify-start">
          <img
            src="/src/assets/Icones/MascotteSimu-landingPage.svg"
            alt="Icon Simulation"
            class="h-16 mb-4"
          />
        </div>

        <h3
          class="text-lg md:text-xl font-permanent-marker leading-tight break-words line-clamp-2"
        >
          Simulation
        </h3>

        <p class="mt-2 text-xs md:text-sm font-agrandir">
          Grâce à notre simulateur intuitif, découvrez en quelques minutes toutes les aides
          auxquelles vous pouvez prétendre. Il vous suffit de répondre à quelques questions pour
          obtenir une estimation personnalisée et fiable, adaptée à votre profil et à votre
          situation. Gagnez du temps et accédez directement aux dispositifs qui correspondent
          vraiment à vos besoins.
        </p>
        </div>
      </div>
    </div>
    </div>
  </div>
</template>
