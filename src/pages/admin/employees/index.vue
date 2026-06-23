<!--
  - Copyright 2026 storczyk.org. All rights reserved.
  - This work is licensed under the terms of the MIT license.
  - For a copy, see <https://opensource.org/licenses/MIT>.
  -->

<script setup lang="ts">

import {useRouteQuery} from '@vueuse/router'
import {useI18n} from "vue-i18n";
import {computed, type ComputedRef, type Reactive, reactive, unref} from "vue";
import type {EmployeeOrderKeys} from "#server/types/employees/EmployeeOrderKeys.ts";
import type {EmployeeSearchOption} from "#server/types/employees/EmployeeSearchOption.ts";
import {useInfiniteQuery} from "@pinia/colada";
import {refDebounced, useCached} from "@vueuse/core";
import EmployeePicture from "../../../components/employees/EmployeePicture.vue";
import type {EmployeeSearchResult} from "#server/types/employees/EmployeeSearchResult.ts";
import type {EmployeeRead} from "#server/types/employees/EmployeeRead.ts";
import {defineSearchEmployeesQuery} from "../../../data/server/employees/defineSearchEmployeesQuery";
import EmployeeListOptions from "../../../components/admin/EmployeeListOptions.vue";
import EmployeeInfoRow from "../../../components/admin/EmployeeInfoRow.vue";

interface EmployeeSearchForm {
  fullName: string
  phoneNumber: string
  email: string
  orderBy: EmployeeOrderKeys
  asc: string
  limit: number
  roleNames: string[]
  cursor: number
}

const {t, d} = useI18n()

const search_params: EmployeeSearchForm = reactive({
  fullName: useRouteQuery<string>("name", ''),
  phoneNumber: useRouteQuery<string>("phoneNumber", ''),
  email: useRouteQuery<string>("email", ''),
  orderBy: useRouteQuery<EmployeeOrderKeys>("sort_key", 'EmployeeId'),
  asc: useRouteQuery<string>("sort", 'false'),
  limit: useRouteQuery("limit", '10', {transform: Number}),
  roleNames: useRouteQuery<string[]>("roleNames", []),
  cursor: useRouteQuery("page", '-1', {transform: Number}),
})

const coladaSearchOption: ComputedRef<EmployeeSearchOption> = computed(() => {
  return {
    asc: Boolean(search_params.asc === 'true'),
    cursor: Number(search_params.cursor),
    email: search_params.email,
    fullName: search_params.fullName,
    phoneNumber: search_params.phoneNumber,
    limit: Number(search_params.limit),
    orderBy: search_params.orderBy,
    roleNames: search_params.roleNames,
  } satisfies EmployeeSearchOption
})

const debouncedOptions = refDebounced(coladaSearchOption, 500)

const {
  data,
  error,
  isLoading,
  refetch,
  loadNextPage
} = useInfiniteQuery(() => defineSearchEmployeesQuery(debouncedOptions))

const pages = computed(() => {
  return unref(data)?.pages ?? [];
})

const totalResults = computed(() => {
  const _pages = unref(data)?.pages ?? [];

  if (_pages.length == 0) {
    return t("ui.found_results")
  }
  const lastPage = _pages[_pages.length - 1] as EmployeeSearchResult;
  return t("ui.found_results", Number(lastPage.total || 0))
})

</script>

<template>
  <article class="items-center flex flex-col">
    <h2 class="font-bold text-xl">{{ t("admin.employees.link") }}</h2>
    <router-link class="btn btn-primary m-4" to="/admin/employees/add">{{ t("admin.employees.add") }}</router-link>

    <EmployeeListOptions @refetch="() => refetch()" v-model="search_params"/>
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
    <div v-if="isLoading" class="flex text-center justify-center">
      <span class="loading loading-spinner loading-xl m-8"></span>
    </div>
    <div class="overflow-x-auto w-full">
      <table class="table w-full">
        <!-- head -->
        <thead>
        <tr>
          <th>
            <label>
              <input class="checkbox" type="checkbox"/>
            </label>
          </th>
          <th>
            {{ t("admin.search.full_name") }}
          </th>
          <th> {{ t("site.contact") }}</th>
          <th> {{ t("admin.employees.enabled") }}</th>
          <th></th>
        </tr>
        </thead>
        <tbody v-for="(page, pageIndex) of pages" :key="pageIndex">
        <EmployeeInfoRow :emp="item" v-for="(item) in ((page?.results ?? []) satisfies EmployeeRead[])" :key="item.id"/>
        </tbody>
      </table>
    </div>
    <div class="join">
      <button class="join-item btn" @click="() => loadNextPage()">More</button>
    </div>
  </article>
</template>

<style scoped></style>