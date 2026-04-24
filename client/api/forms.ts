import type { AppType } from "@server/app";
import { CreateFormType } from "@server/db/schemas/forms.schema";
import { hc } from "hono/client";

const client = hc<AppType>("/");
export const formsApi = {
  getAllForms: async () => {
    const getAllFormsQuery = await client.api.protected.v1.forms.$get();
    if (!getAllFormsQuery.ok) throw new Error("Failed to fetch forms");
    return await getAllFormsQuery.json();
  },
  createForm: async (form: CreateFormType) => {
    console.log({ form });
    const createFormQuery = await client.api.protected.v1.forms.$post({
      json: form,
    });
    if (!createFormQuery.ok) throw new Error("Failed to create form");
    const createFormResponse = await createFormQuery.json();
    return createFormResponse;
  },
  // createForm: async (form: FormData) => {
  //   console.log({ form });

  //   // POST query has to be made via fetch to preserve form-preview URL
  //   const saveFormQuery = await fetch("/api/protected/v1/forms", {
  //     method: "POST",
  //     body: form,
  //   });

  //   if (!saveFormQuery.ok) throw new Error("Failed to create form");

  //   const createFormResponse = await saveFormQuery.json();
  //   return createFormResponse;
  // },
  updateForm: async ({ formId, form }: { formId: string; form: FormData }) => {
    const updateFormQuery = await fetch(`/api/protected/v1/forms/${formId}`, {
      method: "PUT",
      body: form,
    });
    if (!updateFormQuery.ok) throw new Error(`Failed to update form ${formId}`);
    const updateFormResponse = await updateFormQuery.json();
    return updateFormResponse;
  },
  deleteForm: async (formId: string) => {
    const deleteFormQuery = await client.api.protected.v1.forms[":id"].$delete({
      param: {
        id: formId,
      },
    });
    if (!deleteFormQuery.ok) throw new Error(`Failed to delete form ${formId}`);
    return await deleteFormQuery.json();
  },
  getFormEmbed: async (formId: string) => {
    const getFormEmbedQuery = await client.api.public.form[
      ":publicFormId"
    ].embed.$get({
      param: {
        publicFormId: formId,
      },
    });
    if (!getFormEmbedQuery.ok)
      throw new Error(`Failed to fetch form embed data for ${formId}`);
    return await getFormEmbedQuery.json();
  },
  getFormConfigurationById: async (formId: string) => {
    const getFormConfigurationByIdQuery = await client.api.protected.v1.forms[
      ":id"
    ].configuration.$get({
      param: {
        id: formId,
      },
    });
    if (!getFormConfigurationByIdQuery.ok)
      throw new Error(`Failed to fetch form configuration data for ${formId}`);
    return await getFormConfigurationByIdQuery.json();
  },
};
