<script setup>
import '@/echo.js'
import { useAuthStore } from '@/stores/auth.js'
import { onMounted, ref, watch } from 'vue'
import { useMutation, useQuery } from '@vue/apollo-composable'
import gql from 'graphql-tag'

const authStore = useAuthStore()

const bids = ref([])
const newBid = ref('')
const bidContainer = ref(null)
const selectedClient = ref(authStore.currentClient?.value)

const {
  result: queryResult,
  loading,
  error,
} = useQuery(gql`
  query Bids {
    bids {
      id
      amount
      type
      status
      client {
        id
      }
    }
  }
`)

const {
  mutate: sendBidMutation,
  loading: sendBidLoading,
  onDone,
  onError,
} = useMutation(gql`
  mutation SendBid($bid: Float!) {
    createBid(
      input: {
        amount: $bid
        type: "tipo"
        status: "status"
        public_session: { connect: "1" }
        client: { connect: "1" }
        process_item: { connect: "1" }
      }
    ) {
      id
      amount
      status
      client {
        id
      }
    }
  }
`)

function scrollToBottom() {
  if (bidContainer.value) {
    bidContainer.value.scrollTop = bidContainer.value.scrollHeight
  }
}

onMounted(async () => {
  if (!authStore.user && authStore.loggedIn) {
    await authStore.validateToken()
  }

  scrollToBottom()

  window.Echo.channel('bid').listen('BidCreated', ({ bid: e }) => {
    if (e.client_id == authStore.currentClient?.id) return
    bids.value = [...bids.value, e]
  })
})

watch(bids, (newBids, oldBids) => {
  if (newBids.length > oldBids.length) {
    scrollToBottom()
  }
})

watch(
  () => queryResult.value,
  (newResult) => {
    if (newResult?.bids) {
      bids.value = newResult.bids
    }
  },
  { immediate: true },
)

function send() {
  if (newBid.value.trim()) {
    sendBidMutation({ bid: parseFloat(newBid.value.trim()) })
    newBid.value = ''
  }
}

onDone(({ data }) => {
  bids.value = [...bids.value, data.createBid]
})

onError((error) => {
  alert(error.graphQLErrors[0]?.extensions?.debugMessage)
})
</script>

<template>
  <div class="h-screen bg-gray-100 flex flex-col">
    <!-- Header -->
    <div class="bg-green-800 text-white text-center py-4">
      <h1 class="text-2xl font-bold">Bids</h1>
    </div>

    <!-- Bids -->
    <div
      ref="bidContainer"
      class="flex-1 overflow-y-auto px-4 py-2 max-w-3xl mx-auto w-full hide-scrollbar"
    >
      {{ bids }}
      <div v-if="loading" class="text-center text-gray-600">Loading...</div>

      <div v-else-if="error" class="text-center text-red-600">Error: {{ error.bid }}</div>

      <div v-else-if="bids" class="space-y-2">
        <div
          v-for="bid in bids"
          :key="bid.id"
          :class="[
            'flex items-center',
            bid.client_id === authStore.user.id ? 'justify-end' : 'justify-start',
          ]"
        >
          <div
            :class="[
              'rounded-lg p-2 shadow max-w-xs md:max-w-sm',
              bid.client_id === authStore.user.id
                ? 'bg-blue-500 text-white'
                : 'bg-white text-black',
            ]"
          >
            <strong>Fornecedor {{ bid.client.id }}:</strong>
            {{
              new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
                bid.amount,
              )
            }}
          </div>
        </div>
        <div v-if="sendMessageError" class="text-center text-red-600">
          Error: {{ sendMessageError.message }}
        </div>
        <div class="pt-5 text-center text-gray-600">aguarde para novos lances...</div>
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
          <option v-for="client in authStore.user?.clients" :key="client.id" :value="client">
            {{ client.name }}
          </option>
        </select>
        <input
          v-model="newBid"
          class="flex-grow text-black border border-gray-300 rounded-full py-2 px-4"
          type="text"
          placeholder="Type your bid..."
          @keyup.enter="send"
        />
        <button
          class="bg-blue-500 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-full"
          @click="send"
        >
          Send
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
