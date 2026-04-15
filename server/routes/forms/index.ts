import { Hono } from "hono";
import { asyncHandler } from "../../lib/utils";
import { createForm, getForms } from "../../controllers/form.controller";
import $formId from "./$formId";
import { zValidator } from "@hono/zod-validator";
import { createFormSchema } from "../../db/schemas/forms.schema";

const form = new Hono()
  .get("/", asyncHandler(getForms))
  .post("/", zValidator("json", createFormSchema), asyncHandler((c) => {
    const formData = c.req.valid("json");
    console.log("formData ", JSON.stringify(formData, null, 2));
    return createForm(c, formData);
  }))
  .route("/:id", $formId);

export default form;
