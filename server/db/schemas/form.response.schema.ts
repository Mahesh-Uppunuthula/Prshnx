import { json, pgTable, uuid } from "drizzle-orm/pg-core";
import { forms } from "./forms.schema";
import { defaultPrimaryKey, defaultTimeStamps } from "../../lib/utils";

export const formResponses = pgTable("form-responses", {
  ...defaultPrimaryKey(),
  formId: uuid()
    .references(() => forms.id)
    .notNull(),
  response: json().notNull(),
  ...defaultTimeStamps(),
});

// add association tables
