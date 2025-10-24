<script setup lang="ts">
import { ref, watch } from 'vue'
import useAuth from '@/composables/useAuth'
import LoginForm from '@/components/LogIn.vue'
import RegisterForm from '@/components/Register.vue'
import LoggedIn from '@/components/LoggedIn.vue'
import { useRoute } from 'vue-router'
import ImgPb from './ImgPb.vue'
import { pb } from '@/backend'
import LogInOut from '@/components/LogInOut.vue'
const { currentUser } = useAuth()
const route = useRoute()
const mode = ref<'login' | 'register'>('login')
const ImageConnexion = await pb.collection('LogosAndImages').getOne('cc5yv63wbpagynl')
const Immageregister = await pb.collection('LogosAndImages').getOne('vcqkgq47v01ifeh')

watch(
  () => route.query.mode,
  (newMode) => {
    if (newMode === 'register') mode.value = 'register'
    else mode.value = 'login'
  },
  { immediate: true },
)

const checkGoogleOAuth = async () => {
  const authMethods = await pb.collection('users').listAuthMethods();
  if (!authMethods.oauth2?.providers.find(p => p.name === 'google')) {
    console.error('Google OAuth2 provider not configured or detected');
  } else {
    console.log('Google OAuth2 provider is configured');
  }
};
await checkGoogleOAuth();

</script>

<template>
  <div class="flex flex-col md:flex-row h-[90vh]" v-if="!currentUser">
    <!-- Côté image -->
    <div class="w-full md:w-1/2 relative h-64 md:h-auto">
      <ImgPb
        v-if="ImageConnexion && mode === 'login'"
        :record="ImageConnexion"
        :filename="ImageConnexion.image"
        class="object-cover w-full h-full"
        
      />

         <ImgPb
        v-if="Immageregister && mode === 'register'"
        :record="Immageregister"
        :filename="Immageregister.image"
        class="object-cover w-full h-full"
        
      />
      <div
      class="absolute inset-0 bg-black/30"
        :class="{'absolute inset-0 bg-gradient-to-tr from-blue-500/70 to-blue-500/70 mix-blend-multiply': mode === 'login',
                 'absolute inset-0 bg-gradient-to-tr from-green-600/70 to-green-600/70 mix-blend-multiply': mode === 'register'}"
      ></div>
    </div>

    <!-- Côté formulaire -->
    <div class="w-full md:w-1/2 flex flex-col justify-center items-center bg-white p-6 md:p-12">
      <div class="w-full max-w-md">
        <Transition name="fade-slide" mode="out-in">
          <div v-if="mode === 'login'" key="login" class="flex flex-col items-center">
            <h1 class="text-2xl sm:text-3xl font-bold mb-6 text-center">Connexion</h1>
            <LogInOut />
            <LoginForm />
            <div class="flex flex-col items-center mt-6 gap-2">
              <button @click="mode = 'register'" class="text-blue-500 underline">
                Créer un compte
              </button>
              <RouterLink class="text-red-500" to="/ForgotPassword">
                Mot de passe oublié ?
              </RouterLink>
            </div>
          </div>

          <div v-else key="register" class="flex flex-col items-center">
            <h1 class="text-2xl sm:text-3xl font-bold mb-6 text-center">Inscription</h1>
            <RegisterForm />
            <button @click="mode = 'login'" class="mt-4 text-blue-500 underline">
              J’ai déjà un compte
            </button>
          </div>
        </Transition>
      </div>
    </div>
  </div>

  <!-- Vue pour utilisateur connecté -->
  <div v-if="currentUser" class="flex h-[calc(100vh-7rem)] justify-center items-center w-full">
    <LoggedIn />
  </div>
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
