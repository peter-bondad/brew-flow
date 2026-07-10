import { createHash, randomBytes } from "node:crypto";
import { env } from "@/lib/env";

export const INVITATION_EXPIRY_HOURS = 48;
const TOKEN_BYTES = 32;

export interface InvitationToken {
  token: string;
  tokenHash: string;
}

export function createInvitationToken(): string {
  return randomBytes(TOKEN_BYTES).toString("base64url");
}

export function hashInvitationToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export function createInvitationExpiry(): Date {
  return new Date(Date.now() + INVITATION_EXPIRY_HOURS * 60 * 60 * 1000);
}

export function createInvitationUrl(token: string): string {
  return new URL(`/invite/${token}`, env.NEXT_PUBLIC_APP_URL).toString();
}
