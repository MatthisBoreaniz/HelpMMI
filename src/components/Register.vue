<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { ref } from 'vue'
import useAuth from '@/composables/useAuth'

const { register } = useAuth()

const email = ref('')
const name = ref('')
const password = ref('')
const passwordConfirm = ref('')
const message = ref('')

const handleRegister = async () => {
  if (password.value !== passwordConfirm.value) {
    message.value = '❌ Les mots de passe ne correspondent pas.'
    return
  }

  try {
    await register(email.value, password.value, name.value)
    message.value = '✅ Compte créé avec succès !'
  } catch (err) {
    console.error(err)
    message.value = '❌ Erreur lors de l’inscription.'
  }
}
</script>

<template>
  <form @submit.prevent="handleRegister" class="flex flex-col gap-4 w-80 mx-auto mt-10 p-4 border rounded shadow-md">
    <input
      v-model="name"
      type="text"
      placeholder="Nom complet"
      class="p-3 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
    />
    <input
      v-model="email"
      type="email"
      placeholder="Email"
      class="p-3 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
    />
    <input
      v-model="password"
      type="password"
      placeholder="Mot de passe"
      class="p-3 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
    />
    <input
      v-model="passwordConfirm"
      type="password"
      placeholder="Confirmer le mot de passe"
      class="p-3 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
    />
    <button
      type="submit"
      class="bg-green-600 text-white p-3 rounded hover:bg-green-500 transition duration-200"
    >
      S'inscrire
    </button>
    <p class="text-red-500">{{ message }}</p>
  </form>
</template>
