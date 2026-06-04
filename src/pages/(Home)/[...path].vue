<!--
  - Copyright 2026 storczyk.org. All rights reserved.
  - This work is licensed under the terms of the MIT license.
  - For a copy, see <https://opensource.org/licenses/MIT>.
  -->

<script lang="ts" setup>
import {useI18n} from 'vue-i18n'

const { t } = useI18n()
</script>

<template>
  <article class="prose">
  <h1> {{ t( "message.resource_not_found" ) }} </h1><br/>
  <h2> {{ t( "action.take_me" ) }}
    <router-link to="/">
    {{ t( "site.homepage" ) }}
    </router-link>
  </h2>
  </article>
</template>

<style scoped>

</style>