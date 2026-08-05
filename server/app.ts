import "dotenv/config";
import { Hono } from "hono";
import { logger } from "hono/logger";
import { serveStatic } from "@hono/node-server/serve-static";
import { ErrorResponse } from "./types/error";
import apiRoute from "./routes/api";
import { Env } from "./types/Env";
import { ioMiddleware } from "./initSocket";

const app = new Hono<Env>();

app.use(logger());
app.use(ioMiddleware);

// server api routes when request starts with /api
app.route("/", apiRoute);

app.onError((err, ctx) => {
  console.error("Error: " + JSON.stringify(err));
  if (err instanceof ErrorResponse) {
    return ctx.json(err, err.status);
  }

  return ctx.json(ctx.error, 500);
});

// serve static client from backend in production if the request does not start with /api
// app.use("/favicon.ico", serveStatic({ path: "./client/dist/favicon.ico" }));
app.use(
  "/widget.js",
  serveStatic({
    path: "./build/client/widget.js",
  }),
);
app.use("*", serveStatic({ root: "./build/client" }));
app.get("*", serveStatic({ path: "./build/client/index.html" }));

export default app;
export type AppType = typeof apiRoute;
