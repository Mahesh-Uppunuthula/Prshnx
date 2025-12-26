import { Hono } from "hono";
import { asyncHandler } from "../../lib/utils";
import { getFormResponses } from "../../controllers/response.controller";
import $responseId from "./$responseId";

const responses = new Hono()
  .get("/", asyncHandler(getFormResponses))
  .route("/:responseId", $responseId);

export default responses;
