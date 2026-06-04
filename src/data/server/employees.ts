/*
 * Copyright 2026 storczyk.org. All rights reserved.
 * This work is licensed under the terms of the MIT license.
 * For a copy, see <https://opensource.org/licenses/MIT>.
 */

import {defineInfiniteQueryOptions, defineQuery, useQuery, type UseQueryReturn,} from "@pinia/colada";
import {type EmployeeArray} from "../types/Employee.ts";
import {employeeReadArraySchema} from "../types/EmployeeRead.ts";
import {type EmployeeSearchResult, employeeSearchResultSchema} from "../types/EmployeeSearchResult.ts";
import {computed, type ComputedRef, unref} from "vue";
import type {EmployeeSearchOption} from "../types/EmployeeSearchOption.ts";

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

export function defineSearchEmployeesQuery(options: EmployeeSearchOption | ComputedRef<EmployeeSearchOption>) {
    return defineInfiniteQueryOptions<
        EmployeeSearchResult | ComputedRef<EmployeeSearchResult>,
        Error,
        number | null,
        undefined
    >({
        query: async ({pageParam}) => {
            const url = new URL("/api/data/employees/search", window.location.origin);
            const _options = unref(options);

            if (_options.fullName) {
                url.searchParams.set("fullName", _options.fullName);
            }
            if (_options.email) {
                url.searchParams.set("email", _options.email);
            }
            if (_options.phoneNumber) {
                url.searchParams.set("phoneNumber", _options.phoneNumber);
            }
            if (_options.limit !== undefined) {
                url.searchParams.set("limit", _options.limit.toString());
            }
            if (_options.orderBy) {
                url.searchParams.set("orderBy", _options.orderBy);
            }
            if (_options.asc !== undefined) {
                url.searchParams.set("asc", _options.asc.toString());
            }
            if (pageParam !== null) {
                url.searchParams.set("cursor", pageParam.toString());
            }

            const response = await fetch(url.toString());
            if (!response.ok) {
                throw new Error("Błąd pobierania danych pracowników");
            }

            return employeeSearchResultSchema.parse(await response.json()) satisfies EmployeeSearchResult;
        },
        key: computed(() => {
            const _options = unref(options);
            return [
                "data/employees/search",
                _options,
            ];
        }),
        initialPageParam: null,
        getNextPageParam: (lastPage) => {
            return unref(lastPage)?.nextCursor;
        },
        staleTime: 60_000,
    });
}
