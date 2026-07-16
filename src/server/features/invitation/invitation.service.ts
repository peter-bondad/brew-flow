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
        name: input.name,
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

    // Send the actual email with the accept link.
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

    let createdUser;
    try {
      // This actually creates the login-capable account (email + password + role).
      createdUser = await auth.api.createUser({
        body: {
          email: invitation.email,
          name: input.name,
          password: input.password,
          role: invitation.role,
        },
      });
    } catch (err) {
      // If account creation itself fails, nothing else has happened yet —
      // safe to just log and bubble up, no cleanup needed.
      console.error("[acceptInvitation] createUser failed", err);
      throw err;
    }

    // The invite link is our proof this person owns the email — so mark it
    // verified now instead of making them click a separate verification email.
    const verified = await this.userIRepository.updateEmailVerified(
      createdUser.user.id,
    );

    if (!verified) {
      // Shouldn't normally happen right after creating the user — log it so
      // it's noticeable if it ever does.
      console.error("[acceptInvitation] failed to mark email verified", {
        userId: createdUser.user.id,
      });
    }

    try {
      // Close out the invite so it can't be used again.
      await this.invitationIRepository.markAccepted({
        invitationId: invitation.id,
        usedBy: createdUser.user.id,
      });
    } catch (err) {
      // Worst case in this flow: the account now exists, but the invite
      // still looks "pending." Logged loudly on purpose — this is the one
      // gap we haven't fully closed yet (see notes on idempotent resume).
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
        name: invitation.name ?? "",
      },
    };
  }

  // Runs on a schedule (Vercel Cron) to clean up invites nobody accepted in time.
  async expireInvitations(): Promise<number> {
    return await this.invitationIRepository.expireExpiredInvitations();
  }
}
