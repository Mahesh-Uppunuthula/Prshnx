import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { migrate } from "drizzle-orm/neon-http/migrator";
import "dotenv/config";

const sql = neon(process.env.DB_URL!);
const db = drizzle(sql);

async function main() {
  try {
    console.log("Migrating database...");
    await migrate(db, { migrationsFolder: "migrations" });
    console.log("Database migrated successfully");
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}
main();
