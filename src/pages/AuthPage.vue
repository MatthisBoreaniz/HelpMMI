<script setup lang="ts">
import { ref } from 'vue'
import useAuth from '@/composables/useAuth'
import LoginForm from '@/components/LogIn.vue'
import RegisterForm from '@/components/Register.vue'
import LoggedIn from '@/components/LoggedIn.vue'

// composable
const { currentUser } = useAuth()

// mode de la page : 'login' ou 'register'
const mode = ref<'login' | 'register'>('login')
</script>

<template>
  <div class="flex flex-col items-center justify-center min-h-screen gap-6">
    <!-- si l'utilisateur n'est pas connecté -->
    <div v-if="!currentUser">
      <!-- formulaire connexion -->
      <div v-if="mode === 'login'">
        <h1 class="text-2xl font-bold mb-4">Connexion</h1>
        <LoginForm />
        <button @click="mode = 'register'" class="mt-3 text-blue-500 underline">
          Créer un compte
        </button>
      </div>

      <!-- formulaire inscription -->
      <div v-else>
        <h1 class="text-2xl font-bold mb-4">Inscription</h1>
        <RegisterForm />
        <button @click="mode = 'login'" class="mt-3 text-blue-500 underline">
          J’ai déjà un compte
        </button>
      </div>
    </div>

    <!-- si l'utilisateur est connecté -->

    <div v-else>
      <LoggedIn />
    </div>
  </div>
</template>
