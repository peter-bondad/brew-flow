import { container } from "@/server/container";

export async function expireInvitationsJob() {
  const expiredCount = await container.invitationService.expireInvitations();

  return {
    success: true,
    expiredCount,
    executedAt: new Date().toISOString(),
  };
}
