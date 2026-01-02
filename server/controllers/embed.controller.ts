import { EmbedService } from "../services/embed.service";
import type { Context } from "hono";

const embedService = new EmbedService();
export const getFormEmbed = async (c: Context) => {
  const publicLink = c.req.param("publicFormId");
  console.log({ publicLink });
  const config = await embedService.getFormEmbed(publicLink);
  if (!config) {
    return c.json({ error: "Form not found" }, 404);
  }
  return c.json(config);
};
