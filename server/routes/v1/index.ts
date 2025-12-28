import formsRoute from "../forms";
import { Hono } from "hono";

export const v1Route = new Hono().route("/forms", formsRoute);
