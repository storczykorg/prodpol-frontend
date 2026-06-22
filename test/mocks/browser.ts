import { setupWorker } from "msw/browser";
import { employeeHandlers } from "./handlers/employees";

export const worker = setupWorker(...employeeHandlers);
