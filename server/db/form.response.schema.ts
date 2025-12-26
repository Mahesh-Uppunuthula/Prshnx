import { json, pgTable, uuid, varchar } from "drizzle-orm/pg-core";
import { forms } from "./forms.schema";
import { generateISOTimestamp } from "../lib/utils";

const currentTimeStamp = generateISOTimestamp();
export const formResponses = pgTable("form-responses", {
  id: uuid(),
  formId: uuid()
    .references(() => forms.id)
    .notNull(),
  response: json().notNull(),
  createdAt: varchar().default(currentTimeStamp).notNull(),
  updatedAt: varchar().default(currentTimeStamp).notNull(),
});
