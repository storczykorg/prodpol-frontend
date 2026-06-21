/*
 * Copyright 2026 storczyk.org. All rights reserved.
 * This work is licensed under the terms of the MIT license.
 * For a copy, see <https://opensource.org/licenses/MIT>.
 */

import * as z from "zod";

export const employeeSchema = z.object({
  id: z.number(),
  nameFirst: z.string().regex(/^(\p{L}+\s?)+$/u),
  nameLast: z.string().regex(/^(\p{L}+\s?)+$/u),
  email: z.email().regex(/(([a-zA-Z\-_.+/]+)|("([+.a-zA-Z_-]+)"))+@([a-zA-Z]+)(\.([a-zA-Z])+)*$/),
  phoneNumber: z.string().regex(/^\+?[1-9][0-9]{7,14}$/),
  createdAt: z.string(),
  roleId: z.int(),
  enabled: z.boolean(),
});

export const employeeArraySchema = employeeSchema.array();

export type Employee = z.infer<typeof employeeSchema>;
export type EmployeeArray = z.infer<typeof employeeArraySchema>;
