/*
 * Copyright 2026 storczyk.org. All rights reserved.
 * This work is licensed under the terms of the MIT license.
 * For a copy, see <https://opensource.org/licenses/MIT>.
 */

import type { EmployeeSearchOption } from "#server/types/employees/EmployeeSearchOption.ts";
import { computed, type ComputedRef, type Ref, unref } from "vue";
import { defineInfiniteQueryOptions } from "@pinia/colada";
import { type EmployeeSearchResult, employeeSearchResultSchema } from "#server/types/employees/EmployeeSearchResult.ts";

export function defineSearchEmployeesQuery(options: EmployeeSearchOption | ComputedRef<EmployeeSearchOption> | Ref<EmployeeSearchOption>) {
  return defineInfiniteQueryOptions<
    EmployeeSearchResult | ComputedRef<EmployeeSearchResult>,
    Error,
    number | null,
    undefined
  >({
    query: async ({ pageParam }) => {
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
        url.searchParams.set("orderBy.value", _options.orderBy);
      }
      if (_options.asc !== undefined) {
        url.searchParams.set("asc", _options.asc ? "true" : "false");
      }
      if (_options.roleNames) {
        url.searchParams.set("roleNames", _options.roleNames.join(","));
      }
      if (pageParam !== null) {
        url.searchParams.set("skip", pageParam.toString());
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
    placeholderData: previousData => previousData,
  });
}
