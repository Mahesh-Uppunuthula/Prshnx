import { json, pgTable, varchar, serial } from "drizzle-orm/pg-core";
import { defaultPrimaryKey, defaultTimeStamps } from "../../lib/utils";
import z from "zod";
import { statusEnum, form_statuses } from "./enum";


export const forms = pgTable("forms", {
  ...defaultPrimaryKey(),
  title: varchar().notNull(),
  description: varchar(),
  version: serial().notNull(),
  ownerId: varchar({ length: 36 }).notNull(),
  status: statusEnum().notNull(),
  publicLink: varchar({ length: 8 }).notNull().unique(),
  configuration: json()
    .$type<{
      pages: any;
    }>()
    .notNull(),
  settings: json(),
  ...defaultTimeStamps(),
});

export type UpdateForm = Pick<
  typeof forms.$inferInsert,
  "title" | "description" | "configuration" | "settings"
>;
export type CreateForm = typeof forms.$inferInsert;

export type SelectForm = Omit<
  typeof forms.$inferSelect,
  "createdAt" | "updatedAt"
> & {
  createdAt: string;
  updatedAt: string;
}; // TODO - use drizzle-zod to convert all this

// Zod Schemas
const formsSchema = z.object({
  id: z.uuidv7({ error: "Invalid form id" }),
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  version: z.number().optional(),
  ownerId: z.uuidv7({ error: "Invalid owner id" }),
  status: z.enum(form_statuses).default("draft"),
  publicLink: z.string().optional(),
  configuration: z.object({
    pages: z.any(),
  }),
  settings: z.any().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const createFormSchema = formsSchema
  .pick({
    title: true,
    description: true,
    version: true,
    configuration: true,
    settings: true,
  })
  .required({
    version: true,
  });

export const insertFormSchema = createFormSchema
  .extend({
    ownerId: z.uuidv7({ error: "Invalid owner id" }),
    publicLink: formsSchema.shape.publicLink,
    status: formsSchema.shape.status,
  })
  .required({
    publicLink: true,
  })
  .omit({
    version: true,
    settings: true,
  });

export type InsertFormType = z.infer<typeof insertFormSchema>;
export type CreateFormType = z.infer<typeof createFormSchema>;
