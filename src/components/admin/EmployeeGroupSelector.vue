<!--
  - Copyright 2026 storczyk.org. All rights reserved.
  - This work is licensed under the terms of the MIT license.
  - For a copy, see <https://opensource.org/licenses/MIT>.
  -->

<template>
    <div>
        <label :for="labelFor" class="label">Grupa</label>
        <select :id="labelFor" class="select select-neutral text-sm" v-model="model" @click="() => refresh(false)">
            <option :value="null" disabled>Wybierz grupę</option>
            <option v-if="isPending || isPending">Ładowanie...</option>
            <option v-else-if="error">Błąd: {{ error.message }}</option>
            <template v-else>
                <option v-if="props.allowEmpty" value="empty">Brak grupy
                </option>
                <hr>
                <option v-for="role in employeeRoles ?? []" :key="role.id" :value="role.roleName">
                    {{ t(`admin.employee.roles.${role.roleName}`, role.displayName) }}
                </option>
                <hr>
                <option v-if="props.allowAll" value="all">Wszystkie grupy
                </option>
            </template>
        </select>
    </div>
</template>
<script setup lang="ts">
import {useI18n} from "vue-i18n";
import {useId} from "vue";
import {useAllEmployeeRolesQuery} from "../../data/server/employeeRoles";

const { t } = useI18n();
const labelFor = useId()

const props = defineProps<{
    allowEmpty?: boolean;
    allowAll?: boolean;
    defaultValue?: number | null | "all" | "empty";
}>()

const model = defineModel<string | "all" | "empty" | null>({ default: null });

const { data: employeeRoles, error, refresh, isPending } = useAllEmployeeRolesQuery();
</script>