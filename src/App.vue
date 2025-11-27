<script setup lang="ts">
import Footer from './components/Footer.vue';
import Header from './components/Header.vue';
import Menu from './components/Menu.vue';

</script>

<template>
  <div class="min-h-screen flex flex-col">
    <Header />

    <div
      class="flex flex-1"
      :class="['/authPage', '/ForgotPassword', '/ResetPassword'].includes($route.path) ? 'block' : 'flex'"
    >
      <Menu
        class="hidden md:block"
        v-if="!['/authPage', '/ForgotPassword', '/ResetPassword'].includes($route.path)"
      />

      <main class="font-agrandir w-full flex-1">
        <RouterView v-slot="{ Component }">
          <Suspense>
            <component :is="Component" :key="$route.path" />
          </Suspense>
        </RouterView>
      </main>
    </div>

    <Footer />
  </div>
</template>
