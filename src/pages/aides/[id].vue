<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { pb } from '@/backend'
import ImgPb from '@/components/ImgPb.vue'
import { useRoute } from 'vue-router'
import LayoutDefault from '@/layouts/LayoutDefault.vue'

const route = useRoute('/aides/[id]')

const aide = await pb.collection('Aides').getOne(route.params.id as string)
</script>
<template>
  <LayoutDefault>
    <div class="p-10">
      <h1 class="text-3xl font-bold mb-6">{{ aide.nom }}</h1>
      <ImgPb
        v-if="aide.imageCard"
        :record="aide"
        :filename="aide.imageCard"
        class="w-64 h-64 object-cover mb-6"
      />
    </div>
  </LayoutDefault>
</template>
