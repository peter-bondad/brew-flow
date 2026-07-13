import { UserRole } from "@/server/types/user-role.types";
import { InvitationStatus } from "./invitation.constant";

export interface CreateInvitation {
  email: string;
  name?: string | null;
  role: UserRole;
  tokenHash: string;
  expiresAt: Date;
  createdBy: string;
}

export interface PendingInvitation {
  id: string;
  email: string;
  expiresAt: Date;
}

export interface InvitationForAcceptance {
  id: string;
  email: string;
  name: string | null;
  role: UserRole;
  status: InvitationStatus;
  acceptedAt: Date;
  expiresAt: Date;
}

export interface MarkInvitationAccepted {
  invitationId: string;
  usedBy: string;
}

export interface IInvitationRepository {
  create(data: CreateInvitation): Promise<void>;

  findPendingByEmail(email: string): Promise<PendingInvitation | undefined>;

  findByHashedToken(
    tokenHash: string,
  ): Promise<InvitationForAcceptance | undefined>;

  markAccepted(data: MarkInvitationAccepted): Promise<void>;

  revoke(invitationId: string): Promise<void>;
  expireExpiredInvitations(): Promise<number>;
}

// Service layer argument types
export interface CreateInvitationInput {
  email: string;
  name?: string;
  role: UserRole;
}

export interface CreateInvitationResult {
  token: string;
  invitationUrl: string;
  expiresAt: Date;
}

export interface AcceptInvitationInput {
  token: string;
  name: string;
  password: string;
}

export type InvitationDisplayResult =
  | { status: "not_found" }
  | { status: "expired" }
  | { status: "already_accepted" }
  | { status: "valid"; invitation: { email: string; name: string } };

export interface RevokeInvitationInput {
  invitationId: string;
}
