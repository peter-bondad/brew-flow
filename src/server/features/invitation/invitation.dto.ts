import { z } from "zod";
import { userRole } from "@/server/types/user-role.types";

export const createInvitationDto = z.object({
  email: z.email(),
  name: z.string().trim().min(1).max(255).optional(),
  role: z.enum(userRole),
});

export type CreateInvitationDto = z.infer<typeof createInvitationDto>;

export const acceptInvitationDto = z
  .object({
    token: z.string().trim().min(1),

    name: z.string().trim().min(1).max(255),

    password: z.string().min(8).max(128),
  })

  .strict();

export type AcceptInvitationDto = z.infer<typeof acceptInvitationDto>;
