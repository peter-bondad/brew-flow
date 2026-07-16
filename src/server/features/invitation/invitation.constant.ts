export const invitationStatus = {
  Pending: "pending",
  Processing: "processing",
  Accepted: "accepted",
  Revoked: "revoked",
  Expired: "expired",
} as const;

export type InvitationStatus =
  (typeof invitationStatus)[keyof typeof invitationStatus];
