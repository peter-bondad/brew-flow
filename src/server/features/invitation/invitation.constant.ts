export const invitationStatus = {
  Pending: "pending",
  Accepted: "accepted",
  Revoked: "revoked",
  Expired: "expired",
} as const;

export type InvitationStatus =
  (typeof invitationStatus)[keyof typeof invitationStatus];
