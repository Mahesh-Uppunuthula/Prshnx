import { Hono } from "hono";
import { asyncHandler } from "../../lib/utils";
import { deleteForm } from "../../controllers/form.controller";
import { z } from "zod";
import responses from "../responses";

const $formId = new Hono()
  .use(async (c, next) => {
    const formId = c.req.param("id");
    console.log({ formId });
    const result = z.uuidv4().safeParse(formId);

    if (!result.success) return c.json({ error: "Invalid form id" }, 400);
    // beyound this point formId is a valid v4 uuid
    await next();
  })
  .delete("/", asyncHandler(deleteForm))
  .route("/responses", responses);

export default $formId;
