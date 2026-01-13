<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'

import useAuth from '@/composables/useAuth'

import LoginForm from '@/components/LogIn.vue'
import RegisterForm from '@/components/Register.vue'
import LoggedIn from '@/components/LoggedIn.vue'
import ImgPb from '@/components/ImgPb.vue'
import LogInOut from '@/components/LogInOut.vue'

import LayoutAuth from '@/layouts/LayoutAuth.vue'
import LayoutDefault from '@/layouts/LayoutDefault.vue'

import { pb } from '@/backend'

const { currentUser, refreshUser, loadingUser } = useAuth()

const mode = ref<'login' | 'register'>('login')
const ImageConnexion = ref<any>(null)

onMounted(async () => {
  // refresh user si déjà logué
  if (pb.authStore.isValid) {
    await refreshUser()
  } else {
    loadingUser.value = false
  }

  // récupération image PocketBase
  try {
    ImageConnexion.value = await pb
      .collection('LogosAndImages')
      .getFirstListItem('nom="ImageConnexion"')
  } catch (err) {
    console.error('Erreur récupération image:', err)
  }
})
</script>

<template>
  <!-- Loader -->
  <div v-if="loadingUser" class="flex justify-center items-center h-screen">
    Chargement...
  </div>

  <!-- User connecté -->
  <LayoutDefault v-else-if="currentUser">
    <LoggedIn />
  </LayoutDefault>

  <!-- Auth -->
  <LayoutAuth v-else>
    <div class="flex flex-col md:flex-row min-h-screen md:h-[90vh]">

      <!-- Image -->
      <div class="w-full md:w-2/5 relative h-64 md:h-full shrink-0">
        <ImgPb
          v-if="ImageConnexion"
          :record="ImageConnexion"
          :filename="ImageConnexion.image"
          class="object-cover w-full h-full md:rounded-r-2xl rounded-r-none"
        />
        <div
          class="absolute inset-0 bg-gradient-to-tr from-Bleu to-Bleu mix-blend-multiply md:rounded-tr-2xl"
        />
      </div>

      <!-- Form -->
      <div
        class="w-full md:w-3/5 flex flex-col justify-center items-center bg-white p-6 md:p-12 h-auto md:h-full"
      >
        <div class="w-full max-w-md py-8 md:py-0">

          <!-- Title -->
          <div class="mb-8 text-center md:text-left">
            <h1 class="text-Bleu font-bold font-permanent-marker text-3xl">
              REJOINS HELPMMI
            </h1>
            <h2 class="text-Bleu font-permanent-agrandir text-xl mt-2">
              Et commence tes recherches
            </h2>
          </div>

          <!-- Login / Logout provider -->
          <LogInOut class="my-8 flex justify-center items-center mx-auto" />

          <!-- Forms -->
          <Transition name="fade-slide" mode="out-in">
            <div
              v-if="mode === 'login'"
              key="login"
              class="flex flex-col items-center w-full"
            >
              <LoginForm class="w-full" />

              <div class="mt-6 flex flex-col items-center gap-2">
                <button
                  @click="mode = 'register'"
                  class="text-Bleu hover:underline"
                >
                  Pas encore inscrit ? Crée un compte !
                </button>

                <RouterLink
                  to="/ForgotPassword"
                  class="text-Bleu text-sm hover:underline"
                >
                  Mot de passe oublié ?
                </RouterLink>
              </div>
            </div>

            <div
              v-else
              key="register"
              class="flex flex-col items-center w-full"
            >
              <RegisterForm class="w-full" />
              <button
                @click="mode = 'login'"
                class="mt-6 text-Bleu hover:underline"
              >
                Tu as déjà un compte ? Connecte-toi !
              </button>
            </div>
          </Transition>
        </div>
      </div>
    </div>
  </LayoutAuth>
</template>

<style scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.5s ease-out;
}
.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
.fade-slide-enter-to,
.fade-slide-leave-from {
  opacity: 1;
  transform: translateY(0);
}
</style>
