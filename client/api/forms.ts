import type { AppType } from "@server/app";
import { hc } from "hono/client";

const client = hc<AppType>("/");
export const formsApi = {
  getAllForms: async () => {
    const getAllFormsQuery = await client.api.v1.forms.$get();
    if (!getAllFormsQuery.ok) throw new Error("Failed to fetch forms");
    return await getAllFormsQuery.json();
  },
  createForm: async (form: FormData) => {
    console.log({ form });

    const saveFormQuery = await fetch("/api/v1/forms", {
      method: "POST",
      body: form,
    });

    if (!saveFormQuery.ok) throw new Error("Failed to create form");

    return await saveFormQuery.json();
  },
  deleteForm: async (formId: string) => {
    const deleteFormQuery = await client.api.v1.forms[":id"].$delete({
      param: {
        id: formId,
      },
    });
    if (!deleteFormQuery.ok) throw new Error(`Failed to delete form ${formId}`);
    return await deleteFormQuery.json();
  },
};
