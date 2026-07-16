import { z } from "zod";
import { userRole } from "@/server/shared/user-role.types";

export const createInvitationDto = z
  .object({
    email: z.email(),

    firstName: z.string().trim().min(1).max(100),

    middleName: z.string().trim().max(100).optional(),

    lastName: z.string().trim().min(1).max(100),

    phoneNumber: z.string().trim().max(30).optional(),

    role: z.enum(userRole),
  })
  .strict();

export type CreateInvitationDto = z.infer<typeof createInvitationDto>;

export const acceptInvitationDto = z
  .object({
    token: z.string().trim().min(1),

    firstName: z.string().trim().min(1).max(100),

    middleName: z.string().trim().max(100).optional(),

    lastName: z.string().trim().min(1).max(100),

    phoneNumber: z.string().trim().max(30).optional(),

    password: z.string().min(8).max(128),
  })
  .strict();

export type AcceptInvitationDto = z.infer<typeof acceptInvitationDto>;
