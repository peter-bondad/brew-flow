import { Hono } from "hono";
import { createInvitationController } from "./invitation.controller";
import { requirePermission } from "@/server/middleware/require-permissions";

const invitationRoutes = new Hono()

  // User Invitation Endpoint
  .post(
    "/",
    requirePermission({ invitation: ["create"] }),
    ...createInvitationController,
  );

export default invitationRoutes;
