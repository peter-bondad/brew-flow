"use client";

import { createContext, useContext } from "react";
import type { Session } from "@/lib/auth";
import { Permission } from "@/lib/permission/permissions";
import { hasPermission } from "@/lib/permission/has-permission";
import { isUserRole } from "@/server/types/user-role.types";

interface SessionContextValue {
  session: Session["session"];
  user: Session["user"];
  hasPermission(permission: Permission): boolean;
}

interface SessionProviderProps {
  session: Session;
  children: React.ReactNode;
}

const SessionContext = createContext<SessionContextValue | null>(null);
export function SessionProvider({ session, children }: SessionProviderProps) {
  const value: SessionContextValue = {
    ...session,

    hasPermission(permission) {
      if (!isUserRole(session.user.role)) {
        return false;
      }
      return hasPermission(session.user.role, permission);
    },
  };

  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
}

export function useSession() {
  const session = useContext(SessionContext);

  if (!session) {
    throw new Error("useSession must be used inside SessionProvider");
  }

  return session;
}
