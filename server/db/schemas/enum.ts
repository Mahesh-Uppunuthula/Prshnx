import { pgEnum } from "drizzle-orm/pg-core";

export const form_statuses = ["draft", "published"] as const;

export const statusEnum = pgEnum(
  "status",
  form_statuses as unknown as [string, ...string[]],
);
