import { Context, Next } from "hono";
import { REQUEST_VARIABLES } from "../lib/constants";
import { ErrorResponse } from "../types/error";
import { kindeClient, sessionManager } from "../../kinde";
import { createMiddleware } from "hono/factory";

export const authMiddleware = createMiddleware(
  async (c: Context, next: Next) => {
    const manager = sessionManager(c);

    const isAuthenticated = await kindeClient.isAuthenticated(manager);

    console.log({ isAuthenticated });
    if (!isAuthenticated) {
      throw new ErrorResponse("Unauthorized", 401);
    }
    const userDetails = await kindeClient.getUser(manager);
    console.log({ userDetails });
    c.set(REQUEST_VARIABLES.USER_DETAILS, userDetails);
    await next();
  }
);
