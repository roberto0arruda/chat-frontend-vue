import { defineStore } from 'pinia'
import { ref } from 'vue'
import router from '@/router'
import { apolloClient } from '@/apollo.js'
import gql from 'graphql-tag'

export const useAuthStore = defineStore('auth', () => {
  const loggedIn = ref(localStorage.getItem('accessToken') ?? false)
  const user = ref(null)
  const currentClient = ref(null)

  function setUser(userData) {
    user.value = userData
  }

  async function userLogin(loginData) {
    loggedIn.value = loginData.access_token

    setUser(loginData.user)

    localStorage.setItem('accessToken', loginData.access_token)
    localStorage.setItem('tokenType', loginData.token_type)
    localStorage.setItem('refreshToken', loginData.refresh_token)

    const redirect = router.currentRoute.value.query.redirect || '/'
    await router.push(redirect)
  }

  async function userLogout() {
    loggedIn.value = false
    user.value = null
    currentClient.value = null

    localStorage.removeItem('accessToken')
    localStorage.removeItem('tokenType')
    localStorage.removeItem('refreshToken')

    const redirect = router.currentRoute.value.query.redirect || '/'
    await router.push(redirect)
  }

  async function validateToken() {
    const AUTH_ME_QUERY = gql`
      query Me {
        me {
          id
          name
          email
          clients {
            id
            name
          }
        }
      }
    `

    try {
      const {data} = await apolloClient.query({
        query: AUTH_ME_QUERY,
      })

      if (data?.me) {
        data.me.clients.length === 1 ? (currentClient.value = data.me.clients[0].id) : ''

        setUser(data.me)

        const redirect = router.currentRoute.value.query.redirect || '/'
        await router.push(redirect)
      }
    } catch (error) {
      console.log(error)
      await userLogout()
    }
  }

  return {
    loggedIn,
    user,
    currentClient,
    userLogin,
    userLogout,
    validateToken,
  }
})
