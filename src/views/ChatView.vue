<script setup>
import '@/echo.js'
import { useAuthStore } from '@/stores/auth.js'
import { onMounted, ref, watch } from 'vue'
import { useMutation, useQuery } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import { logErrorMessages } from '@vue/apollo-util'

const authStore = useAuthStore()

const messages = ref([])
const newMessage = ref('')
const messageContainer = ref(null)
const selectedClient = ref(authStore.currentClient?.value)

const {
  result: queryResult,
  loading,
  error,
} = useQuery(gql`
  query Messages {
    messages {
      id
      message
      nickname
      user {
        id
      }
    }
  }
`)

const {
  mutate: sendMessageMutation,
  loading: sendMessageLoading,
  error: sendMessageError,
  onDone,
  onError,
} = useMutation(gql`
  mutation SendMessage($message: String!, $client: ID!) {
    createMessage(
      input: { message: $message, public_session: { connect: "1" }, client: { connect: $client } }
    ) {
      id
      message
      nickname
      user {
        id
      }
    }
  }
`)

function scrollToBottom() {
  if (messageContainer.value) {
    messageContainer.value.scrollTop = messageContainer.value.scrollHeight
  }
}

onMounted(async () => {
  if (!authStore.user && authStore.loggedIn) {
    await authStore.validateToken()
  }

  scrollToBottom()

  window.Echo.channel('chat').listen('MessageCreated', ({ message: e }) => {
    if (e.user_id == authStore.user.id) return
    messages.value = [...messages.value, e]
  })
})

watch(messages, (newMessages, oldMessages) => {
  if (newMessages.length > oldMessages.length) {
    scrollToBottom()
  }
})

watch(
  () => queryResult.value,
  (newResult) => {
    if (newResult?.messages) {
      messages.value = newResult.messages
    }
  },
  { immediate: true },
)

function send() {
  if (newMessage.value.trim()) {
    sendMessageMutation({ message: newMessage.value.trim(), client: selectedClient.value?.id })
    newMessage.value = ''
  }
}

onDone(({ data }) => {
  messages.value = [...messages.value, data.createMessage]
})

onError((error) => {
  logErrorMessages(error)

  console.log(error.graphQLErrors)
  console.log(error.networkError)
})
</script>

<template>
  <div v-if="loadingUser" class="h-screen flex items-center justify-center bg-gray-100">
    <p>Loading...</p>
  </div>
  <div v-else-if="authStore.user" class="h-screen bg-gray-100 flex flex-col">
    <!-- Header -->
    <div class="bg-gray-800 text-white text-center py-4">
      <h1 class="text-2xl font-bold">Chat: {{ authStore.user.name }}</h1>
    </div>

    <!-- Chat Messages -->
    <div
      ref="messageContainer"
      class="flex-1 overflow-y-auto px-4 py-2 max-w-3xl mx-auto w-full hide-scrollbar"
    >
      <div v-if="loading" class="text-center text-gray-600">Loading...</div>

      <div v-else-if="error" class="text-center text-red-600">Error: {{ error.message }}</div>

      <div v-else-if="messages" class="space-y-2">
        <div
          v-for="msg in messages"
          :key="msg.id"
          :class="[
            'flex items-center',
            msg.user.id === authStore.user.id ? 'justify-end' : 'justify-start',
          ]"
        >
          <div
            :class="[
              'rounded-lg p-2 shadow max-w-xs md:max-w-sm',
              msg.user.id === authStore.user.id ? 'bg-blue-500 text-white' : 'bg-white text-black',
            ]"
          >
            <strong>{{ msg.nickname }}:</strong> {{ msg.message }}
          </div>
        </div>
        <div v-if="sendMessageError" class="text-center text-red-600">
          Error: {{ sendMessageError.message }}
        </div>
        <div class="pt-5 text-center text-gray-600">aguarde para novas mensagens...</div>
      </div>
    </div>

    <!-- Message Input -->
    <div class="bg-gray-200 py-2">
      <div class="flex items-center gap-2 max-w-3xl mx-auto px-4">
        <select
          v-model="selectedClient"
          class="border border-gray-300 text-blue-400 rounded-md py-2 px-4"
        >
          <option value="all" disabled>Seleciona o cliente</option>
          <option v-for="client in authStore.user.clients" :key="client.id" :value="client">
            {{ client.name }}
          </option>
        </select>
        <input
          v-model="newMessage"
          class="flex-grow text-black border border-gray-300 rounded-full py-2 px-4"
          type="text"
          placeholder="Type your message..."
          @keyup.enter="send"
        />
        <button
          :class="[
            'bg-blue-500 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-full',
            { 'opacity-50 cursor-not-allowed': sendMessageLoading },
          ]"
          @click="send"
          :disabled="sendMessageLoading"
        >
          <span
            v-if="sendMessageLoading"
            class="spinner-border spinner-border-sm text-white"
            role="status"
          ></span>
          <span v-else>Send</span>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.hide-scrollbar {
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* Internet Explorer 10+ */
}

.hide-scrollbar::-webkit-scrollbar {
  display: none; /* Chrome, Safari e Edge */
}

input {
  margin: 0;
  display: block;
}

button {
  margin: 0;
}
</style>
