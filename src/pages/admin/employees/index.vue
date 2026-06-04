<!--
  - Copyright 2026 storczyk.org. All rights reserved.
  - This work is licensed under the terms of the MIT license.
  - For a copy, see <https://opensource.org/licenses/MIT>.
  -->

<script setup lang="ts">

import {useRouteQuery} from '@vueuse/router'
import {useI18n} from "vue-i18n";
import {computed, type ComputedRef, ref, unref} from "vue";
import EmployeeGroupSelector from '../../../components/admin/EmployeeGroupSelector.vue';
import type {EmployeeOrderKeys} from "#server/types/EmployeeOrderKeys.ts";
import type {EmployeeSearchOption} from "#server/types/EmployeeSearchOption.ts";
import {useInfiniteQuery} from "@pinia/colada";
import {defineSearchEmployeesQuery} from "../../../data/server/employees.ts";

const {t, d} = useI18n()

const search_params = ref({
  id: useRouteQuery("id", ''),
  fullName: useRouteQuery("name", ''),
  phoneNumber: useRouteQuery("phoneNumber", ''),
  email: useRouteQuery("email", ''),
  sort_key: useRouteQuery("sort_key", ('EmployeeId' satisfies EmployeeOrderKeys)),
  asc: useRouteQuery("sort", 'false'),
  limit: useRouteQuery("limit", '10'),
  cursor: useRouteQuery("page", '-1'),
});

const coladaSearchOption: ComputedRef<EmployeeSearchOption> = computed(() => {
  return {
    asc: Boolean(search_params.value.asc),
    cursor: Number(search_params.value.cursor),
    email: search_params.value.email,
    fullName: search_params.value.fullName,
    phoneNumber: search_params.value.phoneNumber,
    limit: Number(search_params.value.limit),
    orderBy: search_params.value.sort_key,
  } satisfies EmployeeSearchOption
})

const {
  data,
  error,
  isLoading,
  refetch,
  loadNextPage
} = useInfiniteQuery(() => defineSearchEmployeesQuery(coladaSearchOption))

</script>

<template>
  <article class="items-center flex flex-col">
    <h2 class="font-bold text-xl">{{ t("admin.employees.link") }}</h2>
    <router-link class="btn btn-primary m-4" to="/admin/employees/add">{{ t("admin.employees.add") }}</router-link>
    <fieldset class="fieldset
    bg-base-200 border-base-300 rounded-box border
    p-4 flex flex-wrap justify-between w-full gap-8">
      <legend class="fieldset-legend">{{ t("ui.search.title") }}</legend>
      <div>
        <label class="label">{{ t("admin.employees.search.identifier") }}</label>
        <input v-model="search_params.id" :placeholder="t('ui.search.placeholder')" class="input" type="text"/>
      </div>
      <div>
        <label class="label">{{ t("admin.employees.search.full_name") }}</label>
        <input v-model="search_params.fullName" :placeholder="t('ui.search.placeholder')" class="input" type="text"/>
      </div>
      <employee-group-selector :allow-all="true" :allow-empty="true" default-value="all"/>
    </fieldset>
    <fieldset class="fieldset
    bg-base-200 border-base-300 rounded-box border
    p-4 flex flex-wrap w-full justify-between gap-8">
      <legend class="fieldset-legend"> {{ t("ui.sorting.title") }}</legend>
      <fieldset class="fieldset">
        <legend class="fieldset-legend block">{{ t("ui.sorting.sorting_keys") }}</legend>
        <select class="select select-neutral text-smw-lg">
          <option selected>{{ t("ui.sorting.created_at") }}</option>
          <option>{{ t("ui.sorting.full_name") }}</option>
          <option>{{ t("ui.sorting.identifier") }}</option>
          <option>{{ t("ui.sorting.role_name") }}</option>
        </select>
      </fieldset>
      <div>
        <label class="label">{{ t("ui.sorting.sorting_order") }}</label>
        <select class="select select-neutral text-sm">
          <option selected>{{ t("ui.sorting.descending") }}</option>
          <option>{{ t("ui.sorting.ascending") }}</option>
        </select>
      </div>
    </fieldset>

    <div class="flex justify-between items-baseline flex-wrap w-full mt-4">
      <h3 class="text-lg font-semibold p-4">{{ t("ui.found_results", allEmployees?.length ?? 0) }} </h3>
      <div class="flex gap-4 items-end">
        <button class="btn" @click="() => refetch()">Odśwież</button>
        <fieldset class="fieldset">
          <legend class="fieldset-legend">Limit na stronę</legend>
          <select class="select select-neutral text-sm" v-model="search_params.limit">
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="15">15</option>
            <option value="20">20</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
        </fieldset>
      </div>
    </div>
    <div v-if="error" class="flex text-center justify-center w-full">
      <div role="alert" class="alert alert-error alert-soft m-8 w-full">
        <details class="collapse">
          <summary class="collapse-title font-semibold">
            {{ t("ui.error.loading") }}: {{ error?.message }}
          </summary>
          <div class="collapse-content text-sm">
            <h3 class="font-semibold text-lg">Callstack</h3>
            <code class="whitespace-pre-line text-sm">
              {{ error?.stack }}
            </code>
          </div>
        </details>
      </div>
    </div>
    <div v-else-if="isLoading" class="flex text-center justify-center">
      <span class="loading loading-spinner loading-xl m-8"></span>
    </div>
    <div v-for="(page, pageIndex) in data?.pages ?? []" v-else :key="pageIndex" class="overflow-x-auto w-full">
      <table class="table w-full">
        <!-- head -->
        <thead>
        <tr>
          <th>
            <label>
              <input class="checkbox" type="checkbox"/>
            </label>
          </th>
          <th> {{ t("admin.search.full_name") }}</th>
          <th> {{ t("site.contact") }}</th>
          <th> {{ t("admin.employees.enabled") }}</th>
          <th></th>
        </tr>
        </thead>
        <tbody>
        <!-- row 1 -->
        <tr v-for="item in unref(page).results" :key="item.id">
          <th>
            <label>
              <input class="checkbox" type="checkbox"/>
            </label>
          </th>
          <td>
            <div class="flex items-center gap-3">
              <div class="avatar">
                <div class="mask mask-squircle h-12 w-12">
                  <img alt="Avatar Tailwind CSS Component"
                       src="https://img.daisyui.com/images/profile/demo/2@94.webp"/>
                </div>
              </div>
              <div>
                <div class="font-bold">{{ item.nameFirst }}
                  <wbr>
                  {{ item.nameLast }}
                </div>
                <div class="text-sm opacity-50"> {{ item.roleName }}</div>
              </div>
            </div>
          </td>
          <td>
            {{ item.email }}
            <br/>
            <span class="badge badge-ghost badge-sm"> {{ item.phoneNumber }} </span>
          </td>
          <td>{{ item.enabled ? t("ui.common.yes") : t("ui.common.no") }}
            <br/>
            <span class="badge badge-ghost badge-sm"> {{ t("ui.common.added") }} {{
                d(Date.parse(item.createdAt))
              }} </span>
          </td>
          <th>
            <div class="dropdown dropdown-end">
              <div class="btn btn-ghost btn-xs" role="button" tabindex="0"> {{ t("ui.common.options") }}</div>
              <ul class="menu dropdown-content bg-base-200 rounded-box z-1 mt-4 w-52 p-2 shadow-sm" tabindex="-1">
                <li><a>Edytuj</a></li>
                <li><a class="bg-error text-error-content">Usuń</a></li>
              </ul>
            </div>
          </th>
        </tr>
        </tbody>
      </table>
    </div>
    <div class="join">
      <button class="join-item btn" @click="() => loadNextPage()">More</button>
    </div>
  </article>
</template>

<style scoped></style>