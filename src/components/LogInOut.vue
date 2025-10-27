<script setup lang="ts">
import { LogInWithGoogle } from '@/backend'

</script>

<template>
      <button
        @click="LogInWithGoogle"
        class="p-2 mb-5 bg-white text-Bleu border border-Rose rounded-md flex items-center gap-2 hover:bg-blue-100 text-sm"
      >
        <img
          src="../assets/Icones/google.png"
          alt="Logo Google"
          class="w-3 h-auto pointer-events-none"
        />
        Se connecter avec Google
      </button>
</template>

