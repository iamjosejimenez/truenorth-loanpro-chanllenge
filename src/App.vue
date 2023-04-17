<script setup lang="ts">
import { RouterView } from 'vue-router'
import { useAuthStore } from './stores/auth'
const isAuthenticated = useAuthStore().isAuthenticated()
</script>

<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <div class="container">
      <a class="navbar-brand">TrueNorth Loanpro Challenge</a>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarToggler"
        aria-controls="navbarToggler"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarToggler">
        <ul class="navbar-nav ms-auto">
          <li class="nav-item">
            <a class="nav-link" href="">Logout</a>
          </li>
        </ul>
      </div>
    </div>
  </nav>
  <main>
    <div class="content-container">
      <RouterView />
    </div>
  </main>
</template>

<style scoped>
.content-container {
  height: 100vh;
}
</style>
