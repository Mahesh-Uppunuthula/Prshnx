import { Hono } from "hono";
import { authRoute } from "./auth";
import { Env } from "../types/Env";
import protectedRoute from "./protected";
import publicRoute from "./public";

const apiRoute = new Hono<Env>()
  .basePath("/api")
  .route("/auth", authRoute)
  .route("/public", publicRoute)
  .route("/protected", protectedRoute);

export default apiRoute;
