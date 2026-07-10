import { auth } from "@/lib/auth";
import type { Permission } from "@/lib/permissions";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export async function ensurePermission(permission: Permission) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  const result = await auth.api.userHasPermission({
    body: {
      userId: session.user.id,
      permissions: permission,
    },
  });

  if (!result.success) {
    redirect("/forbidden");
  }

  return session;
}
