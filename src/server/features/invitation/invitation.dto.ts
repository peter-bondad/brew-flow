import { z } from "zod";
import { userRole } from "@/server/types/user-role.types";

export const createInvitationDto = z.object({
  email: z.email(),
  name: z.string().trim().min(1).max(255).optional(),
  role: z.enum(userRole),
});

export type CreateInvitationDto = z.infer<typeof createInvitationDto>;
