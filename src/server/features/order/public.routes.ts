import { Hono } from "hono";
import { Env } from "@/server/hono/hono-types";
import { requireAuth } from "@/server/middleware/require-auth";
import {
  createOrderController,
  getMyOrderController,
  listMyOrdersController,
} from "./order.controller";

const publicOrderRoutes = new Hono<Env>()
  .use("*", requireAuth)
  .post("/", ...createOrderController)
  .get("/me", ...listMyOrdersController)
  .get("/me/:id", ...getMyOrderController);

export default publicOrderRoutes;
