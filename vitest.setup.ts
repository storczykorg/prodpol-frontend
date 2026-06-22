import { beforeAll, afterAll, afterEach } from "vitest";
import { server } from "./test/mocks/server";

beforeAll(() => server.listen({ onUnhandledRequest: "warn" }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
