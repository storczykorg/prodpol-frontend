import { http, HttpResponse } from "msw";
import { createEmployeeRead, createEmployeeList, createSearchResult } from "../data/employees";
import type { EmployeeRead } from "#server/types/employees/EmployeeRead";

const allEmployees = createEmployeeList(25);

export const employeeHandlers = [
  http.get("/api/data/employees/search", ({ request }) => {
    const url = new URL(request.url);
    const fullName = url.searchParams.get("fullName");
    const email = url.searchParams.get("email");
    const phoneNumber = url.searchParams.get("phoneNumber");
    const asc = url.searchParams.get("asc");
    const roleNames = url.searchParams.get("roleNames");
    const limit = parseInt(url.searchParams.get("limit") ?? "10", 10);
    const skip = parseInt(url.searchParams.get("skip") ?? "0", 10);

    let filtered = allEmployees;

    if (fullName) {
      filtered = filtered.filter(e =>
        e.nameFirst.toLowerCase().includes(fullName.toLowerCase())
        || e.nameLast.toLowerCase().includes(fullName.toLowerCase()),
      );
    }
    if (email) {
      filtered = filtered.filter(e =>
        e.email.toLowerCase().includes(email.toLowerCase()),
      );
    }
    if (phoneNumber) {
      filtered = filtered.filter(e => e.phoneNumber.includes(phoneNumber));
    }
    if (roleNames) {
      const roles = roleNames.split(",");
      filtered = filtered.filter(e => roles.includes(e.roleName));
    }

    const total = filtered.length;
    const paged = filtered.slice(skip, skip + limit);
    const nextCursor = skip + limit < total ? skip + limit : null;

    return HttpResponse.json(createSearchResult({
      total,
      results: paged,
      nextCursor,
    }));
  }),

  http.get("/api/data/employees/all", () => {
    return HttpResponse.json(allEmployees);
  }),

  http.get("/api/data/employees/:id", ({ params }) => {
    const employee = allEmployees.find(e => e.id === Number(params.id));
    if (!employee) {
      return new HttpResponse(null, { status: 404 });
    }
    return HttpResponse.json(employee);
  }),
];
