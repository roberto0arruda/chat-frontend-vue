<script setup>
import UserDropdown from '@/components/Dropdowns/UserDropdown.vue'
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth.js'

const authStore = useAuthStore()

const isLoggedIn = computed(() => authStore.loggedIn)
</script>

<template>
  <!-- Navbar -->
  <nav
    class="absolute top-0 left-0 w-full z-10 bg-transparent md:flex-row md:flex-nowrap md:justify-start flex items-center p-4"
  >
    <div
      class="w-full mx-autp items-center flex justify-between md:flex-nowrap flex-wrap md:px-10 px-4"
    >
      <!-- Brand -->
      <a
        class="text-white text-sm uppercase hidden lg:inline-block font-semibold"
        href="javascript:void(0)"
      >
        Dashboard
      </a>
      <!-- Form -->
      <form class="md:flex hidden flex-row flex-wrap items-center lg:ml-auto mr-3">
        <div class="relative flex w-full flex-wrap items-stretch"></div>
      </form>
      <!-- User -->
      <ul class="flex-col md:flex-row list-none items-center hidden md:flex">
        <div
          class="w-3 h-3 rounded-full animate-pulse mr-4"
          :class="isLoggedIn ? 'bg-green-500' : 'bg-red-500'"
        ></div>
        <UserDropdown />
      </ul>
    </div>
  </nav>
  <!-- End Navbar -->
</template>
