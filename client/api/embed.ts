import { AppType } from "@server/app";
import { hc } from "hono/client";

const client = hc<AppType>("/");
export const embedApi = {
  getFormConfigById: async (publicFormId: string) => {
    const response = await client.api.public.form[":publicFormId"].embed.$get({
      param: {
        publicFormId: publicFormId,
      },
    });
    if (!response.ok) {
      console.log("response " + response.statusText);
      if (response.status === 404) {
        throw new Error(
          "Form not found. This form may have been deleted or the URL is incorrect."
        );
      }
      throw new Error(`Failed to get form config: ${response.statusText}`);
    }
    const config = await response.json();
    return config;
  },
};
