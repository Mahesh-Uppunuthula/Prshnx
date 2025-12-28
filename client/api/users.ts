import type { AppType } from "@server/app";
import { hc } from "hono/client";

const client = hc<AppType>("/");
export const usersApi = {
  getUserDetails: async () => {
    const getUserDetailsQuery = await client.api.auth.me.$get();
    if (!getUserDetailsQuery.ok)
      throw new Error("Failed to fetch user details");
    return await getUserDetailsQuery.json();
  },
};
