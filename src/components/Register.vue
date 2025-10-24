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
const acceptTerms = ref(false)

const handleRegister = async () => {
  if (password.value !== passwordConfirm.value) {
    message.value = 'Les mots de passe ne correspondent pas.'
    return
  } else if (!acceptTerms.value) {
    message.value = 'Vous devez accepter les conditions d’utilisation et la politique de confidentialité.'
    return
  }
  try {
    await register(email.value, password.value, name.value)
    message.value = 'Compte créé avec succès !'
  } catch (err) {
    console.error(err)
    message.value = 'Erreur lors de l’inscription.'
  }
}


</script>

<template>
  <form @submit.prevent="handleRegister" class="flex flex-col gap-4 w-full mx-auto p-4 border">
    <input
      v-model="name"
      type="text"
      placeholder="Nom complet"
      class="p-3 border border-Bleu rounded-3xl focus:outline-none focus:ring-2 focus:ring-Bleu"
    />
    <input
      v-model="email"
      type="email"
      placeholder="Email"
      class="p-3 border border-Bleu rounded-3xl focus:outline-none focus:ring-2 focus:ring-Bleu"
    />
    <input
      v-model="password"
      type="password"
      placeholder="Mot de passe"
      class="p-3 border border-Bleu rounded-3xl focus:outline-none focus:ring-2 focus:ring-Bleu"
    />
    <input
      v-model="passwordConfirm"
      type="password"
      placeholder="Confirmer le mot de passe"
      class="p-3 border border-Bleu rounded-3xl focus:outline-none focus:ring-2 focus:ring-Bleu"
    />
    <div>
      <input
        type="checkbox"
        id="acceptTerms"
        v-model="acceptTerms"
        class="mr-2"
      />
      <label for="acceptTerms" class="text-Bleu text-xs">J'accepte les conditions d'utilisations et les politiques de confidetialité</label>
    </div>
    <button
      type="submit"
      class="bg-Bleu w-1/2 flex justify-center items-center mx-auto text-white p-2 rounded-md hover:bg-Rose transition duration-200 text-lg"
    >
      S'inscrire
    </button>
    <p class="text-red-500">{{ message }}</p>
  </form>
</template>
