<script lang="ts">
import { loginRequest } from '../api'
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()
export default {
  data() {
    return {
      email: '',
      password: '',
      errorMessages: []
    }
  },
  methods: {
    async submitData() {
      try {
        const { token } = await loginRequest(this.email, this.password)
        authStore.setAuthToken(token)
      } catch (error: any) {
        const { non_field_errors } = error.response.data
        this.errorMessages = non_field_errors
      }
    }
  }
}
</script>
<template>
  <div class="login-container">
    <form @submit.prevent="submitData">
      <div class="mb-3">
        <label for="email" class="form-label">Email address</label>
        <input v-model="email" type="email" class="form-control" id="email" />
      </div>
      <div class="mb-3">
        <label for="password" class="form-label">Password</label>
        <input v-model="password" type="password" class="form-control" id="password" />
      </div>
      <button type="submit" class="btn btn-primary">Submit</button>
      <div v-for="error in errorMessages" class="mt-3 alert alert-danger" role="alert">
        {{ error }}
      </div>
    </form>
  </div>
</template>

<style scoped>
.login-container {
  width: 400px;
  margin-top: 40px;
}
</style>
