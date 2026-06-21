/*
 * Copyright 2026 storczyk.org. All rights reserved.
 * This work is licensed under the terms of the MIT license.
 * For a copy, see <https://opensource.org/licenses/MIT>.
 */

import { defineQuery, useQuery, type UseQueryReturn } from "@pinia/colada";
import {
  type EmployeeRoleArray,
  employeeRoleArraySchema,
} from "#server/types/employees/EmployeeRole.ts";

export const useAllEmployeeRolesQuery: () => UseQueryReturn<
  EmployeeRoleArray,
  Error,
  undefined
> = defineQuery(() => {
  return useQuery({
    key: () => ["data/employee/roles"],
    enabled: false,
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
      return employeeRoleArraySchema.parse(await response.json());
    },
  });
});
