<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
</script>
<template>
  <div class="min-h-screen flex flex-col">
    <Header />

    <main class="flex-1 font-agrandir">
      <slot />
    </main>

    <Footer />
  </div>
</template>
