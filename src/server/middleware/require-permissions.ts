import { auth } from "@/lib/auth";
import { Context, Next } from "hono";
import { Env } from "../types/hono-types";

export function requirePermission(permissions: Record<string, string[]>) {
  return async (c: Context<Env>, next: Next) => {
    const user = c.get("user");

    const result = await auth.api.userHasPermission({
      body: {
        userId: user!.id, // already authenticated, so user is guaranteed to exist
        permissions,
      },
    });

    // Check the return shape for your Better Auth version.
    if (!result.success) {
      return c.json({ message: "Forbidden" }, 403);
    }

    await next();
  };
}
