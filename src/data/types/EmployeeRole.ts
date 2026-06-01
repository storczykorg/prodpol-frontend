/*
 * Copyright 2026 storczyk.org. All rights reserved.
 * This work is licensed under the terms of the MIT license.
 * For a copy, see <https://opensource.org/licenses/MIT>.
 */

import * as z from "zod";

export const employeeRoleSchema = z.object({
  id: z.number(),
  displayName: z.string().max(100),
  roleName: z.string().max(100),
});

export const employeeRoleArraySchema = employeeRoleSchema.array();

export type EmployeeRole = z.infer<typeof employeeRoleSchema>;
export type EmployeeRoleArray = z.infer<typeof employeeRoleArraySchema>;
