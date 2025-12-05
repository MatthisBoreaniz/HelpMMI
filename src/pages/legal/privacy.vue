<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <LayoutDefault>
    <div class="max-w-6xl mx-auto p-6 grid grid-cols-1 md:grid-cols-[3fr_1fr] gap-6 text-gray-800 rounded-md">

      <div>
        <h1 class="text-2xl font-semibold mb-6 text-Bleu">Politique de confidentialité</h1>

        <div class="mt-8 md:hidden py-5">
          <label for="privacy-summary" class="block mb-2 text-sm font-medium text-gray-700">Sommaire</label>
          <div class="relative">
            <select
              id="privacy-summary"
              v-model="currentSection"
              @change="scrollToSection(currentSection)"
              aria-label="Sommaire de la politique de confidentialité"
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

      </div>

      <nav class="hidden md:block sticky top-6" aria-label="Sommaire de la politique de confidentialité">
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
    title: 'Introduction',
    content: [
      'Le site HELPMMI respecte la vie privée de ses utilisateurs et s\'engage à protéger les données personnelles collectées conformément au Règlement Général sur la Protection des Données (RGPD) et à la loi française « Informatique et Libertés » modifiée.'
    ]
  },
  {
    title: 'Données collectées',
    content: [
      'À ce jour, aucune donnée personnelle n’est collectée directement via le site (pas de formulaire, pas de newsletter).',
      'Si des formulaires de contact ou services impliquant la collecte de données venaient à être mis en place, une information claire et précise serait fournie à l’utilisateur concernant la finalité du traitement, la durée de conservation et ses droits.'
    ]
  },
  {
    title: 'Cookies',
    content: [
      'Le site HELPMMI n’utilise pas de cookies de suivi ou à finalité publicitaire.',
      'Seuls des cookies strictement nécessaires au fonctionnement technique du site peuvent être utilisés.',
      'L’utilisateur est informé que son navigateur lui permet de gérer et supprimer ces cookies.'
    ]
  },
  {
    title: 'Responsable du traitement',
    content: [
      'Le responsable du traitement des données personnelles est : HELPMMI SARL',
      'Contact : contact@helpmmi.fr'
    ]
  },
  {
    title: 'Droits des utilisateurs',
    content: [
      'Conformément au RGPD et à la loi Informatique et Libertés, tout utilisateur dispose des droits suivants :',
      'droit d’accès à ses données personnelles,',
      'droit de rectification,',
      'droit d’effacement (« droit à l’oubli »),',
      'droit de limitation du traitement,',
      'droit d’opposition au traitement,',
      'droit à la portabilité des données.',
      'Ces droits peuvent être exercés en écrivant à : contact@helpmmi.fr.',
      'En cas de litige, l’utilisateur peut saisir la CNIL (Commission Nationale de l’Informatique et des Libertés).'
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
</script>
