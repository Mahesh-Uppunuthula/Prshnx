import type { AppType } from "@server/app";
import { queryOptions } from "@tanstack/react-query";
import { hc } from "hono/client";

export const client = hc<AppType>("/");

export const userQueryOptions = {
  getUserDetails: queryOptions({
    queryKey: ["get-user-details"],
    retry: false,
    queryFn: async () => {
      try {
        const res = await client.api.auth.me.$get();
        if (!res.ok) {
          throw new Error("Failed to fetch user details");
        }
        return await res.json();
      } catch (error) {
        console.error(error);
        return { user: null };
      }
    },
    staleTime: Infinity,
  }),
};
