CREATE TABLE "form-responses" (
	"id" uuid,
	"formId" uuid NOT NULL,
	"response" json NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "forms" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar NOT NULL,
	"description" varchar,
	"ownerId" varchar(36) NOT NULL,
	"isPublished" boolean DEFAULT false NOT NULL,
	"publicLink" varchar(8) NOT NULL,
	"configuration" json NOT NULL,
	"previewLink" varchar,
	"previewKey" varchar,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "forms_publicLink_unique" UNIQUE("publicLink")
);
--> statement-breakpoint
ALTER TABLE "form-responses" ADD CONSTRAINT "form-responses_formId_forms_id_fk" FOREIGN KEY ("formId") REFERENCES "public"."forms"("id") ON DELETE no action ON UPDATE no action;