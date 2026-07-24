import { describe, it, expect, vi } from "vitest";
import { redirect } from "next/navigation";

vi.mock("next/navigation", () => ({
  redirect: vi.fn((path: string) => {
    throw new Error(`REDIRECT:${path}`);
  }),
}));

vi.mock("@/server/auth/get-session", () => ({
  getSession: vi.fn(),
}));

vi.mock("@/lib/auth", () => ({
  auth: {
    api: {
      userHasPermission: vi.fn(),
    },
  },
}));

describe("requirePermission", () => {
  it("returns the session when the permission check succeeds", async () => {
    const { getSession } = await import("@/server/auth/get-session");
    (getSession as ReturnType<typeof vi.fn>).mockResolvedValue({ user: { id: "u1" } });

    const authModule = await import("@/lib/auth");
    (authModule.auth.api.userHasPermission as ReturnType<typeof vi.fn>).mockResolvedValue({ success: true });

    const { requirePermission } = await import("@/server/auth/require-permission");

    const session = await requirePermission("invitation:create");
    expect(session).toEqual({ user: { id: "u1" } });
    expect(authModule.auth.api.userHasPermission).toHaveBeenCalledWith({
      body: { userId: "u1", permissions: "invitation:create" },
    });
  });

  it("throws a redirect to /forbidden when the permission check fails", async () => {
    const { getSession } = await import("@/server/auth/get-session");
    (getSession as ReturnType<typeof vi.fn>).mockResolvedValue({ user: { id: "u1" } });

    const authModule = await import("@/lib/auth");
    (authModule.auth.api.userHasPermission as ReturnType<typeof vi.fn>).mockResolvedValue({ success: false });

    const { requirePermission } = await import("@/server/auth/require-permission");

    await expect(requirePermission("invitation:create")).rejects.toThrow(
      "REDIRECT:/forbidden",
    );
  });
});
