import { defineStore } from 'pinia'

interface AuthStoreState {
  authToken: string | null
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthStoreState => {
    return { authToken: localStorage.getItem('token') }
  },
  actions: {
    setAuthToken(authToken: string) {
      localStorage.setItem('token', authToken)
      this.authToken = authToken
    },
    cleanToken() {
      localStorage.removeItem('token')
      this.authToken = null
    },
    getAuthToken(): string | null {
      return this.authToken
    },
    isAuthenticated(): boolean {
      return !!this.authToken
    }
  }
})
