/*
 * Copyright 2026 storczyk.org. All rights reserved.
 * This work is licensed under the terms of the MIT license.
 * For a copy, see <https://opensource.org/licenses/MIT>.
 */

import {
  defineQuery, defineQueryOptions,
  type DefineQueryOptionsTagged,
  defineMutationOptions,
  useQuery, type UseQueryReturn,
} from "@pinia/colada";
import { type Employee, type EmployeeArray } from "#server/types/employees/Employee.ts";
import { type EmployeeRead, employeeReadArraySchema, employeeReadSchema } from "#server/types/employees/EmployeeRead.ts";
import { type MaybeRefOrGetter, toValue } from "vue";
import type { EmployeeCreateForm } from "#server/types/employees/forms/EmployeeCreateForm.ts";

export const useAllEmployeesQuery: () => UseQueryReturn<unknown, Error, undefined> = defineQuery(() => {
  return useQuery({
    key: () => ["data/employees"],
    query: () => fetch(`/api/data/employees/all`, {
      cache: "no-cache",
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (!res.ok)
          throw Error("Error");
        return res.json();
      })
      .then((res) => {
        return employeeReadArraySchema.parse(res) satisfies EmployeeArray;
      }),
    staleTime: 60_000,
    placeholderData: [] satisfies EmployeeArray,
  });
});

export const defineEmployeeQuery: (params: number) => DefineQueryOptionsTagged<EmployeeRead, Error, EmployeeRead> = defineQueryOptions((userId: number) => ({
  key: ["employee", userId],
  async query(): Promise<EmployeeRead> {
    const resp = await fetch(`/api/data/employees/${userId}`, {
      cache: "no-cache",
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!resp.ok) {
      throw new Error(`Failed to fetch employee: ${resp.statusText}`);
    }

    const data = await resp.json();
    return employeeReadSchema.parse(data);
  },
  autoRefetch: true,
}));

export function useEmployeeQuery(userId: MaybeRefOrGetter<number>): UseQueryReturn<EmployeeRead, Error, EmployeeRead> {
  return useQuery(() => defineEmployeeQuery(toValue(userId)));
}

export const useEmployeeCreate = defineMutationOptions((emp: Employee) => ({
  key: ["employee", "create", emp],
  mutation: async (vars: EmployeeCreateForm) => {
    const response = await fetch("/api/data/employees/", {
      method: "POST",
      body: JSON.stringify(vars),
    });
    if (response.ok) {
      return employeeReadSchema.safeParse(response.json());
    }

    throw new Error(`Failed to create employee: ${response.statusText}`);
  },
}));
