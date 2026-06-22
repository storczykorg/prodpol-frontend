<script setup lang="ts">

import {useAllEmployeesQuery} from "../../data/server/employees/employees.ts";
import {computed, unref} from "vue";
import EmployeeInfoRow from "./EmployeeInfoRow.vue";

const props = defineProps<{
  roleName?: string;
}>()

const { data } = useAllEmployeesQuery()

const filtered = computed(() => {
  return unref(data)?.filter(emp => emp.roleName === props.roleName);
})

</script>

<template>
<table class="table overflow-x-auto">
  <thead>

  </thead>
  <tbody>
    <EmployeeInfoRow :emp="item" v-for="item in filtered" :key="item.id"/>
  </tbody>
</table>
</template>

<style scoped>

</style>