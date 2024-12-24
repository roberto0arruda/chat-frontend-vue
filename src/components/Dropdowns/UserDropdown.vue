<script setup>
import { createPopper } from '@popperjs/core'
import {computed, ref} from 'vue'

import image from '@/assets/img/team-1-800x800.jpg'
import {useAuthStore} from "@/stores/auth.js";
const authStore = useAuthStore()

const isLoggedIn = computed(() => authStore.loggedIn)

const handleLogout = () => {
  authStore.userLogout()
}

const btnDropdownRef = ref(null)
const popoverDropdownRef = ref(null)
const dropdownPopoverShow = ref(false)

function toggleDropdown(event) {
  event.preventDefault()
  if (this.dropdownPopoverShow) {
    this.dropdownPopoverShow = false
  } else {
    this.dropdownPopoverShow = true
    createPopper(btnDropdownRef, popoverDropdownRef, {
      placement: 'bottom-start',
    })
  }
}
</script>

<template>
  <div>
    <a
      class="text-blueGray-500 block"
      href="#pablo"
      ref="btnDropdownRef"
      v-on:click="toggleDropdown($event)"
    >
      <div class="items-center flex">
        <span
          class="w-12 h-12 text-sm text-white bg-blueGray-200 inline-flex items-center justify-center rounded-full"
        >
          <img
            alt="..."
            class="w-full rounded-full align-middle border-none shadow-lg"
            :src="image"
          />
        </span>
      </div>
    </a>
    <div
      ref="popoverDropdownRef"
      class="bg-white text-base z-50 float-left py-2 list-none text-left rounded shadow-lg min-w-48"
      v-bind:class="{
        hidden: !dropdownPopoverShow,
        block: dropdownPopoverShow,
      }"
    >
      <a
        href="javascript:void(0);"
        class="text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-blueGray-700"
      >
        Action
      </a>
      <a
        href="javascript:void(0);"
        class="text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-blueGray-700"
      >
        Another action
      </a>
      <a
        href="javascript:void(0);"
        class="text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-blueGray-700"
      >
        Something else here
      </a>
      <div class="h-0 my-2 border border-solid border-blueGray-100" />
      <span
        v-if="isLoggedIn"
        @click="handleLogout"
        class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
      >
        Logout
      </span>
    </div>
  </div>
</template>
