<script setup lang="ts">
import { ref, onMounted } from 'vue'
import useAuth from '@/composables/useAuth'
import LoginForm from '@/components/LogIn.vue'
import RegisterForm from '@/components/Register.vue'
import LoggedIn from '@/components/LoggedIn.vue'
import ImgPb from '@/components/ImgPb.vue'
import LayoutAuth from '@/layouts/LayoutAuth.vue'
import LayoutDefault from '@/layouts/LayoutDefault.vue'
import { pb } from '@/backend'

const { currentUser, refreshUser, loadingUser } = useAuth()
const mode = ref<'login' | 'register'>('login')
const ImageConnexion = ref(null)

// --- fetch image et user au montage ---
onMounted(async () => {
  // refresh du user si déjà logué
  if (pb.authStore.isValid) {
    await refreshUser()
  }else {
    // Sinon, pas besoin d'attendre, on stoppe le loader
    loadingUser.value = false
  }

  // récupère l'image depuis PocketBase
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
  <!-- loader tant que refreshUser est en cours -->
  <div v-if="loadingUser" class="flex justify-center items-center h-screen">
    Chargement...
  </div>

  <LayoutDefault v-else-if="currentUser">
    <LoggedIn />
  </LayoutDefault>

  <LayoutAuth v-else>
    <div class="flex flex-col md:flex-row min-h-screen md:h-[90vh]">
      <div class="w-full md:w-2/5 relative h-64 md:h-full shrink-0">
        <ImgPb
          v-if="ImageConnexion"
          :record="ImageConnexion"
          :filename="ImageConnexion.image"
          class="object-cover w-full h-full md:rounded-r-2xl rounded-r-none"
        />
        <div
          class="absolute inset-0 bg-gradient-to-tr from-Bleu to-Bleu mix-blend-multiply md:rounded-tr-2xl"
        ></div>
      </div>

      <div class="w-full md:w-3/5 flex flex-col justify-center items-center bg-white p-6 md:p-12 h-auto md:h-full">
        <div class="w-full max-w-md py-8 md:py-0">
          <div class="mb-8 text-center md:text-left">
            <h1 class="text-Bleu font-bold font-permanent-marker text-3xl">REJOINS HELPMMI</h1>
            <h2 class="text-Bleu font-permanent-agrandir text-xl mt-2">Et commence tes recherches</h2>
          </div>

          <Transition name="fade-slide" mode="out-in">
            <div v-if="mode === 'login'" key="login" class="flex flex-col items-center w-full">
              <LoginForm class="w-full" />
              <div class="mt-6 flex flex-col items-center gap-2">
                <button @click="mode = 'register'" class="text-Bleu hover:underline">
                  Pas encore inscrit ? Crée un compte !
                </button>
              </div>
            </div>

            <div v-else key="register" class="flex flex-col items-center w-full">
              <RegisterForm class="w-full" />
              <button @click="mode = 'login'" class="mt-6 text-Bleu hover:underline">
                Tu as déjà un compte ? Connecte-toi !
              </button>
            </div>
          </Transition>
        </div>
      </div>
    </div>
  </LayoutAuth>
</template>
