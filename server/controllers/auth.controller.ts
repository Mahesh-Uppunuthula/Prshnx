import type { Context } from "hono";
import { kindeClient, sessionManager } from "../../kinde";

export const loginUser = async (c: Context) => {
  const loginUrl = await kindeClient.login(sessionManager(c));
  return c.redirect(loginUrl.toString());
};

export const registerUser = async (c: Context) => {
  const registerUrl = await kindeClient.register(sessionManager(c));
  return c.redirect(registerUrl.toString());
};

export const userAuthCallback = async (c: Context) => {
  const url = new URL(c.req.url);
  await kindeClient.handleRedirectToApp(sessionManager(c), url);
  return c.redirect("/");
};

export const logoutUser = async (c: Context) => {
  const logoutUrl = await kindeClient.logout(sessionManager(c));
  return c.redirect(logoutUrl.toString());
};

export const getUserDetails = async (c: Context) => {
  const manager = sessionManager(c);

  const isAuthenticated = await kindeClient.isAuthenticated(manager);

  // TODO fix this - use custom error and catch at authRoute.error handler
  if (!isAuthenticated) {
    throw new Error("User is not authenticated");
  }
  const user = await kindeClient.getUser(manager);
  return c.json({ user });
};
