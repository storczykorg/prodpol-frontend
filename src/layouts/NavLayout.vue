<script setup lang="ts">

</script>

<template>
  <nav class="navbar sticky flex justify-between items-center glass">
    <span>

    </span>
    <span>
      <router-link class="font-bold text-lg" to="/">Prodpol</router-link>
    </span>
    <span>

    </span>
  </nav>
  <main class="flex justify-center p-4">
    <slot></slot>
  </main>
  <footer></footer>
</template>