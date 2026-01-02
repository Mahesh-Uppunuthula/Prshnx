// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import devServer from "@hono/vite-dev-server";
import adapter from "@hono/vite-dev-server/bun";
import path from "path";
import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";

export default defineConfig({
  publicDir: "client/public",
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
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, "index.html"),
        widget: path.resolve(__dirname, "client/widget/widget.ts"),
      },
      output: {
        entryFileNames: (chunk) =>
          chunk.name === "widget" ? "widget.js" : "assets/[name]-[hash].js",
      },
    },
  },
});
