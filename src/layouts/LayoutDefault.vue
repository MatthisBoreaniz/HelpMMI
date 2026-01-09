<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import Header from '@/components/Header.vue'
import Menu from '@/components/Menu.vue'
import Footer from '@/components/Footer.vue'
import AideFinder from '@/components/aideFinder.vue';
</script>
<template>
  <div class="min-h-screen flex flex-col">
    <Header />
    <div class="lg:flex lg:flex-1 md:flex md:flex-1">
      <Menu class="hidden md:block" />
      <main class="flex-1 font-agrandir">
        <slot />
        <AideFinder />
      </main>
    </div>
    <Footer />
  </div>
</template>

