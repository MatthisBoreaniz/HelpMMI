<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { pb } from '@/backend'
import ImgPb from '@/components/ImgPb.vue'
import { useRoute } from 'vue-router'
import LayoutDefault from '@/layouts/LayoutDefault.vue'
import type { AidesResponse, EtapesResponse } from '@/pocketbase-types'
import sanitizeHtml from 'sanitize-html'

const route = useRoute('/aides/[id]')

const aide = await pb
  .collection<
    AidesResponse<{
      Etapes_via_relAide: EtapesResponse[]
    }>
  >('Aides')
  .getOne(route.params.id as string, {
    expand: 'Etapes_via_relAide',
  })

const stepIcon = await pb.collection('LogosAndImages').getFirstListItem('nom="stepIcon"')
const stepArrow = await pb.collection('LogosAndImages').getFirstListItem('nom="stepArrow"')
</script>
<template>
<LayoutDefault>
  <div class="space-y-6 p-4">

    <!-- Card principale -->
    <div class="relative w-full max-w-full mx-auto rounded-2xl shadow-md overflow-hidden bg-Bleu cursor-pointer hover:shadow-lg hover:scale-[1.01] transition-transform">
      <div
        class="absolute inset-0 bg-Bleu/70 backdrop-blur-sm mix-blend-multiply transition-colors duration-300"
        :style="aide.imageCard ? {
          backgroundImage: `url('${pb.getFileUrl(aide, aide.imageCard)}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        } : {}"
      ></div>
      <div class="relative z-10 px-4 py-4 text-center">
        <h2 class="text-white font-permanent-marker text-lg sm:text-xl md:text-2xl">
          {{ aide.nom }}
        </h2>
      </div>
    </div>

    <!-- Découvrir -->
    <section class="w-full max-w-full mx-auto space-y-2">
      <h2 class="inline-block bg-Bleu text-white font-permanent-marker text-lg rounded-2xl px-3 py-2">
        Découvrir
      </h2>
      <div class="bg-white shadow-sm rounded-xl p-3 text-gray-600 text-sm break-words
                  [&_img]:max-w-full [&_img]:h-auto [&_img]:rounded-lg [&_img]:mx-auto
                  [&_iframe]:w-full [&_iframe]:aspect-video [&_a]:text-Bleu [&_a]:underline [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_*]:mb-4"
           v-html="sanitizeHtml(aide.Description)">
      </div>
    </section>

    <!-- Astuce -->
    <section class="w-full max-w-full mx-auto space-y-2">
      <div class="border-2 border-Bleu-clair border-dashed rounded-xl bg-white shadow-sm overflow-hidden p-3 text-gray-600 text-sm break-words
                  [&_img]:max-w-full [&_img]:h-auto [&_img]:rounded-lg [&_img]:mx-auto
                  [&_iframe]:w-full [&_iframe]:aspect-video [&_a]:text-Rose [&_a]:underline [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_*]:mb-4"
           v-html="sanitizeHtml(aide.Astuce)">
      </div>
    </section>

    <!-- Étapes -->
    <section class="w-full max-w-full mx-auto space-y-2">
      <h2 class="inline-block bg-Rose text-white font-permanent-marker text-lg rounded-2xl px-3 py-2">
        ÉTAPES À SUIVRE
      </h2>
      <div class="border-2 border-Rose rounded-xl bg-white shadow-sm overflow-hidden">
        <details
          v-for="etape in (aide.expand?.Etapes_via_relAide || []).slice().sort((a,b)=> (Number(a.ordre)||0)-(Number(b.ordre)||0))"
          :key="etape.id"
          class="group border-b border-Rose last:border-0"
        >
          <summary class="flex items-center justify-between p-3 cursor-pointer list-none hover:bg-Rose/5 transition-colors gap-2">
            <div class="flex items-center gap-2 min-w-0">
              <div class="relative flex-shrink-0 w-8 h-8 flex items-center justify-center text-white font-bold rounded-full overflow-hidden transform group-hover:scale-110 transition-transform">
                <p class="z-10">{{ etape.ordre }}</p>
                <ImgPb v-if="stepIcon" :record="stepIcon" :filename="stepIcon.image" class="absolute inset-0 w-full h-full object-cover rounded-full" />
              </div>
              <h3 class="font-bold text-gray-800 text-sm break-words leading-tight">
                {{ etape.titre }}
              </h3>
            </div>
            <div class="flex-shrink-0">
              <img v-if="stepArrow" :src="pb.getFileUrl(stepArrow, stepArrow.image)" alt="Flèche"
                   class="w-4 h-4 transform transition-transform duration-300 group-open:rotate-180" />
            </div>
          </summary>
          <div class="p-3 text-gray-600 text-sm break-words w-full
                      [&_img]:max-w-full [&_img]:h-auto [&_img]:rounded-lg [&_img]:mx-auto
                      [&_iframe]:w-full [&_iframe]:aspect-video [&_a]:text-Rose [&_a]:underline [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_*]:mb-4">
            <div v-html="sanitizeHtml(etape.contenu)"></div>
          </div>
        </details>
      </div>
    </section>

    <!-- Documents -->
    <section class="w-full max-w-full mx-auto space-y-2">
      <h2 class="inline-block bg-Rose text-white font-permanent-marker text-lg rounded-2xl px-3 py-2">
        Documents
      </h2>
      <div class="border-2 border-Rose rounded-xl bg-white shadow-sm overflow-hidden p-3 text-gray-600 text-sm break-words
                  [&_img]:max-w-full [&_img]:h-auto [&_img]:rounded-lg [&_img]:mx-auto
                  [&_iframe]:w-full [&_iframe]:aspect-video [&_a]:text-Rose [&_a]:underline [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_*]:mb-4"
           v-html="sanitizeHtml(aide.Document)">
      </div>
    </section>

    <!-- Adresses et Contacts -->
    <section class="w-full max-w-full mx-auto space-y-2">
      <h2 class="inline-block bg-Bleu text-white font-permanent-marker text-lg rounded-2xl px-3 py-2">
        Adresses et contacts
      </h2>
      <div class="border-2 border-Bleu rounded-xl bg-white shadow-sm overflow-hidden p-3 text-gray-600 text-sm break-words
                  [&_img]:max-w-full [&_img]:h-auto [&_img]:rounded-lg [&_img]:mx-auto
                  [&_iframe]:w-full [&_iframe]:aspect-video [&_a]:text-Bleu [&_a]:underline [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_*]:mb-4"
           v-html="sanitizeHtml(aide.Contact)">
      </div>
    </section>

  </div>
</LayoutDefault>


</template>
