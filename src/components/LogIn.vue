<script setup lang="ts">
import { ref } from 'vue'
import useAuth from '@/composables/useAuth'

const { login } = useAuth()

const email = ref('')
const password = ref('')
const message = ref('')

const handleLogin = async () => {
  try {
    await login(email.value, password.value)
    message.value = 'Connexion réussie !'
  } catch {
    message.value = 'Email ou mot de passe incorrect.'
  }
}
</script>

<template>
  <form @submit.prevent="handleLogin" class="flex flex-col gap-4 w-full mx-auto p-4 border">
    <input v-model="email" type="email" placeholder="Email" class="p-3 border border-Bleu rounded-3xl focus:outline-none focus:ring-2 focus:ring-Bleu" />
    <input
      v-model="password"
      type="password"
      placeholder="Mot de passe"
      class="p-3 border border-Bleu rounded-3xl focus:outline-none focus:ring-2 focus:ring-Bleu"
    />
    <p class="text-red-500">{{ message }}</p>

    <button
      type="submit"
      class="bg-Bleu text-white w-full sm:w-3/4 md:w-1/2 lg:w-2/3 mx-auto flex items-center justify-center px-4 py-3 sm:px-6 sm:py-3 rounded-xl hover:opacity-90 transition duration-200 text-sm md:text-base lg:text-lg focus:outline-none focus:ring-2 focus:ring-Bleu focus:ring-opacity-60"
    >
      Se connecter
    </button>
  </form>
</template>
