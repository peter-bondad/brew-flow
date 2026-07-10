import {
  createInvitationExpiry,
  createInvitationToken,
  createInvitationUrl,
  hashInvitationToken,
} from "@/utils/invitations";
import {
  InvitationAlreadyAcceptedError,
  InvitationAlreadyExistsError,
  InvitationExpiredError,
  InvitationNotFoundError,
} from "./invitation.error";
import {
  AcceptInvitationInput,
  CreateInvitationInput,
  CreateInvitationResult,
  IInvitationRepository,
  InvitationDisplayResult,
} from "./invitation.interface";
import { EmailService } from "@/server/email/email.interface";
import { isExpired } from "@/utils/time";
import { IUserRepository } from "../user/user.interface";
import { UserEmailAlreadyExists } from "../user/user.error";
import { auth } from "@/lib/auth";
import { invitationStatus } from "./invitation.constant";

export class InvitationService {
  constructor(
    private readonly userIRepository: IUserRepository,
    private readonly invitationIRepository: IInvitationRepository,
    private readonly emailService: EmailService,
  ) {}

  async createInvitation(
    userId: string, // user authenticated
    input: CreateInvitationInput,
  ): Promise<CreateInvitationResult> {
    const existingInvitationEmail =
      await this.invitationIRepository.findPendingByEmail(input.email);

    if (existingInvitationEmail) {
      throw new InvitationAlreadyExistsError();
    }

    const invitationToken = createInvitationToken();
    const hashedInvitationToken = hashInvitationToken(invitationToken);
    const invitationExpire = createInvitationExpiry();
    await this.invitationIRepository.create({
      email: input.email,
      name: input.name,
      role: input.role,
      tokenHash: hashedInvitationToken,
      createdBy: userId,
      expiresAt: invitationExpire,
    });

    const invitationUrl = createInvitationUrl(invitationToken);

    await this.emailService.sendInvitation({
      name: input.name,
      email: input.email,
      invitationUrl,
      expiresAt: invitationExpire,
    });

    return {
      invitationUrl,
      token: invitationToken,
      expiresAt: invitationExpire,
    };
  }

  async acceptInvitation(input: AcceptInvitationInput): Promise<boolean> {
    const hashedToken = hashInvitationToken(input.token);

    const invitation =
      await this.invitationIRepository.findForAcceptance(hashedToken);

    if (!invitation) {
      throw new InvitationNotFoundError();
    }

    if (invitation.acceptedAt) {
      throw new InvitationAlreadyAcceptedError();
    }

    if (isExpired(invitation.expiresAt)) {
      throw new InvitationExpiredError();
    }

    const existingUser = await this.userIRepository.findByEmail(
      invitation.email,
    );

    if (existingUser) {
      throw new UserEmailAlreadyExists();
    }

    const createdUser = await auth.api.createUser({
      body: {
        email: invitation.email,
        name: input.name,
        password: input.password,
        role: invitation.role,
      },
    });

    await this.invitationIRepository.markAccepted({
      invitationId: invitation.id,
      usedBy: createdUser.user.id,
    });

    return true;
  }

  async getInvitationForDisplay(
    token: string,
  ): Promise<InvitationDisplayResult> {
    const hashedToken = hashInvitationToken(token);
    const invitation =
      await this.invitationIRepository.findForAcceptance(hashedToken);

    if (!invitation) {
      return { status: "not_found" };
    }

    if (invitation.status === invitationStatus.Accepted) {
      return { status: "already_accepted" };
    }

    if (isExpired(invitation.expiresAt)) {
      return { status: "expired" };
    }

    return {
      status: "valid",
      invitation: {
        email: invitation.email,
        name: invitation.name ?? "",
      },
    };
  }
}
