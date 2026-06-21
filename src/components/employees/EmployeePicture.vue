<!--
  - Copyright 2026 storczyk.org. All rights reserved.
  - This work is licensed under the terms of the MIT license.
  - For a copy, see <https://opensource.org/licenses/MIT>.
  -->

<script setup lang="ts">
import {computed} from "vue";
import type {Employee} from "#server/types/employees/Employee.ts";

const props = defineProps<{
  emp?: Employee;
  fallback?: string;
}>();

const fallback = computed(() => props.fallback ?? `https://ui-avatars.com/api/?name=${props.emp.nameFirst}+${props.emp.nameLast}&background=random`);
// Prevents a request to ".../NaN" if id is missing
const url = computed(() => {
  if (props.emp) return fallback.value;
  return String(`/api/data/employee/photos/${Number((props?.emp?.id) ?? -1)}`);
});

</script>

<template>
  <div class="avatar">
    <div class="mask mask-squircle h-12 w-12">
      <object
          class="object-cover"
          v-if="url" type="image/png" :data="url">
        <img
            class="object-cover"
            type="image/png"
            :src="fallback"/>
      </object>
      <img v-else :src="fallback" alt="Employee Placeholder"/>
    </div>
  </div>
</template>