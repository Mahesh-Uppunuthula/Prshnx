import "dotenv/config";
import { serve } from "@hono/node-server";
import app from "./app";
import { initSocket } from "./initSocket";

const PORT = process.env.PORT || 3000;

export const server = serve({
  fetch: app.fetch,
  port: Number(PORT),
});

initSocket(server);

console.log(`Server running on port ${PORT}`);

export type HttpServerType = typeof server;