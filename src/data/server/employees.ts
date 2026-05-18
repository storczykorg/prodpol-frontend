/*
 * Copyright 2026 storczyk.org. All rights reserved.
 * This work is licensed under the terms of the MIT license.
 * For a copy, see <https://opensource.org/licenses/MIT>.
 *
 */

import {defineQuery, useQuery, type UseQueryReturn} from "@pinia/colada";
import {type EmployeeArray, employeeArraySchema} from "../types/employee.ts";

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
        return employeeArraySchema.parse(res) satisfies EmployeeArray;
      }),
    staleTime: 60_000,
    placeholderData: [] satisfies EmployeeArray,
  });
});
