import { Hono } from "hono";
import { asyncHandler } from "../../lib/utils";
import { createForm, getForms } from "../../controllers/form.controller";
import $formId from "./$formId";

const form = new Hono()
  .get("/", asyncHandler(getForms))
  .post("/", asyncHandler(createForm))
  .route("/:id", $formId);

export default form;
