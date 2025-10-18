<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { pb } from '@/backend';
const listAides = await pb.collection('Aides').getFullList();
</script>

<template>
  <h1 class="font-bold">About Page</h1>
  <div>
    <p>This page provides information about the HelpMMI application.</p>
    <ul>
      <li v-for="aide in listAides" :key="aide.id">
        {{ aide.nom }}
      </li>
    </ul>
  </div>
</template>
