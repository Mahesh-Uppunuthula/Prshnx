import { eq } from "drizzle-orm";
import { db } from "../db";
import { formResponses } from "../db/form.response.schema";

export class FormResponseService {
  async getAllFormResponses(formId: string) {
    const result = await db.query.formResponses.findMany({
      where: eq(formResponses.formId, formId),
    });
    return result;
  }
  async getFormResponseById(responseId: string) {
    const result = await db.query.formResponses.findFirst({
      where: eq(formResponses.id, responseId),
    });
    return result;
  }
  async deleteFormResponseById(responseId: string) {
    const result = await db
      .delete(formResponses)
      .where(eq(formResponses.id, responseId));
    return result;
  }
}
