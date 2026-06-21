<!--
  - Copyright 2026 storczyk.org. All rights reserved.
  - This work is licensed under the terms of the MIT license.
  - For a copy, see <https://opensource.org/licenses/MIT>.
  -->

<script setup lang="ts">
import EmployeeGroupSelector from "./EmployeeGroupSelector.vue";
import type {EmployeeOrderKeys} from "#server/types/employees/EmployeeOrderKeys.ts";
import {defineEmits, defineModel} from "vue";
import {useI18n} from "vue-i18n";

interface EmployeeSearchForm {
  fullName?: string
  phoneNumber?: string
  email?: string
  orderBy: EmployeeOrderKeys
  asc: string
  limit: number
  roleNames?: string[]
  cursor?: number
}

const search_params = defineModel<EmployeeSearchForm>({default: {}})
const emit = defineEmits<{ refetch: [] }>();
const {t} = useI18n();
</script>

<template>
  <fieldset class="fieldset
    bg-base-200 border-base-300 rounded-box border
    p-4 flex flex-wrap justify-between w-full gap-8">

    <legend class="fieldset-legend">{{ t("ui.search.title") }}</legend>
    <div>
      <label class="label">{{ t("admin.employees.search.full_name") }}</label>
      <input v-model="search_params.phoneNumber" :placeholder="t('ui.search.placeholder')" class="input" type="text"/>
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
      <select v-model="search_params.asc" class="select select-neutral text-sm">
        <option value="false" selected>{{ t("ui.sorting.descending") }}</option>
        <option value="true">{{ t("ui.sorting.ascending") }}</option>
      </select>
    </div>
  </fieldset>

  <div class="flex justify-between items-baseline flex-wrap w-full mt-4">
    <div class="flex gap-4 items-end">
      <button class="btn" @click="() => emit('refetch')">Odśwież</button>
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
</template>

<style scoped>

</style>