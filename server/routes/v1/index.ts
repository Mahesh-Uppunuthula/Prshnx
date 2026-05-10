import { Hono } from "hono";
import formsRoute from "../forms";
import assetsRoute from "../assets";

export const v1Route = new Hono()
  .route("/assets", assetsRoute)
  .route("/forms", formsRoute);
