<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
  <section class="text-red-500">
    <h1 class="">Welcome to HelpMMI</h1>
    <p class="">
      This is the homepage of the HelpMMI application. Use the navigation to explore different
      features and sections of the app.
    </p>
  </section>
  <RouterLink to="/about" class=""> Go to About Page </RouterLink>
  <RouterLink to="/authPage" class=""> Go to Connexion</RouterLink>
</template>
