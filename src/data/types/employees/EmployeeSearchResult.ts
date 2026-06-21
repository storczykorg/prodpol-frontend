/*
 * Copyright 2026 storczyk.org. All rights reserved.
 * This work is licensed under the terms of the MIT license.
 * For a copy, see <https://opensource.org/licenses/MIT>.
 */

import { employeeReadSchema } from "./EmployeeRead.ts";
import z from "zod";

export const employeeSearchResultSchema = z.object({
  total: z.number(),
  results: employeeReadSchema.array(),
  nextCursor: z.number().optional().nullish(),
});
export type EmployeeSearchResult = z.infer<typeof employeeSearchResultSchema>;
