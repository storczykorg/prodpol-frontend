import { describe, it, expect } from "vitest";
import { createEmployeeRead, createEmployeeList, createSearchResult } from "./employees";

describe("employee data factories", () => {
  it("creates a single employee", () => {
    const emp = createEmployeeRead();
    expect(emp.id).toBeGreaterThan(0);
    expect(emp.nameFirst).toBe("Jan");
    expect(emp.email).toContain("@");
    expect(emp.phoneNumber).toMatch(/^\+?\d{7,15}$/);
  });

  it("creates employee with overrides", () => {
    const emp = createEmployeeRead({ nameFirst: "Anna", roleId: 2 });
    expect(emp.nameFirst).toBe("Anna");
    expect(emp.roleId).toBe(2);
  });

  it("creates a list of employees", () => {
    const list = createEmployeeList(5);
    expect(list).toHaveLength(5);
    expect(list[0].id).not.toBe(list[1].id);
  });

  it("creates a search result", () => {
    const result = createSearchResult({ total: 100 });
    expect(result.total).toBe(100);
    expect(result.results).toHaveLength(1);
  });
});
