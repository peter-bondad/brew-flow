export const invitationStatus = {
  Pending: "pending",
  Accepted: "accepted",
  Revoked: "revoked",
} as const;

export type InvitationStatus =
  (typeof invitationStatus)[keyof typeof invitationStatus];
