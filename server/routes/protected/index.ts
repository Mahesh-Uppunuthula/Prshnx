import { Hono } from "hono";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { v1Route } from "../v1";

const protectedRoute = new Hono().use(authMiddleware).route("v1", v1Route);

export default protectedRoute;
