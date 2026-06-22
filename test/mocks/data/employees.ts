import type { EmployeeRead } from "#server/types/employees/EmployeeRead";
import type { EmployeeSearchResult } from "#server/types/employees/EmployeeSearchResult";

let nextId = 1;

export function createEmployeeRead(overrides?: Partial<EmployeeRead>): EmployeeRead {
  const id = overrides?.id ?? nextId++;
  return {
    id,
    nameFirst: overrides?.nameFirst ?? "Jan",
    nameLast: overrides?.nameLast ?? "Kowalski",
    email: overrides?.email ?? `jan.kowalski${id}@example.com`,
    phoneNumber: overrides?.phoneNumber ?? "+48123456789",
    createdAt: overrides?.createdAt ?? "2026-01-15T10:00:00Z",
    roleId: overrides?.roleId ?? 1,
    enabled: overrides?.enabled ?? true,
    normalizedName: overrides?.normalizedName ?? "JAN KOWALSKI",
    roleName: overrides?.roleName ?? "Admin",
    normalizedEmail: overrides?.normalizedEmail ?? "JAN.KOWALSKI@EXAMPLE.COM",
  };
}

export function createEmployeeList(count: number): EmployeeRead[] {
  return Array.from({ length: count }, () => createEmployeeRead());
}

export function createSearchResult(overrides?: Partial<EmployeeSearchResult>): EmployeeSearchResult {
  return {
    total: overrides?.total ?? 1,
    results: overrides?.results ?? [createEmployeeRead()],
    nextCursor: overrides?.nextCursor ?? null,
  };
}
