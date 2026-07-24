import { Hono } from "hono";
import { Env } from "@/server/hono/hono-types";
import {
  archiveProductController,
  createProductController,
  getProductController,
  listProductsController,
  updateProductController,
} from "./product.controller";

const productAdminRoutes = new Hono<Env>()
  .get("/", ...listProductsController)
  .get("/:id", ...getProductController)
  .post("/", ...createProductController)
  .patch("/:id", ...updateProductController)
  .delete("/:id", ...archiveProductController);

export default productAdminRoutes;
