import type { Context } from "hono";
import { ErrorResponse } from "../types/error";
import { FormService } from "../services/form.service";
import { REQUEST_VARIABLES } from "../lib/constants";
import { UserType } from "@kinde-oss/kinde-typescript-sdk";
import type { CreateFormType } from "../db/schemas/forms.schema";

const formService = new FormService();
// TODO - handle errors for all routes
// TODO - add proper return type when used properties
export const getForms = async (c: Context) => {
  const userDetails = c.get(REQUEST_VARIABLES.USER_DETAILS) as UserType;
  const ownerId = userDetails.id;
  console.log({ ownerId });
  const allForms = await formService.getUserForms(ownerId, {
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

export const createForm = async (c: Context, formData: CreateFormType) => {
  const userDetails = c.get(REQUEST_VARIABLES.USER_DETAILS) as UserType;
  const ownerId = userDetails.id;
  console.log({ ownerId });
  console.log("formData ", JSON.stringify(formData, null, 2));

  const result = await formService.createForm({
    ownerId,
    formData,
  });
  return c.json(result);
};

export const updateForm = async (c: Context) => {
  const userDetails = c.get(REQUEST_VARIABLES.USER_DETAILS) as UserType;
  const ownerId = userDetails.id;
  console.log({ ownerId });
  const formId = c.req.param("id");
  const body = await c.req.parseBody();
  if (!body || !body["form"]) {
    throw new ErrorResponse("Form data not found in request body", 400);
  }

  const form = JSON.parse(body["form"] as string);
  const formPreviewFile = body["preview"] as File | undefined;

  const result = await formService.updateForm({
    ownerId,
    formId,
    formConfiguration: form,
    formPreviewFile,
  });
  console.log({ result });
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

export const getFormConfigurationById = async (c: Context) => {
  const formId = c.req.param("id");
  const result = await formService.getFormConfigurationById(formId);
  console.log({ result });
  return c.json(result);
};
