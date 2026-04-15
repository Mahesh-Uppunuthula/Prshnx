import { boolean, json, pgTable, varchar } from "drizzle-orm/pg-core";
import { defaultPrimaryKey, defaultTimeStamps } from "../../lib/utils";
export const forms = pgTable("forms", {
  ...defaultPrimaryKey(),
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
  ...defaultTimeStamps(),
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
