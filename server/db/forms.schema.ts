import { boolean, json, pgTable, uuid, varchar } from "drizzle-orm/pg-core";
import { generateISOTimestamp } from "../lib/utils";
const currentTimeStamp = generateISOTimestamp();
export const forms = pgTable("forms", {
  id: uuid().primaryKey(),
  title: varchar().notNull(),
  description: varchar(),
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
  createdAt: varchar().default(currentTimeStamp).notNull(),
  updatedAt: varchar().default(currentTimeStamp).notNull(),
});

export type CreateForm = typeof forms.$inferInsert;
export type SelectForm = typeof forms.$inferSelect;
