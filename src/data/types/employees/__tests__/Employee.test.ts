import { describe, it, expect } from "vitest";
import { employeeSchema } from "../Employee";

describe("employeeSchema", () => {
  const valid = {
    id: 1,
    nameFirst: "Jan",
    nameLast: "Kowalski",
    email: "jan@example.com",
    phoneNumber: "+48123456789",
    createdAt: "2026-01-15T10:00:00Z",
    roleId: 1,
    enabled: true,
  };

  it("parses valid employee", () => {
    expect(employeeSchema.parse(valid)).toEqual(valid);
  });

  it("rejects invalid email", () => {
    expect(() => employeeSchema.parse({ ...valid, email: "not-an-email" })).toThrow();
  });

  it("rejects invalid phone", () => {
    expect(() => employeeSchema.parse({ ...valid, phoneNumber: "123" })).toThrow();
  });

  it("accepts phone without + prefix", () => {
    expect(employeeSchema.parse({ ...valid, phoneNumber: "48123456789" })).toBeTruthy();
  });

  it("rejects empty name", () => {
    expect(() => employeeSchema.parse({ ...valid, nameFirst: "" })).toThrow();
  });

  it("accepts names with spaces", () => {
    expect(employeeSchema.parse({ ...valid, nameFirst: "Jan Maria" })).toBeTruthy();
  });

  it("rejects non-integer roleId", () => {
    expect(() => employeeSchema.parse({ ...valid, roleId: 1.5 })).toThrow();
  });

  it("accepts null roleId and defaults to 0", () => {
    const result = employeeSchema.parse({ ...valid, roleId: null });
    expect(result.roleId).toBe(0);
  });

  it("rejects missing fields", () => {
    expect(() => employeeSchema.parse({ id: 1 })).toThrow();
  });
});
