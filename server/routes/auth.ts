import { Hono } from "hono";
import {
  userAuthCallback,
  loginUser,
  registerUser,
  logoutUser,
  getUserDetails,
} from "../controllers/auth.controller";
import { asyncHandler } from "../lib/utils";

export const authRoute = new Hono()
  .get("/login", asyncHandler(loginUser))
  .get("/register", asyncHandler(registerUser))
  .get("/callback", asyncHandler(userAuthCallback))
  .get("/logout", asyncHandler(logoutUser))
  .get("/me", asyncHandler(getUserDetails));
