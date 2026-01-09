<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'
import aidesData from '@/assets/aides.json'

interface Message {
  from: 'user' | 'bot'
  text: string
}

const searchTerm = ref('')
const allAides = ref(aidesData)
const mode = ref<'faq' | 'ai'>('faq')
const filteredAides = computed(() => {
  const query = searchTerm.value.toLowerCase().trim()
  if (!query) return []
  return allAides.value.filter((aide) => {
    const questionMatch = aide.question.toLowerCase().includes(query)
    const reponseMatch = aide.reponse.toLowerCase().includes(query)
    const tagsMatch = aide.tags.join(' ').toLowerCase().includes(query)
    return questionMatch || reponseMatch || tagsMatch
  })
})

const clearSearch = () => {
  searchTerm.value = ''
}

const ChatBox = ref(false)
const toggleChatBox = () => {
  ChatBox.value = !ChatBox.value
}

const messages = ref<Message[]>([
  { from: 'bot', text: 'Bonjour ! Pose-moi une question sur les aides étudiantes 😊' },
])

const input = ref('')
const loading = ref(false)
const chatContent = ref<HTMLElement | null>(null)

async function scrollToBottom() {
  await nextTick()
  if (chatContent.value) chatContent.value.scrollTop = chatContent.value.scrollHeight
}

// Envoi de la question au modèle Ollama
async function sendMessageToAI(question: string) {
  messages.value.push({ from: 'user', text: question })
  loading.value = true
  scrollToBottom()

  try {
    const res = await fetch('http://localhost:11434/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'aides-etudiantes', // 👈 nom EXACT du modèle
        stream: false,            // 👈 TRÈS IMPORTANT
        messages: [{ role: 'user', content: question }],
      }),
    })

    const data = await res.json()

    const answer =
      data?.message?.content ??
      'Désolé, je n’ai pas compris ta question.'

    messages.value.push({ from: 'bot', text: answer })
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err) {
    messages.value.push({
      from: 'bot',
      text: '⚠️ Impossible de contacter l’IA locale.',
    })
  }

  loading.value = false
  scrollToBottom()
}

function onEnter(e: KeyboardEvent) {
  if (e.key === 'Enter' && input.value.trim()) {
    sendMessageToAI(input.value)
    input.value = ''
  }
}
</script>

<template>
  <!-- Bouton flottant -->
  <img
    @click="toggleChatBox"
    class="w-16 h-16 fixed bottom-5 right-5 cursor-pointer hover:scale-110 transition"
    src="../assets/Icones/chatbot.png"
    alt="Chatbot"
  />

  <div
    v-if="ChatBox"
    class="fixed bottom-20 right-5 w-96 bg-white border rounded-lg shadow-lg flex flex-col"
  >
    <!-- HEADER -->
    <div class="p-3 bg-Bleu text-white rounded-t-lg">
      <h3 class="font-semibold text-center">Aide étudiante</h3>

      <!-- SWITCH -->
      <div class="flex mt-3 bg-blue-500 rounded-lg overflow-hidden">
        <button
          class="flex-1 py-1 text-sm"
          :class="mode === 'faq' ? 'bg-white text-Bleu font-semibold' : 'text-white'"
          @click="mode = 'faq'"
        >
          ⚡ Rapide
        </button>
        <button
          class="flex-1 py-1 text-sm"
          :class="mode === 'ai' ? 'bg-white text-Bleu font-semibold' : 'text-white'"
          @click="mode = 'ai'"
        >
          🧠 IA
        </button>
      </div>
    </div>

    <!-- CONTENT -->
    <div class="flex-1 overflow-y-auto p-3">

      <!-- FAQ RAPIDE -->
      <div v-if="mode === 'faq'" class="overflow-y-auto max-h-96">
        <input
          v-model="searchTerm"
          placeholder="Mot-clé (logement, bourse, repas...)"
          class="w-full p-2 mb-3 border rounded"
        />

        <div v-if="filteredAides.length === 0 && searchTerm" class="text-sm text-gray-500 italic">
          Aucun résultat trouvé.
        </div>

        <ul class="space-y-2">
          <li
        v-for="aide in filteredAides"
        :key="aide.id"
        class="p-2 bg-gray-100 rounded"
          >
        <div class="font-medium">{{ aide.question }}</div>
        <div class="text-sm text-gray-600" v-html="aide.reponse" />
          </li>
        </ul>
      </div>

      <!-- CHAT IA -->
      <div v-if="mode === 'ai'" ref="chatContent" class="flex flex-col space-y-2">
        <div
          v-for="(msg, i) in messages"
          :key="i"
          class="flex"
          :class="msg.from === 'user' ? 'justify-end' : 'justify-start'"
        >
          <div
            class="px-3 py-2 rounded-xl max-w-[80%]"
            :class="msg.from === 'user'
              ? 'bg-Bleu text-white'
              : 'bg-gray-200 text-gray-800'"
          >
            {{ msg.text }}
          </div>
        </div>

        <div v-if="loading" class="text-sm italic text-gray-500">
          L’IA réfléchit…
        </div>
      </div>
    </div>

    <!-- INPUT IA -->
    <div v-if="mode === 'ai'" class="p-3 border-t flex gap-2">
      <input
        v-model="input"
        @keydown="onEnter"
        placeholder="Pose ta question..."
        class="flex-1 p-2 border rounded"
      />
      <button
        @click="sendMessageToAI(input)"
        class="px-3 bg-Bleu text-white rounded hover:bg-blue-700"
      >
        Envoyer
      </button>
    </div>
  </div>
</template>

