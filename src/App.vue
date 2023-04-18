<script setup lang="ts">
import { RouterView } from 'vue-router'
import { useAuthStore } from './stores/auth'
import { storeToRefs } from 'pinia'
import router from './router'

const authStore = useAuthStore()
const { authToken } = storeToRefs(authStore)

const logout = () => {
  authStore.cleanToken()
  router.push('/')
}
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
        <ul v-if="authToken" class="navbar-nav ms-auto">
          <li @click="router.push('/calculator')" class="nav-item">
            <a class="nav-link" href="">Calculator</a>
          </li>
          <li @click="router.push('/records')" class="nav-item">
            <a class="nav-link" href="">Records</a>
          </li>
          <li @click="logout" class="nav-item">
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
