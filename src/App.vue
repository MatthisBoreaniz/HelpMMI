<script setup lang="ts">
import Header from './components/Header.vue';
</script>

  <template>
  <Header/>
  <main class="">
    <RouterView v-slot="{ Component }">
      <Suspense>
        <component :is="Component" :key="$route.path" />
      </Suspense>
    </RouterView>
  </main>
  <Footer/>
  </template>
