<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <LayoutDefault>
    <div class="max-w-6xl mx-auto p-6 grid grid-cols-1 md:grid-cols-[3fr_1fr] gap-6 text-gray-800  rounded-md">

      <div>
        <h1 class="text-2xl font-semibold mb-6 text-Bleu">Conditions Générales d’Utilisation (CGU)</h1>

        
                <div class="mt-8 md:hidden py-5">
                    <label for="cgu-summary" class="block mb-2 text-sm font-medium text-gray-700">Sommaire</label>
                    <div class="relative">
                        <select
                            id="cgu-summary"
                            v-model="currentSection"
                            @change="scrollToSection(currentSection)"
                            aria-label="Sommaire des CGU"
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

      <nav class="hidden md:block sticky top-6" aria-label="Sommaire des CGU">
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
  { title: 'Objet', content: ['Les présentes CGU ont pour objet de définir les modalités de mise à disposition du site HELPMMI et les conditions d’utilisation par l’utilisateur.'] },
  { title: 'Acceptation', content: ['L’accès au site implique l’acceptation pleine et entière des présentes CGU.', 'Si l’utilisateur n’accepte pas ces conditions, il lui est demandé de ne pas utiliser le site.'] },
  { title: 'Accès au site', content: ['Le site est accessible gratuitement, 24h/24 et 7j/7, sauf en cas de force majeure, d’interruption programmée pour maintenance ou de mise à jour technique.', 'HELPMMI ne saurait être tenue responsable de toute indisponibilité ou dysfonctionnement du site.'] },
  { title: 'Utilisation du site', content: ['L’utilisateur s’engage à utiliser le site conformément à la loi et aux présentes CGU.', 'Il lui est notamment interdit de :', 'perturber le fonctionnement du site,', 'introduire des virus ou tout code malveillant,', 'porter atteinte aux droits de propriété intellectuelle de HELPMMI ou de tiers.'] },
  { title: 'Responsabilité', content: ['HELPMMI met tout en œuvre pour fournir des informations fiables et mises à jour, mais ne peut garantir l’exactitude, l’exhaustivité et la pertinence des contenus.', 'HELPMMI ne pourra être tenue responsable des dommages directs ou indirects résultant de l’utilisation du site ou des informations qu’il contient.', 'HELPMMI fournit uniquement un service d’information et d’orientation vers des aides existantes. La décision d’attribuer ou de refuser une aide (par exemple une bourse, un logement ou tout autre dispositif d’accompagnement) relève exclusivement des organismes compétents (CROUS, organismes publics, associations, etc.). HELPMMI ne peut en aucun cas être tenue responsable de l’issue d’une demande d’aide effectuée par un utilisateur, ni des délais, refus ou erreurs imputables à ces organismes.'] },
  { title: 'Liens externes', content: ['Le site HELPMMI peut contenir des liens hypertextes vers d’autres sites. HELPMMI n’exerce aucun contrôle sur ces sites et décline toute responsabilité quant à leur contenu.'] },
  { title: 'Modification des CGU', content: ['HELPMMI se réserve le droit de modifier à tout moment les présentes CGU afin de les adapter aux évolutions du site, des services proposés ou de la législation en vigueur.', 'L’utilisateur est invité à consulter régulièrement les CGU pour prendre connaissance des éventuelles modifications.'] }
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
