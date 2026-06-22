import { describe, it, expect, beforeAll, afterAll, afterEach } from "vitest";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import { employeeHandlers } from "./employees";

const server = setupServer(...employeeHandlers);

beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("employee MSW handlers", () => {
  it("returns all employees", async () => {
    const res = await fetch("/api/data/employees/all");
    expect(res.ok).toBe(true);
    const body = await res.json();
    expect(Array.isArray(body)).toBe(true);
    expect(body.length).toBeGreaterThan(0);
    expect(body[0]).toHaveProperty("id");
    expect(body[0]).toHaveProperty("nameFirst");
  });

  it("returns a single employee by id", async () => {
    const res = await fetch("/api/data/employees/1");
    expect(res.ok).toBe(true);
    const body = await res.json();
    expect(body.id).toBe(1);
  });

  it("returns 404 for unknown employee", async () => {
    const res = await fetch("/api/data/employees/99999");
    expect(res.status).toBe(404);
  });

  it("searches employees by name", async () => {
    const res = await fetch("/api/data/employees/search?fullName=jan");
    expect(res.ok).toBe(true);
    const body = await res.json();
    expect(body).toHaveProperty("total");
    expect(body).toHaveProperty("results");
    expect(Array.isArray(body.results)).toBe(true);
  });

  it("paginates search results", async () => {
    const res = await fetch("/api/data/employees/search?limit=5&skip=0");
    expect(res.ok).toBe(true);
    const body = await res.json();
    expect(body.results.length).toBeLessThanOrEqual(5);
  });
});
