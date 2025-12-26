import { defineConfig } from "drizzle-kit";
export default defineConfig({
  dialect: "postgresql",
  out: "./server/migrations",
  schema: "./server/db/schema.ts",
  dbCredentials: {
    url: process.env.DB_URL!,
  },
});
