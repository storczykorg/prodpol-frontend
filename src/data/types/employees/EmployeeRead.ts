/*
 * Copyright 2026 storczyk.org. All rights reserved.
 * This work is licensed under the terms of the MIT license.
 * For a copy, see <https://opensource.org/licenses/MIT>.
 */

import { employeeSchema } from "./Employee.ts";
import z from "zod";

export const employeeReadSchema = employeeSchema.extend({
  normalizedName: z.string(),
  roleName: z.string(),
  normalizedEmail: z.string(),
});
export const employeeReadArraySchema = employeeReadSchema.array();
export type EmployeeRead = z.infer<typeof employeeReadSchema>;
export type EmployeeReadArray = z.infer<typeof employeeReadArraySchema>;
