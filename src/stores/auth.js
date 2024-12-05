import { defineStore } from 'pinia'
import { ref } from 'vue'
import router from '@/router'

export const useAuthStore = defineStore('auth', () => {
  const loggedIn = ref(false)
  const user = ref(null)

  function userLogin(loginData) {
    loggedIn.value = true
    user.value = loginData.user

    localStorage.setItem('accessToken', loginData.access_token)
    localStorage.setItem('tokenType', loginData.token_type)
    localStorage.setItem('refreshToken', loginData.refresh_token)

    const redirect = router.currentRoute.value.query.redirect || '/'
    router.push(redirect)
  }

  function logout() {
    loggedIn.value = false
    user.value = null
    localStorage.removeItem('accessToken')
    localStorage.removeItem('tokenType')
    localStorage.removeItem('refreshToken')

    const redirect = router.currentRoute.value.query.redirect || '/'
    router.push(redirect)
  }

  return {
    loggedIn,
    user,
    userLogin,
    logout,
  }
})
