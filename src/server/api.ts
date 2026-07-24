import { auth } from "@/lib/auth";
import { env } from "@/lib/env";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { Env } from "./hono/hono-types";
import { requireAuth } from "./middleware/require-auth";
import adminInvitationRoutes from "./features/invitation/admin.routes";
import publicInvitationRoutes from "./features/invitation/public.routes";
import { appErrorHandler } from "./errors/app-error-handler";
import inventoryAdminRoutes from "./features/inventory/admin.routes";
import productAdminRoutes from "./features/product/admin.routes";
import jobRoutes from "./features/jobs/job.routes";

const app = new Hono<Env>()

  .use(
    "/api/auth/*", // or replace with "*" to enable cors for all routes
    cors({
      origin: env.CORS_ORIGIN, // replace with your origin
      allowHeaders: ["Content-Type", "Authorization"],
      allowMethods: ["POST", "GET", "OPTIONS"],
      exposeHeaders: ["Content-Length"],
      maxAge: 600,
      credentials: true,
    }),
  )

  .on(["POST", "GET"], "/api/auth/*", (c) => {
    return auth.handler(c.req.raw);
  })

  .onError(appErrorHandler)

  .route("/api/invitation", publicInvitationRoutes)

  // Scheduled jobs (protected by CRON_SECRET)
  .route("/api/jobs", jobRoutes)

  // admin routes
  .use("/api/admin/*", requireAuth)
  // user invitation routes (admin routes)
  .route("/api/admin/invitations", adminInvitationRoutes)
  // inventory routes (admin routes)
  .route("/api/admin/inventory", inventoryAdminRoutes)
  .route("/api/admin/products", productAdminRoutes);

export default app;
