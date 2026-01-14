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
  message.value = ''

  // 🔴 Champs obligatoires
  if (!name.value.trim()) {
    message.value = 'Le nom est obligatoire.'
    return
  }

  if (!email.value.trim()) {
    message.value = 'L’email est obligatoire.'
    return
  }

  if (!password.value) {
    message.value = 'Le mot de passe est obligatoire.'
    return
  }

  if (!passwordConfirm.value) {
    message.value = 'La confirmation du mot de passe est obligatoire.'
    return
  }

  // 🔴 Email invalide
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email.value)) {
    message.value = 'Adresse email invalide.'
    return
  }

  // 🔴 Mot de passe trop court
  if (password.value.length < 8) {
    message.value = 'Le mot de passe doit contenir au moins 8 caractères.'
    return
  }

  // 🔴 Mots de passe différents
  if (password.value !== passwordConfirm.value) {
    message.value = 'Les mots de passe ne correspondent pas.'
    return
  }

  // 🔴 Conditions non acceptées
  if (!acceptTerms.value) {
    message.value = 'Vous devez accepter les conditions d’utilisation et la politique de confidentialité.'
    return
  }

  // ✅ Appel backend
  try {
    await register(email.value, password.value, name.value)
    message.value = 'Compte créé avec succès !'
  } catch (err: any) {
    message.value = err?.message || 'Erreur lors de l’inscription.'
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
