import { and, eq, gt, lte } from "drizzle-orm";

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
      status: invitationStatus.Pending,
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
        eq(invitations.status, invitationStatus.Pending),
        gt(invitations.expiresAt, new Date()),
      ),
    }) as Promise<PendingInvitation | undefined>;
  }

  async findByHashedToken(
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
        acceptedAt: true,
      },
      where: eq(invitations.tokenHash, tokenHash),
    }) as Promise<InvitationForAcceptance | undefined>;
  }

  async markAccepted({
    invitationId,
    usedBy,
  }: MarkInvitationAccepted): Promise<void> {
    await this.database
      .update(invitations)
      .set({
        status: invitationStatus.Accepted,
        usedBy,
        acceptedAt: new Date(),
      })
      .where(
        and(
          eq(invitations.id, invitationId),
          eq(invitations.status, invitationStatus.Pending),
        ),
      );
  }

  async revoke(invitationId: string): Promise<void> {
    await this.database
      .update(invitations)
      .set({
        status: "revoked",
      })
      .where(eq(invitations.id, invitationId));
  }

  async expireExpiredInvitations(): Promise<number> {
    const result = await this.database
      .update(invitations)
      .set({
        status: invitationStatus.Expired,
      })
      .where(
        and(
          eq(invitations.status, invitationStatus.Pending),
          lte(invitations.expiresAt, new Date()),
        ),
      )
      .returning({
        id: invitations.id,
      });

    return result.length;
  }
}
