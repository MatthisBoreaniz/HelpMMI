<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import useAuth from '@/composables/useAuth';
import ImgPb from '@/pages/ImgPb.vue';
import { RouterLink } from 'vue-router';

const { currentUser, logout } = useAuth();

</script>

<template>
    <header class="w-full bg-gray-800 text-white p-4 flex justify-between items-center">
        <div>
            <RouterLink class="text-3xl font-bold" to="/">
                Mon Application Vue
            </RouterLink>
        </div>

        <div>
            <div v-if="currentUser" class="flex items-center gap-4">
                <span class="flex flex-col items-center">
                  <ImgPb
                    v-if="currentUser?.expand?.relAvatars"
                    :record="currentUser.expand.relAvatars"
                    :filename="currentUser.expand.relAvatars.image"
                    class="w-10 h-10 rounded-full object-cover mb-1"
                    />
                    <p>{{ currentUser?.name }}</p>
                </span> 
                <button
                    @click="logout"
                    class="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-500"
                >
                    Déconnexion
                </button>
            </div>
            <div v-else>
                <RouterLink
                    to="/authPage"
                    class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500"
                >
                    Connexion
                </RouterLink>
            </div>
        </div>
    </header>
</template>