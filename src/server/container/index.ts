import { env } from "@/lib/env";
import {
  DevelopmentEmailService,
  ResendEmailService,
} from "../email/email.service";
import { InvitationRepository } from "../features/invitation/invitation.repository";
import { InvitationService } from "../features/invitation/invitation.service";
import db from "../infra/database/client";
import { resend } from "../email/resend";

// email service
const emailService =
  env.NODE_ENV === "development"
    ? new DevelopmentEmailService()
    : new ResendEmailService(resend);

const invitationRepository = new InvitationRepository(db);

const invitationService = new InvitationService(
  invitationRepository,
  emailService,
);

export const container = {
  invitationService,
  emailService,
};
