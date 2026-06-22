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
import {
  type EmployeeRead,
  type EmployeeReadArray,
  employeeReadArraySchema,
  employeeReadSchema,
} from "#server/types/employees/EmployeeRead.ts";
import { type MaybeRefOrGetter, toValue } from "vue";
import type { EmployeeCreateForm } from "#server/types/employees/forms/EmployeeCreateForm.ts";
import { apiErrorSchema, ApiError } from "#server/types/ApiError.ts";

export const useAllEmployeesQuery: () => UseQueryReturn<EmployeeReadArray, Error, undefined> = defineQuery(() => {
  return useQuery({
    key: () => ["data/employees"],
    query: async () => {
      const url = new URL(`/api/data/employees/all`, window.location.origin);

      const res = await fetch(url, {
        cache: "no-cache",
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!res.ok)
        throw Error("Error");
      const res_1 = await res.json();
      return employeeReadArraySchema.parse(res_1) satisfies EmployeeReadArray;
    },
    staleTime: 60_000,
    placeholderData: [] satisfies EmployeeReadArray,
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

export const useEmployeeCreate = defineMutationOptions(() => ({
  key: ["employee", "create"],
  mutation: async (vars: EmployeeCreateForm) => {
    const response = await fetch("/api/data/employees/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(vars),
    });
    if (!response.ok) {
      const body = await response.json().catch(() => null);
      const parsed = apiErrorSchema.safeParse(body);
      if (parsed.success) {
        throw new ApiError(parsed.data.status, parsed.data.errors);
      }
      throw new Error(`Failed to create employee: ${response.statusText}`);
    }
    return employeeReadSchema.parse(await response.json());
  },
}));

export const useEmployeeUpdate = defineMutationOptions(() => ({
  key: ["employee", "update"],
  mutation: async (vars: {
    id: number;
    patch: Array<{ op: "replace" | "add" | "remove"; path: string; value?: unknown }>;
  }) => {
    const response = await fetch(`/api/data/employees/${vars.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "text/json" },
      body: JSON.stringify(vars.patch),
    });
    if (!response.ok) {
      const body = await response.json().catch(() => null);
      const parsed = apiErrorSchema.safeParse(body);
      if (parsed.success) {
        throw new ApiError(parsed.data.status, parsed.data.errors);
      }
      throw new Error(`Failed to update employee: ${response.statusText}`);
    }
    return employeeReadSchema.parse(await response.json());
  },
}));

export const useEmployeeDelete = defineMutationOptions(() => ({
  key: ["employee", "delete"],
  mutation: async (id: number) => {
    const response = await fetch(`/api/data/employees/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      const body = await response.json().catch(() => null);
      const parsed = apiErrorSchema.safeParse(body);
      if (parsed.success) {
        throw new ApiError(parsed.data.status, parsed.data.errors);
      }
      throw new Error(`Failed to delete employee: ${response.statusText}`);
    }
  },
}));
