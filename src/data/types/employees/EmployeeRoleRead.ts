import * as z from "zod";
import { employeeRoleSchema } from "#server/types/employees/EmployeeRole.ts";

export const employeeRoleRead = employeeRoleSchema.extend({
  employeesCount: z.number(),
});

export const employeeRoleReadArraySchema = employeeRoleRead.array();

export type EmployeeRoleRead = z.infer<typeof employeeRoleRead>;
export type EmployeeRoleReadArray = z.infer<typeof employeeRoleReadArraySchema>;
