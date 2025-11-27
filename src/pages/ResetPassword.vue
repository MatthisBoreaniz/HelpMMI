<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { pb } from '@/backend' // adapte le chemin si nécessaire
import LayoutDefault from '@/layouts/LayoutDefault.vue'

const route = useRoute()
const router = useRouter()

const password = ref('')
const confirmPassword = ref('')
const token = ref('')
const loading = ref(false)
const message = ref('')
const error = ref('')

onMounted(() => {
  // Récupère le token depuis l'URL : ?token=...
  token.value = (route.query.token as string) || ''
  if (!token.value) {
    error.value = 'Token manquant. Veuillez relancer la procédure.'
  }
})

const tokenPresent = computed(() => !!token.value)

const handleReset = async () => {
  error.value = ''
  message.value = ''

  if (!token.value) {
    error.value = 'Token manquant. Impossible de réinitialiser le mot de passe.'
    return
  }

  if (password.value.length < 8) {
    error.value = 'Le mot de passe doit contenir au moins 8 caractères.'
    return
  }

  if (password.value !== confirmPassword.value) {
    error.value = 'Les mots de passe ne correspondent pas.'
    return
  }

  loading.value = true
  try {
    await pb.collection('users').confirmPasswordReset(token.value, password.value, password.value)
    message.value = 'Mot de passe réinitialisé avec succès ! Redirection en cours...'
    // petite attente pour que l'utilisateur lise le message
    setTimeout(() => {
      router.push('/AuthPage') // adapte la route de login si nécessaire
    }, 1300)
  } catch (err: any) {
    console.error('reset error', err)
    // PocketBase peut renvoyer différents objets d'erreur : on essaie d'afficher un message lisible
    if (err && err.message) {
      error.value = String(err.message)
    } else {
      error.value = 'Erreur lors de la réinitialisation. Le lien est peut-être expiré.'
    }
  } finally {
    loading.value = false
  }
}
</script>
<template>
  <LayoutDefault>
    <div
      class="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center p-6"
    >
      <div class="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <h1 class="text-2xl font-extrabold text-Bleu mb-1 text-center font-permanent-marker">
          Réinitialiser le mot de passe
        </h1>
        <p class="text-sm text-Bleu text-center mb-6">
          Entrez un nouveau mot de passe pour votre compte.
        </p>
        <div
          v-if="!tokenPresent"
          class="p-4 bg-yellow-50 border border-yellow-200 rounded-md text-yellow-800 mb-4"
        >
          Lien invalide ou token manquant. Veuillez relancer la procédure de réinitialisation depuis
          la page « Mot de passe oublié ».
        </div>
        <form v-else @submit.prevent="handleReset" class="space-y-4">
          <div>
            <label for="password" class="block text-sm font-medium text-Bleu mb-1"
              >Nouveau mot de passe</label
            >
            <input
              id="password"
              v-model="password"
              type="password"
              autocomplete="new-password"
              :disabled="loading"
              class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-Bleu focus:border-Bleu"
              placeholder="Saisissez votre nouveau mot de passe"
              required
              minlength="8"
            />
          </div>
          <div>
            <label for="confirm" class="block text-sm font-medium text-Bleu mb-1"
              >Confirmer le mot de passe</label
            >
            <input
              id="confirm"
              v-model="confirmPassword"
              type="password"
              autocomplete="new-password"
              :disabled="loading"
              class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-Bleu focus:border-emerald-400"
              placeholder="Confirmez le mot de passe"
              required
              minlength="8"
            />
          </div>
          <div v-if="error" class="text-sm text-red-600">
            {{ error }}
          </div>
          <div v-if="message" class="text-sm text-green-700">
            {{ message }}
          </div>
          <button
            type="submit"
            :disabled="loading"
            class="w-full flex items-center justify-center gap-2 bg-Bleu hover:bg-Rose disabled:opacity-60 text-white font-medium py-2 px-4 rounded-lg transition"
          >
            <svg
              v-if="loading"
              class="w-4 h-4 animate-spin text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              ></circle>
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              ></path>
            </svg>
            <span v-if="!loading">Changer le mot de passe</span>
            <span v-else>Traitement...</span>
          </button>
          <div class="text-center text-sm text-slate-500">
            <RouterLink to="/AuthPage" class="text-Bleu hover:underline"
              >Retour à la connexion</RouterLink
            >
          </div>
        </form>
      </div>
    </div>
  </LayoutDefault>
</template>
