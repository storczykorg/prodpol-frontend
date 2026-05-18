/*
 * Copyright 2026 storczyk.org. All rights reserved.
 * This work is licensed under the terms of the MIT license.
 * For a copy, see <https://opensource.org/licenses/MIT>.
 *
 */

import * as z from "zod";

export const employeeSchema = z.object({
  id: z.number().min(0),
  firstName: z.string().regex(/^(\w+\s?)+$/),
  lastName: z.string().regex(/^(\w+\s?)+$/),
  email: z.email().regex(/(([a-zA-Z\-_.+/]+)|("([+.a-zA-Z_-]+)"))+@([a-zA-Z]+)(\.([a-zA-Z])+)*$/),
  phoneNumber: z.string().regex(/^\+?[1-9][0-9]{7,14}$/),
  createdAt: z.iso.datetime(),
});

export const employeeArraySchema = employeeSchema.array();

export type Employee = z.infer<typeof employeeSchema>;
export type EmployeeArray = z.infer<typeof employeeArraySchema>;
