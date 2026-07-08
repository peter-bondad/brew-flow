import { auth } from "@/lib/auth";
import { env } from "@/lib/env";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { requireAdmin } from "@/server/features/admin/admin.middleware";
import { createInvitationHandler } from "@/server/features/admin/admin.controller";
import { acceptInvitationHandler } from "@/server/features/invitations/invitation.controller";
import { Env } from "./types/hono-types";

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

  .use("/api/admin/*", requireAdmin)
  .post("/api/admin/invitations", createInvitationHandler)
  .post("/api/invitations/accept", acceptInvitationHandler)

  .get("/api/hello", (c) => {
    return c.json({
      message: "Hello, World!",
    });
  });

export default app;
