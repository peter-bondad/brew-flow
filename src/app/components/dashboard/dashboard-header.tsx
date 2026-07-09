import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { UserNav } from "./user-nav";

export async function DashboardHeader() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-end bg-[#fffaf5]/90 px-8 backdrop-blur">
      <UserNav user={session?.user ?? null} />
    </header>
  );
}
