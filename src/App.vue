<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'
</script>

<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <div class="container">
      <a class="navbar-brand" href="">TrueNorth Loanpro Challenge</a>
    </div>
  </nav>
  <main>
    <div class="content-container">
      <RouterView />
    </div>
  </main>
</template>

<style>
.content-container {
  height: 100vh;
}
</style>
