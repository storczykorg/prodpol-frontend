import { defineQuery, useQuery, type UseQueryReturn } from "@pinia/colada";

export const useServerPing: () => UseQueryReturn<unknown, Error, undefined> = defineQuery(() => {
  return useQuery({
    key: () => ["server/ping"],
    query: () => fetch(`/api/status/health`, {
      cache: "no-cache",
      priority: "low",
      method: "GET",
      headers: {
        "Content-Type": "text/plain",
      },
    })
      .then(async (res) => {
        if (res.ok)
          return await res.text();
        else
          throw Error("Error");
      }),
    staleTime: 60_000,
    autoRefetch: true,
  });
});
