<!--
  - Copyright 2026 storczyk.org. All rights reserved.
  - This work is licensed under the terms of the MIT license.
  - For a copy, see <https://opensource.org/licenses/MIT>.
  -
  -->

<script setup lang="ts">

import AdminMenuList from "../components/admin/AdminMenuList.vue";
import type {MenuItem} from "../components/MenuItems.ts";
import {useI18n} from "vue-i18n";
import {ArrowLeft, HardHat} from "@lucide/vue";
import NavDrawer from "../components/NavDrawer.vue";

const { t } = useI18n();

const menuList = [
  {
    type: "group",
    text: t("admin.employees.title"),
    icon: HardHat,
    links: [
      {
        type: "link",
        link: "/admin/employees",
        text: t("admin.employees.link"),
      },
      {
        type: "link",
        link: "/admin/employee-roles",
        text: t("admin.employees.roles.link"),
      },
    ],
  },
  {
    type: "link",
    link: "/",
    text: t("admin.exit"),
    icon: ArrowLeft
  },
] satisfies MenuItem[];

</script>

<template>
  <nav class="max-lg:collapse bg-base-200 lg:mb-48 shadow-sm w-full rounded-md sticky z-10">
    <input id="navbar-1-toggle" class="peer hidden" type="checkbox" />
    <label for="navbar-1-toggle" class="fixed inset-0 hidden max-lg:peer-checked:block"></label>
    <div class="collapse-title navbar">
      <div class="navbar-start">
        <label for="navbar-1-toggle" class="btn btn-ghost lg:hidden">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h8m-8 6h16" /></svg>
        </label>
        <router-link to="/admin" class="btn btn-ghost text-xl">{{ t("admin.link") }}</router-link>
      </div>
      <div class="navbar-center hidden lg:flex">
        <AdminMenuList in-navbar="true" :items="menuList"/>
      </div>
      <div class="navbar-end flex text-end justify-end items-end">
        <input type="text" placeholder="Search" class="input input-bordered w-64 lg:w-auto" />
        <NavDrawer/>
      </div>
    </div>

    <div class="collapse-content lg:hidden z-1">
      <AdminMenuList :items="menuList"/>
    </div>
  </nav>

  <main class="flex justify-center p-4 z-0">
    <slot></slot>
  </main>
</template>