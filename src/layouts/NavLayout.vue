<script setup lang="ts">
import NavDrawer from "../components/NavDrawer.vue";
</script>

<template>
  <nav class="navbar sticky glass z-1">
    <span class="navbar-start">

    </span>
    <span class="navbar-center">
      <router-link class="font-bold text-lg btn btn-ghost" to="/">Prodpol</router-link>
    </span>
    <span class="navbar-end text-end">
      <NavDrawer/>
    </span>
  </nav>
  <main class="flex justify-center p-4 z-0">
    <slot>
    </slot>
  </main>
  <footer></footer>
</template>