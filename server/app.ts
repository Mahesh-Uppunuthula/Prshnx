import { Hono } from "hono";
import { logger } from "hono/logger";
import { serveStatic } from "hono/bun";
import { ErrorResponse } from "./types/error";
import apiRoute from "./routes/api";

export type Bindings = {
  PORT: number;
  BASE_URL: string;
  KINDE_AUTH_DOMAIN: string;
  KINDE_CLIENT_ID: string;
  KINDE_CLIENT_SECRET: string;
  KINDE_REDIRECT_URL: string;
  KINDE_LOGOUT_REDIRECT_URL: string;
  DB_URL: string;
  R2_BUCKET_ENDPOINT: string;
  R2_BUCKET_NAME: string;
  R2_BUCKET_ACCESS_KEY_ID: string;
  R2_BUCKET_SECRET_ACCESS_KEY: string;
  R2_BUCKET_TOKEN: string;
};

const app = new Hono<{ Bindings: Bindings }>();

app.use(logger());
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
  })
);
app.use("*", serveStatic({ root: "./build/client" }));
app.get("*", serveStatic({ path: "./build/client/index.html" }));

export default app;
export type AppType = typeof apiRoute;
