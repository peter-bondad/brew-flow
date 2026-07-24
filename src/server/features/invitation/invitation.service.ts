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
import { auth } from "@/lib/auth";
import { invitationStatus } from "./invitation.constant";
import { UserDto } from "../user/user.dto";
import { UserEmailAlreadyExists } from "../user/user.error";

// invitation.service.ts

export class InvitationService {
  constructor(
    private readonly userIRepository: IUserRepository,
    private readonly invitationIRepository: IInvitationRepository,
    private readonly emailService: EmailService,
  ) {}

  async createInvitation(
    userId: string, // the owner/manager sending the invite
    input: CreateInvitationInput,
  ): Promise<CreateInvitationResult> {
    // Don't send a second invite if one is already pending for this email —
    // prevents spamming the same person with multiple invite links.
    const existingInvitationEmail =
      await this.invitationIRepository.findPendingByEmail(input.email);

    if (existingInvitationEmail) {
      throw new InvitationAlreadyExistsError();
    }

    const invitationToken = createInvitationToken();
    const hashedInvitationToken = hashInvitationToken(invitationToken);
    const invitationExpire = createInvitationExpiry();

    try {
      // Save the invite as "pending" so it can later be looked up and accepted.
      await this.invitationIRepository.create({
        email: input.email,
        firstName: input.firstName,
        middleName: input.middleName,
        lastName: input.lastName,
        role: input.role,
        tokenHash: hashedInvitationToken,
        createdBy: userId,
        expiresAt: invitationExpire,
      });
    } catch (err) {
      // Temporary: catches any unexpected DB failure here so it's visible in
      // logs instead of failing silently. Once we add a DB-level uniqueness
      // rule, this will also catch the "two invites sent at the same time"
      // race and turn it into the same InvitationAlreadyExistsError above.
      console.error("[createInvitation] insert failed", err);
      throw err;
    }

    const invitationUrl = createInvitationUrl(invitationToken);

    const fullName = [input.firstName, input.middleName, input.lastName]
      .filter(Boolean)
      .join(" ");

    await this.emailService.sendInvitation({
      name: fullName,
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

  async acceptInvitation(input: AcceptInvitationInput): Promise<UserDto> {
    const hashedToken = hashInvitationToken(input.token);

    const invitation =
      await this.invitationIRepository.findByHashedToken(hashedToken);

    if (!invitation) {
      throw new InvitationNotFoundError();
    }

    if (invitation.acceptedAt) {
      throw new InvitationAlreadyAcceptedError();
    }

    if (isExpired(invitation.expiresAt)) {
      throw new InvitationExpiredError();
    }

    // Make sure nobody already grabbed this email before this invite gets used.
    const existingUser = await this.userIRepository.findByEmail(
      invitation.email,
    );

    if (existingUser) throw new UserEmailAlreadyExists();

    const claimed = await this.invitationIRepository.claimForAcceptance(
      invitation.id,
    );
    if (!claimed) {
      throw new InvitationAlreadyAcceptedError();
    }

    let createdUser;

    try {
      const fullName = [input.firstName, input.middleName, input.lastName]
        .filter(Boolean)
        .join(" ");

      createdUser = await auth.api.createUser({
        body: {
          email: invitation.email,
          password: input.password,
          name: fullName,
          role: invitation.role,
          data: {
            firstName: input.firstName,
            middleName: input.middleName,
            lastName: input.lastName,
            phoneNumber: input.phoneNumber,
          },
        },
      });
    } catch (err) {
      console.error("[acceptInvitation] createUser failed", err);
      throw err;
    }

    await this.userIRepository.updateEmailVerified(createdUser.user.id);

    try {
      await this.invitationIRepository.markAccepted({
        invitationId: invitation.id,
        usedBy: createdUser.user.id,
      });
    } catch (err) {
      console.error(
        "[acceptInvitation] markAccepted failed after user was created",
        { invitationId: invitation.id, userId: createdUser.user.id, err },
      );
      throw err;
    }

    return {
      id: createdUser.user.id,
      name: createdUser.user.name,
      email: createdUser.user.email,
      role: invitation.role,
    };
  }

  async getInvitationForDisplay(
    token: string,
  ): Promise<InvitationDisplayResult> {
    // Used by the invite landing page to show "valid / expired / already used"
    // before the person even tries to submit the accept form.
    const hashedToken = hashInvitationToken(token);
    const invitation =
      await this.invitationIRepository.findByHashedToken(hashedToken);

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
        firstName: invitation.firstName,
        middleName: invitation.middleName,
        lastName: invitation.lastName,
        phoneNumber: invitation.phoneNumber,
      },
    };
  }

  // Runs on a schedule (Vercel Cron) to clean up invites nobody accepted in time.
  async expireInvitations(): Promise<number> {
    return await this.invitationIRepository.expireExpiredInvitations();
  }
}
