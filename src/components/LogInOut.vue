<script setup lang="ts">
import { LogInWithGoogle } from '@/backend'
import useAuth from '@/composables/useAuth'
import { pb } from '@/backend'
import ImgPb from '@/pages/ImgPb.vue'
const { currentUser } = useAuth()

const GoogleImage = await pb.collection('LogosAndImages').getFirstListItem('nom="GoogleLogo"')
</script>

<template>
  <div>
    <div v-if="!currentUser">
      <button
        @click="LogInWithGoogle"
       >
        Se connecter avec Google
      </button>
    </div>
  </div>
</template>

