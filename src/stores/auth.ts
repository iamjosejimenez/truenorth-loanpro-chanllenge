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
    getAuthToken(): string | null {
      return this.authToken
    },
    isAuthenticated(): boolean {
      return !!this.authToken
    }
  }
})
