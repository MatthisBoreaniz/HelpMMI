<template>
    <div class="flex justify-center items-center min-h-screen">
        <div class="bg-white p-6 rounded shadow-md w-full max-w-md">
            <h1 class="text-2xl font-bold mb-4 text-Bleu font-permanent-marker text-center">Réinitialiser le mot de passe</h1>
            <form @submit.prevent="sendReset" class="flex flex-col gap-4">
                <label for="email" class="text-sm font-medium text-Bleu">Adresse Email</label>
                <input
                    id="email"
                    v-model="emailToReset"
                    type="email"
                    placeholder="Entrez votre email"
                    required
                    class="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-Bleu"
                />
                <button
                    type="submit"
                    class="bg-Bleu text-white p-2 rounded hover:bg-Bleu transition-colors"
                >
                    Envoyer le lien de réinitialisation
                </button>
                <p v-if="message" class="text-center text-green-600">{{ message }}</p>
            </form>
            <RouterLink to="/authPage" class="block mt-4 text-center text-Bleu ">
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
