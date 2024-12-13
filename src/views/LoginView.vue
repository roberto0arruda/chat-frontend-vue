<script setup>
import { ref } from 'vue'
import { useMutation } from '@vue/apollo-composable'
import { logErrorMessages } from '@vue/apollo-util'
import gql from 'graphql-tag'
import { useAuthStore } from '@/stores/auth.js'

const authStore = useAuthStore()
const username = ref('admin@dd.com')
const password = ref('11223344')

const errors = ref([])

const {
  mutate: apiLogin,
  loading,
  onDone,
  onError,
} = useMutation(gql`
  mutation Login($username: String!, $password: String!) {
    login(input: { username: $username, password: $password }) {
      access_token
      expires_in
      refresh_token
      token_type
      user {
        email
        id
        name
      }
    }
  }
`)

function appLogin() {
  if (username.value === '' || password.value === '') {
    error.value = 'Please enter username and password'
    return
  }

  apiLogin({ username: username.value, password: password.value })
}

onDone(({ data }) => {
  authStore.userLogin(data.login)
})

onError((error) => {
  errors.value = error
  logErrorMessages(error)
})
</script>

<template>
  <div class="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
    <div class="relative py-3 sm:max-w-xl sm:mx-auto">
      <div
        class="absolute inset-0 bg-gradient-to-r from-cyan-400 to-sky-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"
      ></div>
      <div class="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
        <div class="max-w-md mx-auto">
          <div>
            <h1 class="text-2xl font-semibold">Login</h1>
          </div>
          <div class="divide-y divide-gray-200">
            <div class="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
              <div class="relative">
                <input
                  autocomplete="off"
                  id="email"
                  name="email"
                  type="text"
                  class="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600"
                  placeholder="Email address"
                  v-model="username"
                />
                <label
                  for="email"
                  class="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
                  >Email Address</label
                >
              </div>
              <div class="relative">
                <input
                  autocomplete="off"
                  id="password"
                  name="password"
                  type="password"
                  class="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600"
                  placeholder="Password"
                  v-model="password"
                  @keyup.enter="appLogin"
                />
                <label
                  for="password"
                  class="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
                  >Password</label
                >
              </div>
              <div class="relative">
                <button
                  class="bg-cyan-500 text-white rounded-md px-2 py-1"
                  @click="appLogin"
                  :disabled="loading"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="w-full flex justify-center">
          <ul class="text-sm text-red-600 space-y-1" v-if="error">
            <li v-for="(error, i) of errors.graphQLErrors" :key="i">
              {{ error.message }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
