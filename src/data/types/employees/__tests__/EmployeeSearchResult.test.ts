import { describe, it, expect } from "vitest";
import { employeeSearchResultSchema } from "../EmployeeSearchResult";

describe("employeeSearchResultSchema", () => {
  const validEmployee = {
    id: 1,
    nameFirst: "Jan",
    nameLast: "Kowalski",
    email: "jan@example.com",
    phoneNumber: "+48123456789",
    createdAt: "2026-01-15T10:00:00Z",
    roleId: 1,
    enabled: true,
    normalizedName: "JAN KOWALSKI",
    roleName: "Admin",
    normalizedEmail: "JAN@EXAMPLE.COM",
  };

  const valid = {
    total: 1,
    results: [validEmployee],
    nextCursor: null,
  };

  it("parses valid search result", () => {
    expect(employeeSearchResultSchema.parse(valid)).toEqual(valid);
  });

  it("parses result with nextCursor", () => {
    const withCursor = { ...valid, nextCursor: 10 };
    expect(employeeSearchResultSchema.parse(withCursor).nextCursor).toBe(10);
  });

  it("parses empty results", () => {
    expect(employeeSearchResultSchema.parse({ total: 0, results: [] })).toBeTruthy();
  });

  it("rejects missing total", () => {
    const { total, ...rest } = valid;
    expect(() => employeeSearchResultSchema.parse(rest)).toThrow();
  });
});
