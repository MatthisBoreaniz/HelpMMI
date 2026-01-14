<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import AideFinder from '@/components/aideFinder.vue'
import { ref, onMounted, onUnmounted } from 'vue'

const showButton = ref(false)

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const handleScroll = () => {
  showButton.value = window.scrollY > 200
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>
<template>
  <div class="min-h-screen flex flex-col">
    <Header />
    <main class="flex-1 font-agrandir">
      <slot />
      <AideFinder />
    </main>
    <Footer />
    <button
      v-if="showButton"
      @click="scrollToTop"
      class="text-lg h-10 w-10 flex justify-center items-center lg:text-xl lg:h-12 lg:w-12 fixed bottom-4 left-4 bg-Rose text-white p-3 rounded-full shadow-lg hover:bg-white hover:border-Rose hover:text-Rose transition-colors z-50"
    >
      ↑
    </button>
  </div>
</template>
