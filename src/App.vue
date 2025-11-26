<script setup lang="ts">
import Header from './components/Header.vue';
import Menu from './components/Menu.vue';
import Footer from './components/Footer.vue';
</script>

<template>
  <Header/>
  
  <div class="" :class="['/authPage', '/ForgotPassword', '/ResetPassword'].includes($route.path) ? '' : 'flex'">
    <Menu class="hidden md:block" v-if="!['/authPage', '/ForgotPassword', '/ResetPassword'].includes($route.path)" />

    <main class="font-agrandir w-full">
      <RouterView v-slot="{ Component }">
        <Suspense>
          <component :is="Component" :key="$route.path" />
        </Suspense>
      </RouterView>
    </main>
  </div>

  <Footer/>
</template>
