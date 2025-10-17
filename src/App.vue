<script setup lang="ts">
</script>

  <template>
  <main class="">
    <RouterView v-slot="{ Component }">
      <Suspense>
        <component :is="Component" :key="$route.path" />
      </Suspense>
    </RouterView>
  </main>
  <Footer/>
  </template>
