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
      class="bg-Bleu w-1/2 flex justify-center items-center mx-auto text-white p-2 rounded-md hover:bg-Bleu transition duration-200 text-lg"
    >
      Se connecter
    </button>
  </form>
</template>
