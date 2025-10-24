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
  <form @submit.prevent="handleLogin" class="flex flex-col gap-3 w-80">
    <input
      v-model="email"
      type="email"
      placeholder="Email"
      class="p-2 border rounded"
    />
    <input
      v-model="password"
      type="password"
      placeholder="Mot de passe"
      class="p-2 border rounded"
    />
    <p class="text-red-500">{{ message }}</p>

    <button
      type="submit"
      class="bg-indigo-600 text-white p-2 rounded hover:bg-indigo-500"
    >
      Se connecter
    </button>
  </form>
</template>
