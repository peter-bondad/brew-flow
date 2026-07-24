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

describe("requireSession", () => {
  it("returns session when getSession resolves with a session", async () => {
    const { getSession } = await import("@/server/auth/get-session");
    (getSession as ReturnType<typeof vi.fn>).mockResolvedValue({ user: { id: "u1" } });

    const { requireSession } = await import("@/server/auth/require-session");

    const session = await requireSession();
    expect(session).toEqual({ user: { id: "u1" } });
    expect(getSession).toHaveBeenCalledTimes(1);
  });

  it("throws a redirect to /login when getSession returns null", async () => {
    const { getSession } = await import("@/server/auth/get-session");
    (getSession as ReturnType<typeof vi.fn>).mockResolvedValue(null);

    const { requireSession } = await import("@/server/auth/require-session");

    await expect(requireSession()).rejects.toThrow("REDIRECT:/login");
  });
});
