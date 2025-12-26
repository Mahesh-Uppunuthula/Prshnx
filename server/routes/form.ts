import { Hono } from "hono";
import z from "zod";
import { FormService } from "../services/form.service";

const formService = new FormService();
const publicFormRoute = new Hono()
  .use("/:publicFormId", async (c, next) => {
    const publicFormId = c.req.param("publicFormId");
    const validFormId = z.hex().length(8).nonempty().safeParse(publicFormId);
    if (!validFormId.success) return c.notFound();
    await next();
  })
  .get("/:publicFormId", async (c) => {
    const publicFormId = c.req.param("publicFormId");
    const isPublishedValidLink =
      await formService.getFormByPublicLink(publicFormId);
    if (!isPublishedValidLink) return c.notFound();
    return c.json({ isPublishedValidLink });
  });

export default publicFormRoute;
