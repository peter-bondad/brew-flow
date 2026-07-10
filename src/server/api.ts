import { auth } from "@/lib/auth";
import { env } from "@/lib/env";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { Env } from "./hono/hono-types";
import { requireAuth } from "./middleware/require-auth";
import adminInvitationRoutes from "./features/invitation/admin.routes";
import publicInvitationRoutes from "./features/invitation/public.routes";

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

  .route("/api/invitation", publicInvitationRoutes)
  // admin routes
  .use("/api/admin/*", requireAuth)
  // user invitation routes (admin routes)
  .route("/api/admin/invitations", adminInvitationRoutes);

export default app;
