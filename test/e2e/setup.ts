import { beforeAll, afterAll, afterEach, vi } from "vitest";
import { employeeHandlers } from "../mocks/handlers/employees";

interface MockHandler {
  method: string;
  urlPattern: RegExp;
  handler: (request: Request) => Response | Promise<Response>;
}

function buildHandlerTable(): MockHandler[] {
  return employeeHandlers.map((entry: any) => {
    const info = entry.info;
    const method = (info?.method ?? "GET") as string;
    const path = info?.path as string;

    const urlPattern = new RegExp(
      `^${path.replace(/:\w+/g, "([^/]+)").replace(/\//g, "\\/")}$`,
    );

    return {
      method,
      urlPattern,
      handler: async (req: Request) => {
        const res = await entry.run({ request: req });
        return new Response(res.body, {
          status: res.status,
          headers: res.headers,
        });
      },
    };
  });
}

export function setupMockApi() {
  const table = buildHandlerTable();

  beforeAll(() => {
    const originalFetch = window.fetch.bind(window);

    vi.stubGlobal("fetch", async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = typeof input === "string" ? input : "url" in input ? input.url : (input as URL).toString();
      const method = init?.method ?? "GET";
      const request = new Request(url, init);

      for (const entry of table) {
        if (entry.method === method && entry.urlPattern.test(url)) {
          return entry.handler(request);
        }
      }

      return originalFetch(input, init);
    });
  });

  afterEach(() => {
    // reset any handler state if needed
  });

  afterAll(() => {
    vi.unstubAllGlobals();
  });
}

export async function waitForMs(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
