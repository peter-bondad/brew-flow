import { describe, it, expect, vi, beforeEach } from "vitest";

import { InvitationService } from "@/server/features/invitation/invitation.service";
import { userRole } from "@/server/shared/user-role.types";

vi.mock("@/lib/auth", () => ({
  auth: {
    api: {
      createUser: vi.fn(),
    },
  },
}));

vi.mock("@/utils/invitations", () => ({
  createInvitationToken: () => "fake-token",
  hashInvitationToken: (token: string) => `hashed-${token}`,
  createInvitationExpiry: () => new Date(Date.now() + 48 * 60 * 60 * 1000),
  createInvitationUrl: (token: string) => `http://localhost/invitation/${token}`,
  INVITATION_EXPIRY_HOURS: 48,
}));

describe("InvitationService", () => {
  let mockInvitationRepo: any;
  let mockEmailService: any;
  let mockUserRepo: any;
  let service: InvitationService;

  beforeEach(() => {
    vi.clearAllMocks();

    mockInvitationRepo = {
      create: vi.fn(),
      findPendingByEmail: vi.fn(),
      findByHashedToken: vi.fn(),
      claimForAcceptance: vi.fn(),
      markAccepted: vi.fn(),
      revoke: vi.fn(),
      expireExpiredInvitations: vi.fn(),
    };

    mockEmailService = {
      sendInvitation: vi.fn(),
    };

    mockUserRepo = {
      findByEmail: vi.fn(),
      updateEmailVerified: vi.fn(),
    };

    service = new InvitationService(mockUserRepo, mockInvitationRepo, mockEmailService);
  });

  describe("createInvitation", () => {
    it("throws InvitationAlreadyExistsError when a pending invite exists for the email", async () => {
      mockInvitationRepo.findPendingByEmail.mockResolvedValue({
        id: "i1",
        email: "test@example.com",
        expiresAt: new Date(),
      });

      await expect(service.createInvitation("user-1", {
        email: "test@example.com",
        firstName: "A",
        lastName: "B",
        role: userRole.Manager,
      })).rejects.toMatchObject({ code: "INVITATION_ALREADY_EXISTS" });

      expect(mockInvitationRepo.create).not.toHaveBeenCalled();
      expect(mockEmailService.sendInvitation).not.toHaveBeenCalled();
    });

    it("saves the invitation and sends the email when no pending invite exists", async () => {
      mockInvitationRepo.findPendingByEmail.mockResolvedValue(undefined);
      mockInvitationRepo.create.mockResolvedValue(undefined);
      mockEmailService.sendInvitation.mockResolvedValue(undefined);

      const result = await service.createInvitation("user-1", {
        email: "test@example.com",
        firstName: "A",
        lastName: "B",
        role: userRole.Manager,
      });

      expect(mockInvitationRepo.create).toHaveBeenCalledTimes(1);
      const createArgs = (mockInvitationRepo.create.mock.calls[0] as any[])[0];
      expect(createArgs.email).toBe("test@example.com");
      expect(createArgs.createdBy).toBe("user-1");
      expect(createArgs.role).toBe(userRole.Manager);

      expect(mockEmailService.sendInvitation).toHaveBeenCalledTimes(1);
      const emailArgs = (mockEmailService.sendInvitation.mock.calls[0] as any[])[0];
      expect(emailArgs.email).toBe("test@example.com");
      expect(emailArgs.invitationUrl).toContain("/invitation/");
      expect(emailArgs.name).toBe("A B");

      expect(result.token).toBeDefined();
      expect(result.invitationUrl).toContain("/invitation/");
      expect(result.expiresAt).toBeInstanceOf(Date);
    });
  });

  describe("acceptInvitation", () => {
    const baseInput = {
      token: "token123",
      firstName: "A",
      lastName: "B",
      password: "password123",
    };

    it("throws InvitationNotFoundError when no invitation matches the token", async () => {
      mockInvitationRepo.findByHashedToken.mockResolvedValue(undefined);

      await expect(service.acceptInvitation(baseInput)).rejects.toMatchObject(
        { code: "INVITATION_NOT_FOUND" },
      );
    });

    it("throws InvitationAlreadyAcceptedError when the invitation was already accepted", async () => {
      mockInvitationRepo.findByHashedToken.mockResolvedValue({
        id: "i1",
        email: "test@example.com",
        firstName: "A",
        lastName: "B",
        role: userRole.Staff,
        status: "accepted",
        acceptedAt: new Date(),
        expiresAt: new Date(Date.now() + 100000),
      });

      await expect(service.acceptInvitation(baseInput)).rejects.toMatchObject(
        { code: "INVITATION_ALREADY_ACCEPTED" },
      );
    });

    it("throws InvitationExpiredError when the invitation is expired", async () => {
      mockInvitationRepo.findByHashedToken.mockResolvedValue({
        id: "i1",
        email: "test@example.com",
        firstName: "A",
        lastName: "B",
        role: userRole.Staff,
        status: "pending",
        acceptedAt: null,
        expiresAt: new Date(Date.now() - 1000),
      });

      await expect(service.acceptInvitation(baseInput)).rejects.toMatchObject(
        { code: "INVITATION_EXPIRED" },
      );
    });

    it("throws UserEmailAlreadyExists when the email is already taken", async () => {
      mockInvitationRepo.findByHashedToken.mockResolvedValue({
        id: "i1",
        email: "test@example.com",
        firstName: "A",
        lastName: "B",
        role: userRole.Manager,
        status: "pending",
        acceptedAt: null,
        expiresAt: new Date(Date.now() + 100000),
      });
      mockUserRepo.findByEmail.mockResolvedValue({
        id: "u1",
        name: "Existing",
        email: "test@example.com",
        emailVerified: false,
        image: null,
        role: userRole.Manager,
        banned: null,
        banReason: null,
        banExpires: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await expect(service.acceptInvitation(baseInput)).rejects.toMatchObject(
        { code: "EMAIL_ALREADY_EXISTS" },
      );
    });

    it("creates the user, claims invitation, marks email verified, and marks invitation accepted on success", async () => {
      mockInvitationRepo.findByHashedToken.mockResolvedValue({
        id: "i1",
        email: "test@example.com",
        firstName: "A",
        lastName: "B",
        role: userRole.Manager,
        status: "pending",
        acceptedAt: null,
        expiresAt: new Date(Date.now() + 100000),
      });
      mockUserRepo.findByEmail.mockResolvedValue(null);
      mockInvitationRepo.claimForAcceptance.mockResolvedValue(true);
      mockUserRepo.updateEmailVerified.mockResolvedValue(true);

      const fakeCreatedUser = {
        user: {
          id: "new-u1",
          email: "test@example.com",
          name: "A B",
        },
      };

      const authModule = await import("@/lib/auth");
      (authModule.auth.api.createUser as ReturnType<typeof vi.fn>).mockResolvedValue(
        fakeCreatedUser,
      );

      const result = await service.acceptInvitation(baseInput);

      expect(mockInvitationRepo.claimForAcceptance).toHaveBeenCalledWith("i1");
      expect(mockUserRepo.updateEmailVerified).toHaveBeenCalledWith("new-u1");
      expect(mockInvitationRepo.markAccepted).toHaveBeenCalledWith({
        invitationId: "i1",
        usedBy: "new-u1",
      });

      expect(result).toEqual({
        id: "new-u1",
        name: "A B",
        email: "test@example.com",
        role: userRole.Manager,
      });
    });

    it("throws InvitationAlreadyAcceptedError when claimForAcceptance fails", async () => {
      mockInvitationRepo.findByHashedToken.mockResolvedValue({
        id: "i1",
        email: "test@example.com",
        firstName: "A",
        lastName: "B",
        role: userRole.Manager,
        status: "pending",
        acceptedAt: null,
        expiresAt: new Date(Date.now() + 100000),
      });
      mockUserRepo.findByEmail.mockResolvedValue(null);
      mockInvitationRepo.claimForAcceptance.mockResolvedValue(false);

      await expect(service.acceptInvitation(baseInput)).rejects.toMatchObject({
        code: "INVITATION_ALREADY_ACCEPTED",
      });

      expect(mockInvitationRepo.markAccepted).not.toHaveBeenCalled();
    });
  });

  describe("getInvitationForDisplay", () => {
    it("returns not_found when no invitation exists", async () => {
      mockInvitationRepo.findByHashedToken.mockResolvedValue(undefined);
      expect(await service.getInvitationForDisplay("abc")).toEqual({
        status: "not_found",
      });
    });

    it("returns already_accepted for an accepted invitation", async () => {
      mockInvitationRepo.findByHashedToken.mockResolvedValue({
        id: "i1",
        email: "test@example.com",
        firstName: "A",
        lastName: "B",
        status: "accepted",
        acceptedAt: new Date(),
        expiresAt: new Date(),
      });

      expect(await service.getInvitationForDisplay("abc")).toEqual({
        status: "already_accepted",
      });
    });

    it("returns expired for an invitation past its expiry", async () => {
      mockInvitationRepo.findByHashedToken.mockResolvedValue({
        id: "i1",
        email: "test@example.com",
        firstName: "A",
        lastName: "B",
        status: "pending",
        acceptedAt: null,
        expiresAt: new Date(Date.now() - 1000),
      });

      expect(await service.getInvitationForDisplay("abc")).toEqual({
        status: "expired",
      });
    });

    it("returns valid invitation data for an active invitation", async () => {
      mockInvitationRepo.findByHashedToken.mockResolvedValue({
        id: "i1",
        email: "test@example.com",
        firstName: "A",
        lastName: "B",
        phoneNumber: "999",
        status: "pending",
        acceptedAt: null,
        expiresAt: new Date(Date.now() + 100000),
      });

      expect(await service.getInvitationForDisplay("abc")).toEqual({
        status: "valid",
        invitation: {
          email: "test@example.com",
          firstName: "A",
          lastName: "B",
          phoneNumber: "999",
        },
      });
    });
  });

  describe("expireInvitations", () => {
    it("returns the number of expired invitations from the repository", async () => {
      mockInvitationRepo.expireExpiredInvitations.mockResolvedValue(3);
      expect(await service.expireInvitations()).toBe(3);
      expect(mockInvitationRepo.expireExpiredInvitations).toHaveBeenCalledTimes(1);
    });
  });
});
