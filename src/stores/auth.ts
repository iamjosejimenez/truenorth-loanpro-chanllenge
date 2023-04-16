import { defineStore } from 'pinia'

interface AuthStoreState {
  authToken: string | null
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthStoreState => {
    return { authToken: null }
  },
  actions: {
    setAuthToken(authToken: string) {
      this.authToken = authToken
    },
    getAuthToken() {
      return this.authToken
    },
    isAuthenticated() {
      return !!this.authToken
    }
  }
})
