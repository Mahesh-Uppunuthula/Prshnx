import {
  boolean,
  json,
  pgTable,
  uuid,
  varchar,
  timestamp,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
export const forms = pgTable("forms", {
  id: uuid().primaryKey().defaultRandom(),
  title: varchar().notNull(),
  description: varchar(),
  ownerId: varchar({ length: 36 }).notNull(),
  isPublished: boolean().default(false).notNull(),
  publicLink: varchar({ length: 8 }).notNull().unique(),
  configuration: json()
    .$type<{
      settings: any;
      pages: any;
    }>()
    .notNull(),
  previewLink: varchar(),
  previewKey: varchar(),
  createdAt: timestamp({ mode: "string" }).defaultNow().notNull(),
  updatedAt: timestamp({ mode: "string" })
    .defaultNow()
    .$onUpdate(() => sql`now()`) // Use SQL function to get current timestamp
    .notNull(),
});

export type UpdateForm = Pick<
  typeof forms.$inferInsert,
  "title" | "description" | "configuration"
>;
export type CreateForm = typeof forms.$inferInsert;
export type SelectForm = Omit<
  typeof forms.$inferSelect,
  "createdAt" | "updatedAt"
> & {
  createdAt: string;
  updatedAt: string;
}; // TODO - use drizzle-zod to convert all this
