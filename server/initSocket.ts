import { Server } from "socket.io";
import { HttpServerType } from ".";
import { createMiddleware } from "hono/factory";

let io: Server | null;
export function initSocket(server: HttpServerType) {
  io = new Server(server, {
    path: "/ws",
    serveClient: false,
    cors: {
      origin: "*",
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log(`${socket.id} connected`);
    socket.on("message", (data: string) => {
      console.log(`${socket.id} sent a message ${data}`);
      socket.emit("message", socket.id);
    });
    socket.on("disconnect", () => {
      console.log(`${socket.id} disconnected`);
    });
  });
}

export const ioMiddleware = createMiddleware<{
  Variables: {
    io: Server;
  };
}>(async (c, next) => {
  // inject io to the context
  if (!c.var.io && io) c.set("io", io);
  await next();
});
