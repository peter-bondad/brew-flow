import { Hono } from "hono";
import { createInvitationController } from "./invitation.controller";
import { requirePermission } from "@/server/middleware/require-permissions";
import { Env } from "@/server/hono/hono-types";

const invitationRoutes = new Hono<Env>()

  // User Invitation Endpoint
  .post(
    "/",
    requirePermission({ invitation: ["create"] }),
    ...createInvitationController,
  );

export default invitationRoutes;
