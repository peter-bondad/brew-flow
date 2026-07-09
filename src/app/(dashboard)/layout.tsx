import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "../components/dashboard/appsidebar";
import { DashboardHeader } from "../components/dashboard/dashboard-header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar />

      <SidebarInset className="h-screen overflow-hidden">
        <DashboardHeader />
        <main className="flex-1 overflow-y-auto bg-[#fffaf5] px-8 py-6">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
