import { Env } from "@/server/hono/hono-types";
import { Hono } from "hono";
import { acceptInvitationController } from "./invitation.controller";

const publicInvitationRoutes = new Hono<Env>().post(
  "/accept",
  ...acceptInvitationController,
);

export default publicInvitationRoutes;
