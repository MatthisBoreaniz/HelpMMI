<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import Header from '@/components/Header.vue'
import Menu from '@/components/Menu.vue'
import Footer from '@/components/Footer.vue'
</script>
<template>
  <div class="min-h-screen flex flex-col">
    <Header />
    <div class="flex flex-1">
      <Menu class="hidden md:block" />
      <main class="flex-1">
        <slot />
      </main>
    </div>
    <Footer />
  </div>
</template>

