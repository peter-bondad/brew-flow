"use client";
import { useSession } from "@/components/providers/session-provider";
import { UserNav } from "./user-nav";

export function DashboardHeader() {
  const session = useSession();

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-end bg-[#fffaf5]/90 px-8 backdrop-blur">
      <UserNav user={session.user} />
    </header>
  );
}
