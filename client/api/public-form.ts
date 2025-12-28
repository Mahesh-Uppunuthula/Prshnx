import { AppType } from "@server/app";
import { hc } from "hono/client";

const client = hc<AppType>("/");
export const publicFormApi = {
  getPublicForm: async (formId: string) => {
    const response = await client.api.public.form[":publicFormId"].$get({
      param: {
        publicFormId: formId,
      },
    });
    const result = await response.json();
    console.log({ result })
    return result;
  },
};
