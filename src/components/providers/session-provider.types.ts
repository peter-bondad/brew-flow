import { AuthSession, UserAuth } from "@/lib/auth-types";
import { Permission } from "@/lib/permission/permissions";

export interface SessionContextValue {
  session: AuthSession["session"];
  user: UserAuth;
  hasPermission(permission: Permission): boolean;
}
