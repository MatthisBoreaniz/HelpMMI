<!-- eslint-disable @typescript-eslint/no-explicit-any -->

<script setup lang="ts">
import useAuth from '@/composables/useAuth'
import { ref } from 'vue'
import { pb } from '@/backend'
import ImgPb from './ImgPb.vue'
import { ClientResponseError } from 'pocketbase'
import { RouterLink } from 'vue-router'

const { currentUser, logout, DeleteUser, updateUser } = useAuth()

const mode = ref<'parametres' | 'edit'>('edit')

// --- Gestion des Popups ---
const showDeletePopup = ref(false)
const toggleDeletePopup = () => showDeletePopup.value = !showDeletePopup.value

// --- Gestion Mot de passe ---
const EditIcon = await pb.collection('LogosAndImages').getFirstListItem(`nom="InfosModif"`)
const showPasswordForm = ref(false)
const oldPassword = ref('')
const newPassword = ref('')
const newPasswordConfirm = ref('')
const message = ref('')

const togglePasswordForm = () => {
  showPasswordForm.value = !showPasswordForm.value
  message.value = ''
}

const showEditModal = ref(false)
const currentField = ref('') 
const currentLabel = ref('') 
const tempValue = ref<string | number>('') 

const openEditModal = (field: string, label: string, value: any) => {
  currentField.value = field
  currentLabel.value = label
  
  if (field === 'BirthDate' && value) {
    tempValue.value = new Date(value).toISOString().split('T')[0] || ''
  } else {
    tempValue.value = value || ''
  }
  
  message.value = '' 
  showEditModal.value = true
}

const saveField = async () => {
  try {
    const payload = { [currentField.value]: tempValue.value }
    await updateUser(payload)
    showEditModal.value = false
    message.value = ''
  } catch (e) {
    if (e instanceof ClientResponseError) {
      message.value = e.response?.message || e.message
    } else {
      message.value = "Erreur lors de la mise à jour"
    }
  }
}

const updatePassword = async () => {
  message.value = ''
  if (!oldPassword.value) { message.value = "Ancien mot de passe requis"; return }
  if (newPassword.value !== newPasswordConfirm.value) { message.value = "Non correspondance"; return }
  if (newPassword.value.length < 8) { message.value = "Trop court (min 8 car.)"; return }

  try {
    await updateUser({
      oldPassword: oldPassword.value,
      password: newPassword.value,
      passwordConfirm: newPasswordConfirm.value,
    })
    message.value = 'Mot de passe modifié !'
    setTimeout(() => showPasswordForm.value = false, 1500)
    oldPassword.value = ''
    newPassword.value = ''
    newPasswordConfirm.value = ''
  } catch (e) {
     if (e instanceof ClientResponseError) message.value = e.response?.message || e.message
     else message.value = 'Erreur inconnue.'
  }
}
</script>

<template>
  <div class="flex flex-col p-4 md:p-10 lg:p-20 lg:pt-0 w-full max-w-7xl mx-auto">
    
    <div class="bg-Bleu p-6 md:p-10 rounded-2xl mb-5 flex flex-col shadow-lg transition-all duration-300">
      <div class="flex flex-col md:flex-row justify-between items-center gap-4 md:gap-0">
        
        <h1 
          v-if="currentUser?.name || currentUser?.firstName" 
          class="text-xl md:text-2xl font-bold text-white font-permanent-marker text-center md:text-left break-all"
        >
          {{ currentUser?.firstName }} {{ currentUser?.name }}
        </h1>
        <h1 
          v-else 
          class="text-xl md:text-2xl font-bold text-white font-permanent-marker text-center md:text-left break-all"
        >
          {{ currentUser?.username }}
        </h1>

        <div class="flex flex-col items-center gap-3">
          <button 
            @click="logout" 
            class="border border-Blanc text-white text-sm md:text-base p-2 rounded hover:text-red-400 hover:border-red-400 transition-colors"
          >
            Déconnexion
          </button>
        </div>
      </div>

      <div class="mt-6 md:mt-4 flex gap-6 md:gap-4 justify-center md:justify-start border-t border-white/20 pt-4 md:border-t-0 md:pt-0">
        <button 
          @click="mode = 'edit'" 
          :class="mode === 'edit' ? 'text-white underline scale-105' : 'text-gray-300 hover:text-white'" 
          class="text-base md:text-lg font-bold transition-all"
        >
          modifier
        </button>
        <button 
          @click="mode = 'parametres'" 
          :class="mode === 'parametres' ? 'text-white underline scale-105' : 'text-gray-300 hover:text-white'" 
          class="text-base md:text-lg font-bold transition-all"
        >
          paramètres
        </button>
      </div>
    </div>

    <div v-if="mode === 'edit'" class="flex flex-col gap-3">
      
      <div class="border border-Bleu p-3 md:p-2 px-4 rounded-xl flex justify-between items-center bg-white shadow-sm hover:shadow-md transition-shadow">
        <div class="flex flex-col md:flex-row md:items-center md:gap-2 w-full overflow-hidden">
          <p class="text-Bleu font-bold text-sm md:text-base min-w-[100px]">Prénom :</p>
          <p class="text-sm md:text-base truncate">{{ currentUser?.firstName }}</p>
        </div>
        <ImgPb v-if="EditIcon" :record="EditIcon" :filename="EditIcon.image" 
          class="w-6 h-6 rounded-lg cursor-pointer hover:opacity-70 flex-shrink-0 ml-2"
          @click="openEditModal('firstName', 'Prénom', currentUser?.firstName)" 
        />
      </div>

      <div class="border border-Bleu p-3 md:p-2 px-4 rounded-xl flex justify-between items-center bg-white shadow-sm hover:shadow-md transition-shadow">
        <div class="flex flex-col md:flex-row md:items-center md:gap-2 w-full overflow-hidden">
          <p class="text-Bleu font-bold text-sm md:text-base min-w-[100px]">Nom :</p>
          <p class="text-sm md:text-base truncate">{{ currentUser?.name }}</p>
        </div>
        <ImgPb v-if="EditIcon" :record="EditIcon" :filename="EditIcon.image" 
          class="w-6 h-6 rounded-lg cursor-pointer hover:opacity-70 flex-shrink-0 ml-2"
          @click="openEditModal('name', 'Nom', currentUser?.name)" 
        />
      </div>

      <div class="border border-Bleu p-3 md:p-2 px-4 rounded-xl flex justify-between items-center bg-white shadow-sm hover:shadow-md transition-shadow">
        <div class="flex flex-col md:flex-row md:items-center md:gap-2 w-full overflow-hidden">
          <p class="text-Bleu font-bold text-sm md:text-base min-w-[150px]">Date de Naissance :</p>
          <p class="text-sm md:text-base truncate">
            {{ currentUser?.BirthDate ? new Date(currentUser.BirthDate).toLocaleDateString('fr-FR') : 'Non renseignée' }}
          </p>
        </div>
        <ImgPb v-if="EditIcon" :record="EditIcon" :filename="EditIcon.image" 
          class="w-6 h-6 rounded-lg cursor-pointer hover:opacity-70 flex-shrink-0 ml-2"
          @click="openEditModal('BirthDate', 'Date de Naissance', currentUser?.BirthDate)" 
        />
      </div>

      <div class="border border-Bleu p-3 md:p-2 px-4 rounded-xl flex justify-between items-center bg-white shadow-sm hover:shadow-md transition-shadow">
        <div class="flex flex-col md:flex-row md:items-center md:gap-2 w-full overflow-hidden">
          <p class="text-Bleu font-bold text-sm md:text-base min-w-[100px]">Adresse :</p>
          <p class="text-sm md:text-base truncate">{{ currentUser?.Adress }}</p>
        </div>
        <ImgPb v-if="EditIcon" :record="EditIcon" :filename="EditIcon.image" 
          class="w-6 h-6 rounded-lg cursor-pointer hover:opacity-70 flex-shrink-0 ml-2"
          @click="openEditModal('Adress', 'Adresse', currentUser?.Adress)" 
        />
      </div>

      <div class="border border-Bleu p-3 md:p-2 px-4 rounded-xl flex justify-between items-center bg-white shadow-sm hover:shadow-md transition-shadow">
        <div class="flex flex-col md:flex-row md:items-center md:gap-2 w-full overflow-hidden">
          <p class="text-Bleu font-bold text-sm md:text-base min-w-[100px]">Formation :</p>
          <p class="text-sm md:text-base truncate">{{ currentUser?.Formation }}</p>
        </div>
        <ImgPb v-if="EditIcon" :record="EditIcon" :filename="EditIcon.image" 
          class="w-6 h-6 rounded-lg cursor-pointer hover:opacity-70 flex-shrink-0 ml-2"
          @click="openEditModal('Formation', 'Formation', currentUser?.Formation)" 
        />
      </div>

      <div class="border border-Bleu p-3 md:p-2 px-4 rounded-xl flex justify-between items-center bg-white shadow-sm hover:shadow-md transition-shadow">
        <div class="flex flex-col md:flex-row md:items-center md:gap-2 w-full overflow-hidden">
          <p class="text-Bleu font-bold text-sm md:text-base min-w-[100px]">Téléphone :</p>
          <p class="text-sm md:text-base truncate">
            {{ currentUser?.Phone != null ? (('0' + String(currentUser.Phone).replace(/\D/g, '')).match(/\d{1,2}/g)?.join(' ') ?? '') : '' }}
          </p>
        </div>
        <ImgPb v-if="EditIcon" :record="EditIcon" :filename="EditIcon.image" 
          class="w-6 h-6 rounded-lg cursor-pointer hover:opacity-70 flex-shrink-0 ml-2"
          @click="openEditModal('Phone', 'Téléphone', currentUser?.Phone)" 
        />
      </div>

      <div class="border border-Bleu p-3 md:p-2 px-4 rounded-xl bg-gray-50 flex flex-col md:flex-row md:items-center gap-1 md:gap-2">
        <p class="text-Bleu font-bold text-sm md:text-base min-w-[100px]">Email :</p>
        <p class="text-sm md:text-base break-all text-gray-600">{{ currentUser?.email }}</p>
      </div>

      <div 
        class="border border-Bleu px-4 my-2 rounded-xl flex items-center justify-between py-4 md:py-5 cursor-pointer hover:bg-Bleu hover:text-white group transition-colors shadow-sm" 
        @click="togglePasswordForm"
      >
        <p class="font-bold text-sm md:text-base">Modifier votre mot de passe</p>
        <ImgPb v-if="EditIcon" :record="EditIcon" :filename="EditIcon.image" class="w-6 h-6 rounded-lg group-hover:brightness-200" />
      </div>
    </div>

    <div v-if="mode === 'parametres'" class="flex flex-col gap-3">
      <div class="border border-Bleu px-4 rounded-xl py-4 md:py-5 hover:bg-gray-50 cursor-pointer transition-colors">
        <RouterLink to="/legal/privacy">
          <p class="text-sm md:text-base font-bold">Politique de confidentialité</p>
        </RouterLink>
      </div>
      <div class="border border-Bleu px-4 rounded-xl py-4 md:py-5 hover:bg-gray-50 cursor-pointer transition-colors">
        <RouterLink to="/legal/cgu">
          <p class="text-sm md:text-base font-bold">CGU</p>
        </RouterLink>
      </div>
      <div class="border border-Bleu px-4 rounded-xl py-4 md:py-5 hover:bg-gray-50 cursor-pointer transition-colors">
        <RouterLink to="/legal/mentions">
          <p class="text-sm md:text-base font-bold">Mentions légales</p>
        </RouterLink>
      </div>
      
      <div class="flex flex-col items-center gap-3 my-4 mt-8">
        <button 
          @click="toggleDeletePopup" 
          class="w-full md:w-auto px-8 bg-red-400 text-white p-3 rounded-lg hover:bg-white hover:text-red-400 border border-red-400 transition-colors font-bold shadow-md"
        >
          Supprimer mon compte
        </button>
      </div>
    </div>
  </div>

  <div v-if="showDeletePopup" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
    <div class="bg-white p-6 rounded-2xl shadow-2xl flex flex-col items-center w-full max-w-sm text-center">
      <h3 class="font-bold text-xl mb-2 text-Rose/60">Attention</h3>
      <p class="mb-6 text-gray-600">Cette action est irréversible. Voulez-vous vraiment nous quitter ?</p>
      <div class="flex flex-col md:flex-row gap-3 w-full">
        <button @click="(DeleteUser(), toggleDeletePopup())" class="flex-1 bg-red-500 text-white px-4 py-3 rounded-xl hover:bg-red-600 font-bold transition-colors">
          Supprimer
        </button>
        <button @click="toggleDeletePopup" class="flex-1 bg-gray-200 text-gray-800 px-4 py-3 rounded-xl hover:bg-gray-300 font-bold transition-colors">
          Annuler
        </button>
      </div>
    </div>
  </div>

  <div v-if="showPasswordForm" class="fixed inset-0 flex items-center justify-center z-50 bg-black/60 backdrop-blur-sm p-4">
    <div class="bg-white p-6 rounded-2xl shadow-2xl flex flex-col gap-4 w-full max-w-md mx-4">
      <div class="flex justify-between items-center border-b pb-2">
         <h3 class="font-bold text-lg text-Bleu">Changer le mot de passe</h3>
         <button @click="togglePasswordForm" class="text-Rose/60 font-bold hover:bg-Rose/10 px-2 rounded transition-colors">Fermer</button>
      </div>
      
      <div class="flex flex-col gap-3">
        <input type="password" v-model="oldPassword" placeholder="Ancien mot de passe" class="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-Bleu focus:outline-none" />
        <input type="password" v-model="newPassword" placeholder="Nouveau mot de passe" class="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-Bleu focus:outline-none" />
        <input type="password" v-model="newPasswordConfirm" placeholder="Confirmer" class="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-Bleu focus:outline-none" />
      </div>
      
      <button @click="updatePassword" class="mt-2 bg-Bleu text-white px-4 py-3 rounded-xl font-bold hover:opacity-90 transition-opacity shadow-md">
        Valider
      </button>
      <p v-if="message" class="text-Bleu text-sm text-center font-bold animate-pulse">{{ message }}</p>
    </div>
  </div>

  <div v-if="showEditModal" class="fixed inset-0 flex items-center justify-center z-50 bg-black/60 backdrop-blur-sm p-4">
    <div class="bg-white p-6 rounded-2xl shadow-2xl flex flex-col gap-5 w-full max-w-md mx-4">
      <div class="flex justify-between items-center border-b pb-2">
        <h3 class="font-bold text-lg text-Bleu">Modifier : {{ currentLabel }}</h3>
        <button @click="showEditModal = false" class="text-Rose/60 font-bold hover:bg-Rose/10 px-2 rounded transition-colors">Fermer</button>
      </div>

      <div>
         <input 
           v-if="currentField === 'BirthDate'"
           type="date" 
           v-model="tempValue"
           class="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-Bleu focus:outline-none text-black"
         />
         <input 
           v-else
           :type="currentField === 'Phone' ? 'tel' : 'text'"
           v-model="tempValue"
           class="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-Bleu focus:outline-none text-black"
           placeholder="Entrez votre modification"
         />
      </div>

      <button @click="saveField" class="bg-Bleu text-white font-bold py-3 px-4 rounded-xl hover:opacity-90 transition-all shadow-md active:scale-95">
        Enregistrer
      </button>

      <p v-if="message" class="text-Rose/60 text-sm text-center font-bold">{{ message }}</p>
    </div>
  </div>
</template>