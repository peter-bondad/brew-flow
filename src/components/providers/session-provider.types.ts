import type { Session } from "@/lib/auth";
import type { Permission } from "@/lib/permission/permissions";

export interface SessionContextValue {
  session: Session["session"];
  user: Session["user"];

  hasPermission(permission: Permission): boolean;
}
