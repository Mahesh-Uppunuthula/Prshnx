import { Hono } from "hono";
import { asyncHandler } from "../../lib/utils";
import {
  deleteFormResponseById,
  getFormResponseById,
} from "../../controllers/response.controller";
import z from "zod";

const $responseId = new Hono()
  .use(async (c, next) => {
    const responseId = c.req.param("responseId");
    const result = z.uuidv4().safeParse(responseId);
    if (!result.success) return c.json({ error: "Invalid response id" }, 400);
    await next();
  })
  .get("/", asyncHandler(getFormResponseById))
  .delete("/", asyncHandler(deleteFormResponseById));

export default $responseId;
