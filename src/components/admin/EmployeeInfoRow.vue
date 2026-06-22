<script setup lang="ts">

import type {EmployeeRead} from "#server/types/employees/EmployeeRead.ts";
import EmployeePicture from "../employees/EmployeePicture.vue";
import {computed, defineProps, useId, useTemplateRef} from "vue";
import {useI18n} from "vue-i18n";
import {useMutation} from "@pinia/colada";
import {useEmployeeDelete} from "../../data/server/employees/employees.ts";
import {ApiError} from "#server/types/ApiError.ts";

const props = defineProps<{
  emp: EmployeeRead
}>()

const anchorId = useId()

const item = computed(() => props.emp)

const {t, d} = useI18n()

const options = useTemplateRef("options")

function toggleOptions() {
  const _options: HTMLUListElement | null = options.value;
  if(_options == null) return

  _options.togglePopover()
}

const {mutateAsync: deleteEmployee, error: deleteError, isPending: isDeleting} = useMutation(useEmployeeDelete());

async function handleDelete() {
  if (!window.confirm("Czy na pewno chcesz usunąć tego pracownika?")) return;
  await deleteEmployee(props.emp.id);
}
</script>

<template>
  <tr>
    <th>
      <label>
        <input class="checkbox" type="checkbox"/>
      </label>
    </th>
    <td>
      <div class="flex items-center gap-3">
        <router-link :to="`/admin/employees/${item.id}`">
          <employee-picture :emp="item"/>
          <div>
            <div class="font-bold">{{ item.nameFirst }}
              <wbr>
              {{ item.nameLast }}
            </div>
            <div class="text-sm opacity-50"> {{ item.roleName }}</div>
          </div>
        </router-link>
      </div>
    </td>
    <td>
      {{ item.email }}
      <br/>
      <span class="badge badge-ghost badge-sm"> {{ item.phoneNumber }} </span>
    </td>
    <td>{{ (item.enabled ? t("ui.common.yes") : t("ui.common.no")) }}
      <br/>
      <span class="badge badge-ghost badge-sm"> {{ t("ui.common.added") }}
                {{ d(item.createdAt) }}
              </span>
    </td>
    <th>
        <button ref="optionsButton"
                class="btn btn-ghost btn-xs" role="button"
                tabindex="0"
                @click="toggleOptions()"
                :style="`anchor-name:--anchor-${anchorId};`"
        > {{ t("ui.common.options") }}</button>
        <ul ref="options"
            popover="auto"
            class="dropdown menu w-52 rounded-box bg-base-100 shadow-sm"
            :style="`position-anchor:--anchor-${anchorId};`">
          <li>
            <router-link :to="`/admin/employees/${item.id}`">Informacje</router-link>
          </li>
          <li>
            <router-link :to="`/admin/employee-reports/${item.id}`">Raporty</router-link>
          </li>
          <li>
            <router-link :to="`/admin/employees/edit?id=${item.id}`">Edytuj</router-link>
          </li>
          <li><a class="bg-error text-error-content"
                 @click.stop="handleDelete"
                 :class="{'opacity-50': isDeleting}">Usuń</a></li>
          <li v-if="deleteError" class="text-error text-xs p-2">
            <div v-if="deleteError instanceof ApiError">
              <div v-for="(msgs, field) in deleteError.errors" :key="field">
                <strong>{{ field }}:</strong> {{ msgs.join("; ") }}
              </div>
            </div>
            <div v-else>{{ deleteError instanceof Error ? deleteError.message : "Błąd usuwania" }}</div>
          </li>
        </ul>
    </th>
  </tr>
</template>

<style scoped>

</style>