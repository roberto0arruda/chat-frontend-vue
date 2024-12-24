<script setup>
import Navbar from '@/components/Navbars/AuthNavbar.vue'
import FooterSmall from '@/components/Footers/FooterSmall.vue'

import registerBg2 from '@/assets/img/register_bg_2.png'
</script>
<template>
  <div>
    <Navbar />
    <main>
      <section class="relative w-full h-full py-40 min-h-screen">
        <div
          class="absolute top-0 w-full h-full bg-blueGray-800 bg-no-repeat bg-full"
          :style="`background-image: url('${registerBg2}');`"
        ></div>
        <router-view />
        <FooterSmall absolute />
      </section>
    </main>
  </div>
</template>
