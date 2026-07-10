import { Hono } from "hono";
import { createInvitationController } from "./invitation.controller";
import { requirePermissionMiddleware } from "@/server/middleware/require-permissions";
import { Env } from "@/server/hono/hono-types";

const adminInvitationRoutes = new Hono<Env>()

  // User Invitation Endpoint
  .post(
    "/",
    requirePermissionMiddleware({ invitation: ["create"] }),
    ...createInvitationController,
  );

export default adminInvitationRoutes;
