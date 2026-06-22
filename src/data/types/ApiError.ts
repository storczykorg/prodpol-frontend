import * as z from "zod";

export const apiErrorSchema = z.object({
  type: z.string(),
  title: z.string(),
  status: z.number(),
  errors: z.record(z.array(z.string())),
  traceId: z.string().optional(),
});

export class ApiError extends Error {
  public errors: Record<string, string[]>;
  public status: number;

  constructor(status: number, errors: Record<string, string[]>) {
    const msg = Object.entries(errors)
      .map(([field, msgs]) => `${field}: ${msgs.join("; ")}`)
      .join("\n");
    super(msg);
    this.name = "ApiError";
    this.status = status;
    this.errors = errors;
  }
}
