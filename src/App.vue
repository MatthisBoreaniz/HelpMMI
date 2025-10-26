<script setup lang="ts">
import Header from './components/Header.vue';
import Menu from './components/Menu.vue';
</script>

<template>
  <Header/>
  
  <div class="" :class="['/authPage', '/ForgotPassword', '/ResetPassword'].includes($route.path) ? '' : 'flex'">
    <Menu class="hidden md:block" v-if="!['/authPage', '/ForgotPassword', '/ResetPassword'].includes($route.path)" />

    <main>
      <RouterView v-slot="{ Component }">
        <Suspense>
          <component :is="Component" :key="$route.path" />
        </Suspense>
      </RouterView>
    </main>
  </div>

  <Footer/>
</template>
