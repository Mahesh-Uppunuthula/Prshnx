import { json, pgTable, uuid, timestamp } from "drizzle-orm/pg-core";
import { forms } from "./forms.schema";
import { sql } from "drizzle-orm";

export const formResponses = pgTable("form-responses", {
  id: uuid(),
  formId: uuid()
    .references(() => forms.id)
    .notNull(),
  response: json().notNull(),
  createdAt: timestamp({ mode: "string" }).defaultNow().notNull(),
  updatedAt: timestamp({ mode: "string" })
    .defaultNow()
    .$onUpdate(() => sql`now()`).notNull(),
});

// add association tables
