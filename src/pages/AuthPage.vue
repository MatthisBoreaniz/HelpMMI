<script setup lang="ts">
import { ref} from 'vue'
import useAuth from '@/composables/useAuth'
import LoginForm from '@/components/LogIn.vue'
import RegisterForm from '@/components/Register.vue'
import LoggedIn from '@/components/LoggedIn.vue'
import ImgPb from '@/components/ImgPb.vue'
import { pb } from '@/backend'
import LogInOut from '@/components/LogInOut.vue'
import LayoutAuth from '@/layouts/LayoutAuth.vue'
const { currentUser } = useAuth()
const mode = ref<'login' | 'register'>('login')
const ImageConnexion = await pb
  .collection('LogosAndImages')
  .getFirstListItem('nom="ImageConnexion"')


</script>

<template>
  <LayoutAuth>
    <div class="flex flex-col md:flex-row min-h-screen md:h-[90vh]" v-if="!currentUser">
      
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
        <div class="w-full max-w-md py-8 md:py-0"> <div class="mb-8 text-center md:text-left"> <h1 class="text-Bleu font-bold font-permanent-marker text-3xl">REJOINS HELPMMI</h1>
            <h2 class="text-Bleu font-permanent-agrandir text-xl mt-2">Et commence tes recherches</h2>
          </div>
          
          <LogInOut class="my-8 flex justify-center items-center mx-auto" />
          
          <Transition name="fade-slide" mode="out-in">
            <div v-if="mode === 'login'" key="login" class="flex flex-col items-center w-full">
              <LoginForm class="w-full" />
              <div class="mt-6 flex flex-col items-center gap-2">
                <button @click="mode = 'register'" class="text-Bleu hover:underline">
                  Pas encore inscrit ? Crée un compte !
                </button>
                <RouterLink class="text-Bleu text-sm hover:underline" to="/ForgotPassword"> 
                   Mot de passe oublié ? 
                </RouterLink>
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

    <div v-if="currentUser" class="flex h-[calc(100vh-7rem)] justify-center items-center w-full">
      <LoggedIn />
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
