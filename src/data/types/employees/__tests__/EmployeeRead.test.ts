import { describe, it, expect } from "vitest";
import { employeeReadSchema, employeeReadArraySchema } from "../EmployeeRead";

describe("employeeReadSchema", () => {
  const valid = {
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

  it("parses valid employee read", () => {
    expect(employeeReadSchema.parse(valid)).toEqual(valid);
  });

  it("rejects missing normalized fields", () => {
    const { normalizedName, ...rest } = valid;
    expect(() => employeeReadSchema.parse(rest)).toThrow();
  });

  it("accepts null roleId and defaults to 0", () => {
    const result = employeeReadSchema.parse({ ...valid, roleId: null });
    expect(result.roleId).toBe(0);
  });

  it("accepts null roleName and defaults to empty string", () => {
    const result = employeeReadSchema.parse({ ...valid, roleName: null });
    expect(result.roleName).toBe("");
  });

  it("accepts both roleId and roleName as null", () => {
    const result = employeeReadSchema.parse({ ...valid, roleId: null, roleName: null });
    expect(result.roleId).toBe(0);
    expect(result.roleName).toBe("");
  });

  it("parses array of employees", () => {
    const arr = employeeReadArraySchema.parse([valid, { ...valid, id: 2 }]);
    expect(arr).toHaveLength(2);
  });

  it("parses empty array", () => {
    expect(employeeReadArraySchema.parse([])).toEqual([]);
  });
});
