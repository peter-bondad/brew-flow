import { Hono } from "hono";
import { Env } from "@/server/hono/hono-types";
import {
  getAdminOrderController,
  listAdminOrdersController,
  updateOrderStatusController,
} from "./order.controller";
import { requirePermissionMiddleware } from "@/server/middleware/require-permissions";

const adminOrderRoutes = new Hono<Env>()
  .get("/", ...listAdminOrdersController)
  .get("/:id", ...getAdminOrderController)
  .patch(
    "/:id",
    requirePermissionMiddleware({ order: ["update"] }),
    ...updateOrderStatusController,
  );

export default adminOrderRoutes;
