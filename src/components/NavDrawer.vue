<!--
  - Copyright 2026 storczyk.org. All rights reserved.
  - This work is licensed under the terms of the MIT license.
  - For a copy, see <https://opensource.org/licenses/MIT>.
  -
  -->

<script lang="ts" setup>

import {Ellipsis} from "@lucide/vue";
import {useI18n} from "vue-i18n";

const {locale} = useI18n();
</script>

<template>
  <div>
    <div class="drawer drawer-end">
      <input id="my-drawer-5" class="drawer-toggle" type="checkbox"/>
      <div class="drawer-content">
        <!-- Page content here -->
        <label class="drawer-button btn btn-ghost btn-square" for="my-drawer-5">
          <Ellipsis/>
        </label>
      </div>
      <div class="drawer-side">
        <label aria-label="close sidebar" class="drawer-overlay" for="my-drawer-5"></label>
        <ul class="menu bg-base-200 min-h-full w-80 p-4">
          <!-- Sidebar content here -->
          <li>
            <router-link to="/admin">Admin Panel</router-link>
          </li>
          <li><a>Sidebar Item 2</a></li>
          <div class="mt-auto">
            <fieldset class="fieldset">
              <legend class="fieldset-legend">Language/Język</legend>
              <select v-model="locale" class="select">
                <option value="en">English</option>
                <option value="pl">Polski</option>
              </select>
            </fieldset>
          </div>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>