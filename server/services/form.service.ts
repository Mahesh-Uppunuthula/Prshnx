import { and, eq, exists, getTableColumns, sql } from "drizzle-orm";
import { db } from "../db";
import {
  forms,
  UpdateForm,
  type CreateForm,
  type SelectForm,
} from "../db/schemas/forms.schema";
import { generateImageId, generatePublicLink } from "../lib/utils";
import { R2Service } from "./r2.service";
import { ErrorResponse } from "../types/error";
import { v4 as uuidv4 } from "uuid";
import { UserType } from "@kinde-oss/kinde-typescript-sdk";

const r2Service = new R2Service();
export class FormService {
  // TODO - add proper return type when used properties
  async getUserForms(
    ownerId: UserType["id"],
    properties?: { [k in keyof SelectForm]?: boolean },
  ) {
    if (!properties) {
      const response = await db
        .select()
        .from(forms)
        .where(eq(forms.ownerId, ownerId));
      return response;
    }
    const isEmpty = Object.keys(properties).length === 0;
    const response = await db.query.forms.findMany({
      columns: isEmpty ? undefined : properties,
      where: eq(forms.ownerId, ownerId),
    });

    return response;
  }
  // TODO - add proper return type when used properties
  async getFormById(
    formId: string,
    // TODO add some way to not get certain data from the db like secure some columns
    properties?: { [k in keyof SelectForm]?: boolean },
  ) {
    if (!properties) {
      const response = await db.query.forms.findFirst({
        where: eq(forms.id, formId),
      });
      return response;
    }

    const allColumns = getTableColumns(forms);
    const selectedColumns: { [k in keyof SelectForm]?: boolean } = {};

    for (const [columnName, include] of Object.entries(properties)) {
      const column = allColumns[columnName as keyof typeof allColumns];
      if (column) {
        selectedColumns[columnName as keyof typeof selectedColumns] = include;
      }
    }

    const isEmpty = Object.keys(selectedColumns).length === 0;
    const response = await db.query.forms.findFirst({
      where: eq(forms.id, formId),
      columns: isEmpty ? undefined : selectedColumns,
    });
    return response;
  }
  async createForm({
    ownerId,
    formConfiguration,
    formPreviewFile,
  }: {
    ownerId: string;
    formConfiguration: {
      title: string;
      description?: string;
      settings: any;
      pages: CreateForm["configuration"];
    };
    formPreviewFile: File | undefined;
  }) {
    const formPreviewImageId = uuidv4();
    const formPreviewImageKey = generateImageId(
      "form-previews",
      formPreviewImageId,
    );

    let previewLink: string | null = null;
    if (formPreviewFile) {
      previewLink = await r2Service.upload(
        formPreviewFile!,
        formPreviewImageKey,
      );
    }

    const insertForm: CreateForm = {
      title: formConfiguration.title,
      description: formConfiguration.description,
      configuration: {
        settings: formConfiguration.settings,
        pages: formConfiguration.pages,
      },
      isPublished: false,
      publicLink: generatePublicLink(),
      previewLink: previewLink,
      previewKey: formPreviewImageKey,
      ownerId: ownerId,
    };

    const result = await db
      .insert(forms)
      .values(insertForm)
      .returning({ insertionId: forms.id });

    return result[0];
  }
  async updateForm({
    ownerId,
    formId,
    formConfiguration,
    formPreviewFile,
  }: {
    ownerId: string;
    formId: string;
    formConfiguration: {
      title: string;
      description?: string;
      settings: any;
      pages: CreateForm["configuration"];
    };
    formPreviewFile: File | undefined;
  }) {
    // check if form exists
    const existingForm = await this.getFormById(formId, { previewKey: true });
    if (!existingForm) throw new ErrorResponse("Form not found", 404);

    // update form preview
    const previewKey = existingForm.previewKey;

    if (formPreviewFile && previewKey) {
      // no need to update preview link as it is stored against the same preview key
      await r2Service.upload(formPreviewFile!, previewKey);
    }

    // update form configuration
    const updateForm: UpdateForm = {
      title: formConfiguration.title,
      description: formConfiguration.description,
      configuration: {
        settings: formConfiguration.settings,
        pages: formConfiguration.pages,
      },
    };

    const [result] = await db
      .update(forms)
      .set(updateForm)
      .where(and(eq(forms.id, formId), eq(forms.ownerId, ownerId)))
      .returning({ insertionId: forms.id });
    return result;
  }

  async publishForm(formId: string) {
    const result = await db
      .update(forms)
      .set({ isPublished: true })
      .where(eq(forms.id, formId))
      .returning({ insertionId: forms.id });
    return result[0];
  }

  async deleteForm(formId: string) {
    // TODO - add proper return type when used properties
    const form = await this.getFormById(formId, {
      previewKey: true,
    });
    if (!form) throw new ErrorResponse("Form not found", 404);

    const previewKey = form.previewKey;

    const previewDeleteResponse = await r2Service.delete(previewKey!);

    if (previewDeleteResponse.$metadata.httpStatusCode !== 204) {
      console.error("Failed to delete form preview");
      throw new ErrorResponse("Failed to delete form preview", 500);
    }

    const result = await db
      .delete(forms)
      .where(eq(forms.id, formId))
      .returning({
        deletionId: forms.id,
      });

    return result[0];
  }
  async isValidPublicLink(publicLink: string) {
    const result = await db
      .select({ exists: sql`1` })
      .from(forms)
      .where(and(eq(forms.publicLink, publicLink), eq(forms.isPublished, true)))
      .limit(1);

    const isPublisedValidLink = result.length > 0;
    return isPublisedValidLink;
  }

  async getFormConfigurationById(formId: string) {
    const form = await this.getFormById(formId);
    console.log({ form });
    return form;
  }

  async getFormConfigurationByPublicLink(publicLink: string) {
    const isValidPublicLink = await this.isValidPublicLink(publicLink);
    if (!isValidPublicLink) throw new ErrorResponse("Invalid public link", 404);
    const form = await db.query.forms.findFirst({
      where: eq(forms.publicLink, publicLink),
      columns: {
        id: true,
        configuration: true,
      },
    });
    return form;
  }
}
