import { and, eq } from "drizzle-orm";

import db from "@/server/infra/database/client";
import { invitations } from "@/server/infra/database/schemas";

import type {
  CreateInvitation,
  InvitationForAcceptance,
  IInvitationRepository,
  MarkInvitationAccepted,
  PendingInvitation,
} from "./invitation.interface";
import { invitationStatus } from "./invitation.constant";

export class InvitationRepository implements IInvitationRepository {
  constructor(private readonly database = db) {}

  async create(data: CreateInvitation): Promise<void> {
    await this.database.insert(invitations).values({
      ...data,
      status: invitationStatus.Expired,
    });
  }

  async findPendingByEmail(
    email: string,
  ): Promise<PendingInvitation | undefined> {
    return this.database.query.invitations.findFirst({
      columns: {
        id: true,
        email: true,
        expiresAt: true,
      },
      where: and(
        eq(invitations.email, email),
        eq(invitations.status, "pending"),
      ),
    }) as Promise<PendingInvitation | undefined>;
  }

  async findForAcceptance(
    tokenHash: string,
  ): Promise<InvitationForAcceptance | undefined> {
    return this.database.query.invitations.findFirst({
      columns: {
        id: true,
        email: true,
        name: true,
        role: true,
        status: true,
        expiresAt: true,
      },
      where: eq(invitations.tokenHash, tokenHash),
    }) as Promise<InvitationForAcceptance | undefined>;
  }

  async markAccepted({
    invitationId,
    userId,
  }: MarkInvitationAccepted): Promise<void> {
    await this.database
      .update(invitations)
      .set({
        status: "accepted",
        usedBy: userId,
        acceptedAt: new Date(),
      })
      .where(eq(invitations.id, invitationId));
  }

  async revoke(invitationId: string): Promise<void> {
    await this.database
      .update(invitations)
      .set({
        status: "revoked",
      })
      .where(eq(invitations.id, invitationId));
  }

  async expire(invitationId: string): Promise<void> {
    await this.database
      .update(invitations)
      .set({
        status: "expired",
      })
      .where(eq(invitations.id, invitationId));
  }
}
