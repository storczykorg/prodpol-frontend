/*
 * Copyright 2026 storczyk.org. All rights reserved.
 * This work is licensed under the terms of the MIT license.
 * For a copy, see <https://opensource.org/licenses/MIT>.
 */

import { employeeOrderKeys } from "./EmployeeOrderKeys.ts";
import z from "zod";

export const employeeSearchOptionSchema = z.object({
  orderBy: employeeOrderKeys,
  cursor: z.number().optional(),
  limit: z.number(),
  asc: z.boolean(),
  roleNames: z.string().array().optional(),
  phoneNumber: z.string().optional(),
  email: z.string().optional(),
  fullName: z.string().optional(),
});
export type EmployeeSearchOption = z.infer<typeof employeeSearchOptionSchema>;
