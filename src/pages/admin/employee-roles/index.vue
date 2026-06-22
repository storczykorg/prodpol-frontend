<!--
  - Copyright 2026 storczyk.org. All rights reserved.
  - This work is licensed under the terms of the MIT license.
  - For a copy, see <https://opensource.org/licenses/MIT>.
  -->

<script lang="ts" setup>

import {useI18n} from "vue-i18n";
import {ref, computed} from "vue";
import {useAllEmployeeRolesQuery} from "../../../data/server/employees/employeeRoles";
import AllEmployeesList from "../../../components/admin/AllEmployeesList.vue";

const {t} = useI18n();

const search = ref("");
const {data: roles, isLoading, error, refresh} = useAllEmployeeRolesQuery();

const filtered = computed(() => {
  const q = search.value.toLowerCase();
  const list = roles.value ?? [];
  if (!q) return list;
  return list.filter(r =>
    r.roleName?.toLowerCase().includes(q) ||
    r.displayName?.toLowerCase().includes(q)
  );
});

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
      <input
        v-model="search"
        :placeholder="t('ui.search.placeholder')"
        class="input input-bordered w-full max-w-xs"
        type="text"
      />
      <h3 class="text-lg">{{ t("ui.found_results", filtered.length) }}</h3>
      <button class="btn" @click="refresh()">{{ t("ui.common.refresh") }}</button>
    </div>

    <div v-if="isLoading" class="flex text-center justify-center">
      <span class="loading loading-spinner loading-xl m-8"></span>
    </div>

    <div v-else-if="error" class="flex text-center justify-center w-full">
      <div role="alert" class="alert alert-error alert-soft m-8 w-full">
        {{ error.message }}
      </div>
    </div>

    <div v-else class="overflow-x-auto w-full">
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
        <tbody>
        <template v-for="role in filtered" :key="role.id">
          <tr>
            <td>{{ role.id }}</td>
            <td>{{ role.roleName }}</td>
            <td>{{ role.displayName }}</td>
            <td>{{ role.employeesCount }}</td>
            <td>
              <div class="dropdown dropdown-end">
                <div class="btn btn-ghost btn-xs" role="button" tabindex="0">{{ t("ui.common.options") }}</div>
                <ul class="menu dropdown-content bg-base-200 rounded-box z-1 mt-4 w-52 p-2 shadow-sm" tabindex="-1">
                  <li><router-link :to="`/admin/employee-roles/edit?id=${role.id}`">{{ t("action.edit") }}</router-link></li>
                  <li><a class="bg-error text-error-content">{{ t("action.delete") }}</a></li>
                </ul>
              </div>
            </td>
          </tr>
          <tr>
            <td/>
            <td colspan="4">
              <details class="collapse">
                <summary class="font-semibold hover:cursor-pointer">{{ t("admin.employees.roles.employee_list") }}</summary>
                <div class="collapse-content text-sm">
                  <AllEmployeesList :role-name="role.roleName"/>
                </div>
              </details>
            </td>
          </tr>
        </template>
        </tbody>
      </table>
    </div>
  </article>
</template>

<style scoped>

</style>