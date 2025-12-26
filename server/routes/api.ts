import { Hono } from "hono";
import { authRoute } from "./auth";
import { v1Route } from "./v1";
import { Bindings } from "../app";

const apiRoute = new Hono<{ Bindings: Bindings }>()
  // .basePath("/api")
  .route("/v1", v1Route)
  .route("/auth", authRoute);

export default apiRoute;
