import { Hono } from "hono";
import publicFormRoute from "../form";

const publicRoute = new Hono().route("/form", publicFormRoute);

export default publicRoute;
