<!--
  - Copyright 2026 storczyk.org. All rights reserved.
  - This work is licensed under the terms of the MIT license.
  - For a copy, see <https://opensource.org/licenses/MIT>.
  -
  -->

<script lang="ts" setup>

import {useI18n} from "vue-i18n";

const {t} = useI18n();

const resultCount = 13;

</script>

<template>
  <article class="contrainer
lg:w-5/6
bg-base-200 border border-base-100
rounded-2xl p-8 min-h-[50vh]
flex justify-start flex-col
items-center
gap-4
">
    <h2 class="text-2xl font-semibold">{{ t("admin.employees.roles.title") }}</h2>

    <router-link
        class="btn btn-primary btn-wide"
        to="/admin/employee-roles/add">{{ t("ui.common.add") }}
    </router-link>

    <div class="flex w-full justify-between items-baseline gap-4 w-full">
      <h3 class="text-lg">{{ t("ui.found_results", resultCount) }}</h3>

      <button class="btn">{{ t("ui.common.refresh") }}</button>
    </div>

    <div class="overflow-x-auto w-full">
      <table class="table w-full">
        <thead>
        <tr>
          <th>{{ t("admin.employees.roles.id") }}</th>
          <th>{{ t("admin.employees.roles.role_name") }}</th>
          <th>{{ t("admin.employees.roles.display_name") }}</th>
          <th>{{ t("admin.employees.roles.employee_count") }}</th>
          <th>{{ t("ui.common.options") }}</th>
        </tr>
        </thead>
      </table>
    </div>
  </article>
</template>

<style scoped>

</style>