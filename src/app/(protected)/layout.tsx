import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { requireSession } from "@/server/auth/require-session";
import { AppSidebar } from "./admin/products/components/appsidebar";
import { SessionProvider } from "@/components/providers/session-provider";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireSession();

  return (
    <SessionProvider session={session}>
      <SidebarProvider>
        <AppSidebar user={session.user} />
        <SidebarInset className="flex h-screen flex-col overflow-hidden">
          <main className="flex-1 overflow-y-auto bg-[#fffaf5] px-8 py-6">
            {children}
          </main>
        </SidebarInset>
      </SidebarProvider>
    </SessionProvider>
  );
}
