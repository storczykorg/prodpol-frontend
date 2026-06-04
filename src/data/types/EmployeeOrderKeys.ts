/*
 * Copyright 2026 storczyk.org. All rights reserved.
 * This work is licensed under the terms of the MIT license.
 * For a copy, see <https://opensource.org/licenses/MIT>.
 */

import z from "zod";

export const employeeOrderKeys
    = z.enum(["EmployeeId", "Email", "PhoneNumber", "FullName"]);
export type EmployeeOrderKeys = z.infer<typeof employeeOrderKeys>;
