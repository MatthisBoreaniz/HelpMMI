<script setup lang="ts">
import useAuth from '@/composables/useAuth'
import { ref } from 'vue'
const { currentUser, logout, DeleteUser } = useAuth()

const mode = ref<'parametres' | 'edit'>('edit')

const showPopup = ref(false)
const togglePopup = () => {
  showPopup.value = !showPopup.value
}
</script>

<template>
  <div class="felx flex-col p-20 pt-0">
    <div class="bg-Bleu p-10 rounded-2xl mb-5 flex flex-col">
      <div class="flex justify-between">
        <h1 class="text-2xl font-bold text-white font-permanent-marker">
          {{ currentUser?.firstName }} {{ currentUser?.name }}
        </h1>
        <div class="flex flex-col items-center gap-3">
          <button
            @click="logout"
            class="border border-Blanc text-white p-2 rounded hover:text-red-400 hover:border hover:border-red-400 transition-colors"
          >
            Déconnexion
          </button>
        </div>
      </div>
      <div class="mt-4 flex gap-4">
        <button @click="mode = 'edit'" class="text-Blanc text-lg font-bold">modifier</button>
        <button @click="mode = 'parametres'" class="text-Blanc text-lg font-bold">
          paramètres
        </button>
      </div>
    </div>

    <div v-if="mode === 'edit'">
      <div class="border border-Bleu p-2 px-4 my-2 rounded-xl">
        <p><strong>Prénom</strong></p>
        <p>{{ currentUser?.firstName }}</p>
      </div>
      <div class="border border-Bleu p-2 px-4 my-2 rounded-xl">
        <p><strong>Nom</strong></p>
        <p>{{ currentUser?.name }}</p>
      </div>
      <div class="border border-Bleu p-2 px-4 my-2 rounded-xl">
        <p><strong>date de Naissance</strong></p>
        <p>
          {{
            currentUser?.BirthDate
              ? new Date(currentUser.BirthDate).toLocaleDateString('fr-FR', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric',
                })
              : ''
          }}
        </p>
      </div>
      <div class="border border-Bleu p-2 px-4 my-2 rounded-xl">
        <p><strong>Adresse</strong></p>
        <p>{{ currentUser?.Adress }}</p>
      </div>
      <div class="border border-Bleu p-2 px-4 my-2 rounded-xl">
        <p><strong>Formation</strong></p>
        <p>{{ currentUser?.Formation }}</p>
      </div>
      <div class="border border-Bleu p-2 px-4 my-2 rounded-xl">
        <p><strong>Email</strong></p>
        <p>{{ currentUser?.email }}</p>
      </div>
      <div class="border border-Bleu p-2 px-4 my-2 rounded-xl">
        <p><strong>Téléphone</strong></p>
        <p>
          {{
            currentUser?.Phone != null
              ? (('0' + String(currentUser.Phone).replace(/\D/g, ''))
                  .match(/\d{1,2}/g)
                  ?.join(' ') ?? '')
              : ''
          }}
        </p>
      </div>
      <div class="border border-Bleu px-4 my-2 rounded-xl flex items-center justify-start py-5">
        <p><strong>Modifier votre mot de passe</strong></p>
      </div>
    </div>
    <div v-if="mode === 'parametres'">
      <div class="border border-Bleu px-4 my-2 rounded-xl flex items-center justify-start py-5">
        <p><strong>Politique de confidentialité</strong></p>
      </div>
      <div class="border border-Bleu px-4 my-2 rounded-xl flex items-center justify-start py-5">
        <p><strong>Conditions générales d'utilisation</strong></p>
      </div>
    </div>
    <div class="flex flex-col items-center gap-3 my-4">
      <button
        @click="togglePopup"
        class="w-full bg-red-400 text-white p-2 rounded-lg hover:bg-white hover:text-red-400 hover:border hover:border-red-400 transition-colors"
      >
        Supprimer mon compte
      </button>
    </div>
  </div>
  <div
    v-if="showPopup"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
  >
    <div class="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center">
      <p class="mb-4">Cette action est irréversible.</p>
      <div class="flex gap-4">
        <button
          @click="
            DeleteUser(),
            togglePopup()
          "
          class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
        >
          Supprimer
        </button>
        <button
          @click="togglePopup"
          class="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400 transition-colors"
        >
          Annuler
        </button>
      </div>
    </div>
  </div>
</template>
