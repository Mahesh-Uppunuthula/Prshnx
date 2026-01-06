import { Hono } from "hono";
import { z } from "zod";
import { asyncHandler } from "../../lib/utils";
import {
  deleteForm,
  getFormConfigurationById,
} from "../../controllers/form.controller";
import responses from "../responses";

const $formId = new Hono()
  .use(async (c, next) => {
    const formId = c.req.param("id");
    console.log({ formId });
    const result = z.uuid().nonempty().safeParse(formId);

    console.log("$formId middleware", result.success);
    if (!result.success) return c.json({ error: "Invalid form id" }, 400);
    // beyound this point formId is a valid v4 uuid
    await next();
  })
  .get("/configuration", asyncHandler(getFormConfigurationById))
  .delete("/", asyncHandler(deleteForm))
  .route("/responses", responses);

export default $formId;
