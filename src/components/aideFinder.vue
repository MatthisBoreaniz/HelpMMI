<script setup lang="ts">
import { ref, computed } from 'vue';
import aidesData from '@/assets/aides.json';

const searchTerm = ref('');
const allAides = ref(aidesData);

const filteredAides = computed(() => {
  const query = searchTerm.value.toLowerCase().trim();
  if (!query) {
    return [];
  }
  return allAides.value.filter(aide => {
    const questionMatch = aide.question.toLowerCase().includes(query);
    const reponseMatch = aide.reponse.toLowerCase().includes(query);
    const tagsMatch = aide.tags.join(' ').toLowerCase().includes(query);
    return questionMatch || reponseMatch || tagsMatch;
  });
});

const clearSearch = () => {
  searchTerm.value = '';
};

const ChatBox = ref(false);

const toggleChatBox = () => {
  ChatBox.value = !ChatBox.value;
};
</script>

<template>
  <!-- Chatbot Icon -->
  <img 
    @click="toggleChatBox" 
    class="w-16 h-16 fixed bottom-5 right-5 cursor-pointer hover:scale-110 transition-transform"
    src="../assets/Icones/chatbot.png" 
    alt="Chatbot Icon"
  />

  <!-- Chat Box -->
  <div 
    v-if="ChatBox" 
    class="fixed bottom-20 left-1/2 transform -translate-x-1/2 sm:left-auto sm:translate-x-0 sm:right-5 w-full sm:w-96 bg-white border border-gray-300 rounded-lg shadow-lg"
  >
    <!-- Chat Header -->
    <div class="flex items-center justify-between p-3 bg-Bleu text-white rounded-t-lg">
      <h3 class="text-lg font-semibold">Chat d'aide</h3>
      <button @click="toggleChatBox" class="text-white hover:text-gray-200">&times;</button>
    </div>

    <!-- Chat Content -->
    <div class="flex flex-col h-[400px]">
      <!-- Input Field -->
      <div class="p-3 border-b border-gray-300">
        <input 
          type="text"
          v-model="searchTerm"
          placeholder="Tapez un mot-clé (ex: loyer, bourse, psy, nourriture...)"
          class="w-full p-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-Bleu"
        />
      </div>

      <!-- Results List -->
      <div class="flex-1 overflow-y-auto p-3">
        <ul v-if="filteredAides.length > 0" class="space-y-2">
          <li 
            v-for="aide in filteredAides" 
            :key="aide.id" 
            class="p-2 bg-gray-100 border border-gray-200 rounded hover:bg-gray-200 cursor-pointer"
            @click="clearSearch"
          >
            <div class="font-medium text-gray-800">{{ aide.question }}</div>
            <div class="text-sm text-gray-600" v-html="aide.reponse"></div>
          </li>
        </ul>
        <div v-if="filteredAides.length === 0 && searchTerm !== ''" class="text-center text-gray-500 italic">
          Aucune aide trouvée pour "{{ searchTerm }}".
        </div>
      </div>
    </div>
  </div>
</template>