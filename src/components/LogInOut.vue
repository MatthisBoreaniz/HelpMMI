<script setup lang="ts">
import { LogInWithGoogle } from '@/backend'
import useAuth from '@/composables/useAuth'
import { pb } from '@/backend'
import ImgPb from '@/pages/ImgPb.vue'
const { currentUser } = useAuth()

const GoogleImage = await pb.collection('LogosAndImages').getFirstListItem('nom="GoogleLogo"')
</script>

<template>
      <button
        @click="LogInWithGoogle"
        class="p-2 mb-5 bg-white text-Bleu border border-Rose rounded-md flex items-center gap-2 hover:bg-blue-100 text-sm"
      >
        <ImgPb
          v-if="GoogleImage"
          :record="GoogleImage"
          :filename="GoogleImage.image"
          class="w-3 h-auto pointer-events-none"
        />
        Se connecter avec Google
      </button>
</template>

