<template>
    <div class="flex justify-center items-center min-h-screen bg-gray-100">
        <div class="bg-white p-6 rounded shadow-md w-full max-w-md">
            <h1 class="text-2xl font-bold mb-4 text-center">Réinitialiser le mot de passe</h1>
            <form @submit.prevent="sendReset" class="flex flex-col gap-4">
                <label for="email" class="text-sm font-medium text-gray-700">Adresse Email</label>
                <input
                    id="email"
                    v-model="emailToReset"
                    type="email"
                    placeholder="Entrez votre email"
                    required
                    class="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                    type="submit"
                    class="bg-blue-600 text-white p-2 rounded hover:bg-blue-500 transition-colors"
                >
                    Envoyer le lien de réinitialisation
                </button>
                <p v-if="message" class="text-center text-green-600">{{ message }}</p>
            </form>
            <RouterLink to="/authPage" class="block mt-4 text-center text-blue-500 underline">
                Retour à la page de connexion
            </RouterLink>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { pb } from '@/backend';
import { RouterLink } from 'vue-router';
const message = ref('');

const emailToReset = ref('');

const sendReset = async () => {
  try {
    await pb.collection('users').requestPasswordReset(emailToReset.value, {
      redirectUrl: `${window.location.origin}/ResetPassword`
    });
    message.value = 'Un email de réinitialisation a été envoyé si l\'adresse est correct.';
  } catch (e) {
    message.value = 'Erreur lors de la demande de réinitialisation du mot de passe.';
    console.error(e);
  }
};


</script>
