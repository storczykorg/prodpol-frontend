import { describe, it, expect } from "vitest";
import { employeeRoleSchema, employeeRoleArraySchema } from "../EmployeeRole";

describe("employeeRoleSchema", () => {
  const valid = {
    id: 1,
    displayName: "Administrator",
    roleName: "Admin",
  };

  it("parses valid role", () => {
    expect(employeeRoleSchema.parse(valid)).toEqual(valid);
  });

  it("rejects displayName over 100 chars", () => {
    expect(() => employeeRoleSchema.parse({ ...valid, displayName: "x".repeat(101) })).toThrow();
  });

  it("accepts displayName at 100 chars", () => {
    expect(employeeRoleSchema.parse({ ...valid, displayName: "x".repeat(100) })).toBeTruthy();
  });

  it("rejects roleName over 100 chars", () => {
    expect(() => employeeRoleSchema.parse({ ...valid, roleName: "x".repeat(101) })).toThrow();
  });

  it("parses array of roles", () => {
    const arr = employeeRoleArraySchema.parse([valid, { ...valid, id: 2 }]);
    expect(arr).toHaveLength(2);
  });
});
