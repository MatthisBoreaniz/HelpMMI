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
    <div class="w-full md:w-2/5 relative h-64 md:h-auto">
      <ImgPb
        v-if="ImageConnexion"
        :record="ImageConnexion"
        :filename="ImageConnexion.image"
        class="object-cover w-full h-full rounded-r-2xl"
        
      />

      <div
        class="absolute inset-0 bg-gradient-to-tr from-Bleu to-Bleu mix-blend-multiply rounded-tr-2xl"
    
      ></div>
    </div>

    <!-- Côté formulaire -->
    <div class="w-full md:w-3/5 flex flex-col justify-center items-center bg-white p-6 md:p-12">
      <div class="w-full max-w-md">
        <div class ="mb-8">
          <h1 class="text-Bleu font-bold font-permanent-marker text-3xl">REJOINS HELPMMI</h1>
          <h2 class="text-Bleu font-permanent-agrandir text-xl">Et commence tes recherches</h2>
        </div>
        <Transition name="fade-slide" mode="out-in">
          <div v-if="mode === 'login'" key="login" class="flex flex-col items-center">
            <LogInOut />
            <LoginForm />
            <div class=" mt-6 gap-2">
              <button @click="mode = 'register'" class="text-Bleu">
                Pas encore inscrit ? Crée un compte !
              </button>
            </div>
             <RouterLink class="text-Bleu" to="/ForgotPassword">
                Mot de passe oublié ?
              </RouterLink>
          </div>

          <div v-else key="register" class="flex flex-col items-center">
            <LogInOut />
            <RegisterForm />
            <button @click="mode = 'login'" class="mt-4 text-Bleu">
              Tu as déjà un compte ? Connecte-toi !
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
