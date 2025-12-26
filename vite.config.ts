import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import devServer from "@hono/vite-dev-server";
import adapter from "@hono/vite-dev-server/bun";
import path from "path";
import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tanstackRouter({
      target: "react",
      routesDirectory: "./client/routes",
      generatedRouteTree: "./client/routeTree.gen.ts",
      autoCodeSplitting: true,
    }),
    react({
      babel: {
        plugins: [["babel-plugin-react-compiler"]],
      },
    }),
    tailwindcss(),
    devServer({
      entry: "./server/app.ts",
      exclude: [/^(?!\/api\/).*/],
      adapter,
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./client"),
    },
  },
  server: {
    port: Number(process.env.PORT) || 3000,
  },
  build: {
    outDir: "build/client",
  },
});
