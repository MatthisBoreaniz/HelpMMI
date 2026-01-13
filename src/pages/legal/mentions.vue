<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <LayoutDefault>
    <div class="max-w-6xl mx-auto p-6 grid grid-cols-1 md:grid-cols-[3fr_1fr] gap-6 text-gray-800 rounded-md">

      <!-- Contenu principal -->
      <div>
        <h1 class="text-2xl font-semibold mb-6 text-Bleu">Mentions légales</h1>

        <div class="mt-8 md:hidden py-5">
          <label for="legal-summary" class="block mb-2 text-sm font-medium text-gray-700">Sommaire</label>
          <div class="relative">
            <select
              id="legal-summary"
              v-model="currentSection"
              @change="scrollToSection(currentSection)"
              aria-label="Sommaire des mentions légales"
              class="w-full border border-gray-300 rounded-md p-2 pr-10 bg-white appearance-none text-gray-700 focus:outline-none focus:ring-2 focus:ring-Bleu focus:border-Bleu transition"
            >
              <option v-for="(section, index) in sections" :key="index" :value="index">
                {{ section.title }}
              </option>
            </select>
            <span class="pointer-events-none absolute inset-y-0 right-2 flex items-center text-gray-500">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </span>
          </div>
        </div>
        <section v-for="(section, index) in sections" :key="index" :id="`section-${index}`" class="space-y-4">
          <h2 class="text-lg font-medium text-Bleu">{{ section.title }}</h2>
          <p v-for="(p, i) in section.content" :key="i">{{ p }}</p>
        </section>

        <!-- Sommaire mobile (en bas) -->
      </div>

      <nav class="hidden md:block sticky top-6" aria-label="Sommaire des mentions légales">
        <ul class="space-y-2">
          <li v-for="(section, index) in sections" :key="index">
            <button
              @click="scrollToSection(index)"
              class="text-left w-full px-3 py-1 rounded-md border transition-colors"
              :class="currentSection === index ? 'bg-Bleu text-white border-Bleu' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'"
              :aria-current="currentSection === index ? 'page' : undefined"
            >
              {{ section.title }}
            </button>
          </li>
        </ul>
      </nav>

    </div>
  </LayoutDefault>
</template>

<script setup lang="ts">
import LayoutDefault from '@/layouts/LayoutDefault.vue'
import { ref, onMounted, onUnmounted } from 'vue'

interface Section {
  title: string
  content: string[]
}

const sections: Section[] = [
  {
    title: 'Éditeur du site',
    content: [
      'Dénomination sociale : HELPMMI SARL',
      'Forme juridique : Société à Responsabilité Limitée au capital social de 1 000 €'
    ]
  },
  {
    title: 'Siège et contact',
    content: [
      'Siège social : 12 Rue des Étudiants, 75000 Paris',
      'Numéro d’immatriculation : RCS Paris n° 123 456 789',
      'Numéro de TVA intracommunautaire : FR12 123456789',
      'Email de contact : contact@helpmmi.fr',
      'Représentant légal : Alexandre Dupont'
    ]
  },
  {
    title: 'Hébergement',
    content: [
      'Le site est hébergé par Infomaniak Network SA, Rue Eugène-Marziano 25, 1227 Genève, Suisse',
      'Site web : https://www.infomaniak.com'
    ]
  },
  {
    title: 'Propriété intellectuelle',
    content: [
      'Tous les contenus présents sur le site HELPMMI (textes, images, illustrations, logos, bases de données, structure du site, etc.) sont la propriété exclusive de HELPMMI SARL.',
      'Toute reproduction ou exploitation sans autorisation écrite est interdite et constitue une contrefaçon sanctionnée par les articles L.335-2 et suivants du Code de la propriété intellectuelle.'
    ]
  }
]

const currentSection = ref<number>(0)

function scrollToSection(index: number) {
  const el = document.getElementById(`section-${index}`)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    currentSection.value = index
  }
}

function onScroll() {
  for (let i = sections.length - 1; i >= 0; i--) {
    const el = document.getElementById(`section-${i}`)
    if (el && window.scrollY + 100 >= el.offsetTop) {
      currentSection.value = i
      break
    }
  }
}

onMounted(() => window.addEventListener('scroll', onScroll))
onUnmounted(() => window.removeEventListener('scroll', onScroll))
onMounted(async () => {
  await ensureAuthReady()
})

import useAuth from '@/composables/useAuth'
const { ensureAuthReady } = useAuth()
</script>
