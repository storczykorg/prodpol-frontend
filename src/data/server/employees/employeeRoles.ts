/*
 * Copyright 2026 storczyk.org. All rights reserved.
 * This work is licensed under the terms of the MIT license.
 * For a copy, see <https://opensource.org/licenses/MIT>.
 */

import {
  defineQuery,
  defineQueryOptions,
  type DefineQueryOptionsTagged,
  defineMutationOptions,
  useQuery,
  type UseQueryReturn,
} from "@pinia/colada";
import {
  type EmployeeRole,
  type EmployeeRoleArray,
  employeeRoleSchema,
  employeeRoleArraySchema,
} from "#server/types/employees/EmployeeRole.ts";
import { type MaybeRefOrGetter, toValue } from "vue";
import { type EmployeeRoleReadArray, employeeRoleReadArraySchema } from "#server/types/employees/EmployeeRoleRead.ts";

export const useAllEmployeeRolesQuery: () => UseQueryReturn<
  EmployeeRoleReadArray,
  Error,
  undefined
> = defineQuery(() => {
  return useQuery({
    key: () => ["data/employee/roles"],
    staleTime: 5 * 60 * 1000, // 5 minutes
    query: async () => {
      const response = await fetch(`/api/data/employees/roles/all`, {
        cache: "no-cache",
        method: "GET",
      });
      if (!response.ok) {
        throw new Error(
          `Failed to fetch employee roles: ${response.statusText}`,
        );
      }
      return employeeRoleReadArraySchema.parse(await response.json());
    },
  });
});

export const defineEmployeeRoleQuery: (
  id: number,
) => DefineQueryOptionsTagged<EmployeeRole, Error, EmployeeRole>
  = defineQueryOptions((id: number) => ({
    key: ["employee/role", id],
    async query(): Promise<EmployeeRole> {
      const resp = await fetch(`/api/data/employees/roles/${id}`, {
        cache: "no-cache",
        method: "GET",
      });
      if (!resp.ok) {
        throw new Error(`Failed to fetch employee role: ${resp.statusText}`);
      }
      return employeeRoleSchema.parse(await resp.json());
    },
  }));

export function useEmployeeRoleQuery(
  id: MaybeRefOrGetter<number>,
): UseQueryReturn<EmployeeRole, Error, EmployeeRole> {
  return useQuery(() => defineEmployeeRoleQuery(toValue(id)));
}

export const useEmployeeRoleCreate = defineMutationOptions(
  (role: EmployeeRole) => ({
    key: ["employee/role", "create", role],
    mutation: async (vars: Omit<EmployeeRole, "id">) => {
      const response = await fetch("/api/data/employees/roles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(vars),
      });
      if (!response.ok) {
        throw new Error(`Failed to create employee role: ${response.statusText}`);
      }
      return employeeRoleSchema.parse(await response.json());
    },
  }),
);

export const useEmployeeRoleUpdate = defineMutationOptions(
  (role: EmployeeRole) => ({
    key: ["employee/role", "update", role],
    mutation: async (vars: { id: number; patch: Array<{ op: string; path: string; value?: unknown }> }) => {
      const response = await fetch(`/api/data/employees/roles/${vars.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(vars.patch),
      });
      if (!response.ok) {
        throw new Error(`Failed to update employee role: ${response.statusText}`);
      }
      return employeeRoleSchema.parse(await response.json());
    },
  }),
);

export const useEmployeeRoleDelete = defineMutationOptions(
  (role: EmployeeRole) => ({
    key: ["employee/role", "delete", role],
    mutation: async (id: number) => {
      const response = await fetch(`/api/data/employees/roles/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error(`Failed to delete employee role: ${response.statusText}`);
      }
    },
  }),
);
