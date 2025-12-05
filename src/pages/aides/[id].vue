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
    <div class="p-4 md:p-10">
      <div class="mt-8 max-w-4xl mx-auto">
        <h2
          class="inline-block bg-Rose text-white font-permanent-marker text-xl px-6 py-2 rounded-t-2xl rounded-br-2xl mb-1 ml-4"
        >
          ÉTAPES À SUIVRE
        </h2>

        <div class="border-[5px] border-Rose rounded-3xl bg-white overflow-hidden shadow-sm">
          <details
            v-for="etape in (aide.expand?.Etapes_via_relAide || [])
              .slice()
              .sort((a, b) => (Number(a.ordre) || 0) - (Number(b.ordre) || 0))"
            :key="etape.id"
            class="group border-b border-Rose last:border-0"
          >
            <summary
              class="flex items-center justify-between p-4 md:p-5 cursor-pointer list-none hover:bg-Rose/5 transition-colors gap-2"
            >
              <div class="flex items-center justify-between w-full min-w-0">
                <div class="flex items-center gap-3 md:gap-4 min-w-0">
                  <div
                    class="relative flex-shrink-0 w-10 h-10 text-white flex items-center justify-center font-bold transform group-hover:scale-110 transition-transform rounded-full overflow-hidden"
                  >
                    <p class="z-10">{{ etape.ordre }}</p>
                    <ImgPb
                      v-if="stepIcon"
                      :record="stepIcon"
                      :filename="stepIcon.image"
                      class="absolute inset-0 w-full h-full object-cover rounded-full"
                    />
                  </div>

                  <h3 class="font-bold text-gray-800 text-base md:text-lg break-words leading-tight">
                    {{ etape.titre }}
                  </h3>
                </div>

                <div class="flex-shrink-0 ml-2 md:ml-4">
                  <img
                    v-if="stepArrow"
                    :src="pb.getFileUrl(stepArrow, stepArrow.image)"
                    alt="Flèche"
                    class="w-5 h-5 md:w-6 md:h-6 transform transition-transform duration-300 group-open:rotate-180"
                  />
                </div>
              </div>
            </summary>

            <div class="p-4 md:p-6">
              <div
                class="
                  text-sm md:text-base 
                  text-gray-600 
                  break-words 
                  w-full 
                  [&_img]:!max-w-full [&_img]:!h-auto [&_img]:rounded-lg [&_img]:mx-auto
                  [&_iframe]:!max-w-full [&_iframe]:w-full [&_iframe]:aspect-video
                  [&_a]:text-Rose [&_a]:underline
                  [&_ul]:list-disc [&_ul]:pl-5
                  [&_ol]:list-decimal [&_ol]:pl-5
                "
                v-html="sanitizeHtml(etape.contenu)"
              ></div>
            </div>
          </details>
        </div>
      </div>
    </div>
  </LayoutDefault>
</template>
