import type { Context } from "hono";
import { FormResponseService } from "../services/form.response.service";

const formResponseService = new FormResponseService();
export const getFormResponses = async (c: Context) => {
  const formId = c.req.param("id");
  const result = await formResponseService.getAllFormResponses(formId);
  return c.json(result);
};

export const getFormResponseById = async (c: Context) => {
  const responseId = c.req.param("responseId");
  const result = await formResponseService.getFormResponseById(responseId);
  return c.json(result);
};

export const deleteFormResponseById = async (c: Context) => {
  const responseId = c.req.param("responseId");
  const result = await formResponseService.deleteFormResponseById(responseId);
  return c.json(result);
};