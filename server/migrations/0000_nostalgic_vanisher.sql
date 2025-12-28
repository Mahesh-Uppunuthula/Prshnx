CREATE TABLE "form-responses" (
	"id" uuid,
	"formId" uuid NOT NULL,
	"response" json NOT NULL,
	"createdAt" varchar DEFAULT '2025-12-27T19:18:23.019Z' NOT NULL,
	"updatedAt" varchar DEFAULT '2025-12-27T19:18:23.019Z' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "forms" (
	"id" uuid PRIMARY KEY NOT NULL,
	"title" varchar NOT NULL,
	"description" varchar,
	"isPublished" boolean DEFAULT false NOT NULL,
	"publicLink" varchar(8) NOT NULL,
	"configuration" json NOT NULL,
	"previewLink" varchar,
	"previewKey" varchar,
	"createdAt" varchar DEFAULT '2025-12-27T19:18:23.016Z' NOT NULL,
	"updatedAt" varchar DEFAULT '2025-12-27T19:18:23.016Z' NOT NULL,
	CONSTRAINT "forms_publicLink_unique" UNIQUE("publicLink")
);
--> statement-breakpoint
ALTER TABLE "form-responses" ADD CONSTRAINT "form-responses_formId_forms_id_fk" FOREIGN KEY ("formId") REFERENCES "public"."forms"("id") ON DELETE no action ON UPDATE no action;