import { UserRole } from "@/server/shared/user-role.types";
import { InvitationStatus } from "./invitation.constant";

// for repository/database model
export interface CreateInvitation {
  email: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  role: UserRole;
  tokenHash: string;
  expiresAt: Date;
  createdBy: string;
}

// for service model
export interface AcceptInvitationInput {
  token: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  phoneNumber?: string;
  password: string;
}

export interface PendingInvitation {
  id: string;
  email: string;
  expiresAt: Date;
}

export interface InvitationForAcceptance {
  id: string;
  email: string;
  firstName: string;
  middleName: string | undefined;
  lastName: string;
  phoneNumber: string | undefined;
  role: UserRole;
  status: InvitationStatus;
  acceptedAt: Date;
  expiresAt: Date;
}

export interface MarkInvitationAccepted {
  invitationId: string;
  usedBy: string;
}

// Service layer argument types
export interface CreateInvitationInput {
  email: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  role: UserRole;
}

export interface CreateInvitationResult {
  token: string;
  invitationUrl: string;
  expiresAt: Date;
}

export type InvitationDisplayResult =
  | { status: "not_found" }
  | { status: "expired" }
  | { status: "already_accepted" }
  | {
      status: "valid";
      invitation: {
        email: string;
        firstName: string;
        middleName?: string;
        lastName: string;
        phoneNumber?: string;
      };
    };

export interface RevokeInvitationInput {
  invitationId: string;
}

export interface IInvitationRepository {
  create(data: CreateInvitation): Promise<void>;

  findPendingByEmail(email: string): Promise<PendingInvitation | undefined>;

  findByHashedToken(
    tokenHash: string,
  ): Promise<InvitationForAcceptance | undefined>;

  claimForAcceptance(email: string): Promise<boolean>;
  markAccepted(data: MarkInvitationAccepted): Promise<void>;

  revoke(invitationId: string): Promise<void>;
  expireExpiredInvitations(): Promise<number>;
}
