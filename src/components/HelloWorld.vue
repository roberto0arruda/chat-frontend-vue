<script setup>
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth.js'

defineProps({
  msg: {
    type: String,
    required: true,
  },
})

const authStore = useAuthStore()

const isLoggedIn = computed(() => authStore.loggedIn)

const handleLogout = () => {
  authStore.logout()
}
</script>

<template>
  <div class="greetings">
    <div class="flex items-center space-x-2">
      <div
        class="w-3 h-3 rounded-full animate-pulse"
        :class="isLoggedIn ? 'bg-green-500' : 'bg-red-500'"
      ></div>
      <span>
        {{ isLoggedIn ? 'Usuário Logado' : 'Usuário Não Logado' }}
      </span>
      <button
        v-if="isLoggedIn"
        @click="handleLogout"
        class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
      >
        Sair
      </button>
    </div>
    <h1 class="green">{{ isLoggedIn ? authStore.user.name : msg }}</h1>
    <h3>
      {{ isLoggedIn ? 'Já podes enviar mensagens' : 'Faça login para enviar mensagens e receber respostas.' }}
    </h3>
  </div>
</template>

<style scoped>
h1 {
  font-weight: 500;
  font-size: 2.6rem;
  position: relative;
  top: -10px;
}

h3 {
  font-size: 1.2rem;
}

.greetings h1,
.greetings h3 {
  text-align: center;
}

@media (min-width: 1024px) {
  .greetings h1,
  .greetings h3 {
    text-align: left;
  }
}
</style>
