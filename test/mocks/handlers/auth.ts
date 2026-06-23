import { http, HttpResponse } from "msw";

export const authHandlers = [
  http.post("/api/employee/auth/forgotPassword", () => {
    return new HttpResponse(null, { status: 200 });
  }),
];
