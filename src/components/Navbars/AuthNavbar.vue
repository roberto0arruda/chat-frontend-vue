<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'

const navbarOpen = ref(false)

function setNavbarOpen() {
  navbarOpen.value = !navbarOpen.value
}
</script>

<template>
  <nav
    class="top-0 absolute z-50 w-full flex flex-wrap items-center justify-between px-2 py-3 navbar-expand-lg"
  >
    <div class="container px-4 mx-auto flex flex-wrap items-center justify-between">
      <div
        class="w-full relative flex justify-between lg:w-auto lg:static lg:block lg:justify-start"
      >
        <router-link
          class="text-white text-sm font-bold leading-relaxed inline-block mr-4 py-2 whitespace-nowrap uppercase"
          to="/"
        >
          Vue Notus
        </router-link>
        <button
          class="cursor-pointer text-xl leading-none px-3 py-1 border border-solid border-transparent rounded bg-transparent block lg:hidden outline-none focus:outline-none"
          type="button"
          v-on:click="setNavbarOpen"
        >
          <i class="text-white fas fa-bars"></i>
        </button>
      </div>
      <div
        class="lg:flex flex-grow items-center bg-white lg:bg-opacity-0 lg:shadow-none"
        :class="[navbarOpen ? 'block rounded shadow-lg' : 'hidden']"
        id="example-navbar-warning"
      >
        <ul class="flex flex-col lg:flex-row list-none mr-auto">

        </ul>
        <ul class="flex flex-col lg:flex-row list-none lg:ml-auto">
          <li class="flex items-center">
            <RouterLink
              to="/chat"
              class="lg:text-white lg:hover:text-blueGray-200 text-blueGray-700 px-3 py-4 lg:py-2 flex items-center text-xs uppercase font-bold"
            >
              <i
                class="lg:text-blueGray-200 text-blueGray-400 far fa-comments text-lg leading-lg mr-2"
              />
              Chat
            </RouterLink>
          </li>
          <li class="flex items-center">
            <RouterLink
              to="/bids"
              class="lg:text-white lg:hover:text-blueGray-200 text-blueGray-700 px-3 py-4 lg:py-2 flex items-center text-xs uppercase font-bold"
            >
              <i
                class="lg:text-blueGray-200 text-blueGray-400 far fa-list-alt text-lg leading-lg mr-2"
              />
              Bids
            </RouterLink>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>
