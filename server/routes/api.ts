import { Hono } from "hono";
import { authRoute } from "./auth";
import { Bindings } from "../app";
import protectedRoute from "./protected";
import publicRoute from "./public";

const apiRoute = new Hono<{ Bindings: Bindings }>()
  .basePath("/api")
  .route("/auth", authRoute)
  .route("/public", publicRoute)
  .route("/protected", protectedRoute);

export default apiRoute;
