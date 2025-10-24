<script setup lang="ts">
import { LogInWithGoogle } from '@/backend';
import useAuth from '@/composables/useAuth';

const { currentUser } = useAuth();
</script>


<template>
  <div>
    <div v-if="!currentUser">
      <button @click="LogInWithGoogle" style="padding: 10px 20px; background-color: #4285F4; color: white; border: none; border-radius: 5px; cursor: pointer;">
        Log in with Google
      </button>
    </div> 
  </div>
</template>