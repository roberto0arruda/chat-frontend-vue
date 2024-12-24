<script setup>
import AdminNavbar from '@/components/Navbars/AdminNavbar.vue'
import Sidebar from '@/components/Sidebar/TheSidebar.vue'
</script>

<template>
  <div>
    <Sidebar />
    <div class="relative md:ml-64 bg-blueGray-100">
      <AdminNavbar />
      <div class="px-4 md:px-10 mx-auto w-full -m-22">
        <router-view />
      </div>
    </div>
  </div>
</template>
