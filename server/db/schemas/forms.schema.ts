import { boolean, json, pgTable, uuid, varchar } from "drizzle-orm/pg-core";
import { generateISOTimestamp } from "../../lib/utils";
const currentTimeStamp = generateISOTimestamp();
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
  createdAt: varchar().default(currentTimeStamp).notNull(),
  updatedAt: varchar()
    .default(currentTimeStamp)
    .notNull()
    .$onUpdate(() => generateISOTimestamp()),
});

export type UpdateForm = Pick<
  typeof forms.$inferInsert,
  "title" | "description" | "configuration"
>;
export type CreateForm = typeof forms.$inferInsert;
export type SelectForm = typeof forms.$inferSelect;
