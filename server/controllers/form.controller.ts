import type { Context } from "hono";
import { ErrorResponse } from "../types/error";
import { FormService } from "../services/form.service";

const formService = new FormService();
// TODO - handle errors for all routes
// TODO - add proper return type when used properties
export const getForms = async (c: Context) => {
  const allForms = await formService.getAllForms({
    id: true,
    title: true,
    description: true,
    previewLink: true,
    isPublished: true,
    publicLink: true,
    updatedAt: true,
  });
  return c.json(allForms);
};

export const createForm = async (c: Context) => {
  const body = await c.req.parseBody();
  if (!body || !body["form"]) {
    throw new ErrorResponse("Form data not found in request body", 400);
  }

  const form = JSON.parse(body["form"] as string);
  const formPreviewFile = body["preview"] as File | undefined;

  const result = await formService.createForm({
    formConfiguration: form,
    formPreviewFile,
  });
  return c.json(result);
};

export const publishForm = async (c: Context) => {
  const formId = c.req.param("id");
  const result = await formService.publishForm(formId);
  return c.json(result);
};

export const deleteForm = async (c: Context) => {
  const formId = c.req.param("id");
  const result = await formService.deleteForm(formId);
  return c.json(result);
};
