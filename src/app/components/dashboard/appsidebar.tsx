"use client";
import { usePathname } from "next/navigation";

import {
  Coffee,
  LayoutDashboard,
  MailPlus,
  Users,
  CupSoda,
  Package,
  ShoppingBag,
  BarChart3,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import Link from "next/link";

const navigation = [
  {
    title: "Overview",
    items: [
      {
        title: "Dashboard",
        href: "/admin",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    title: "Operations",
    items: [
      {
        title: "Menu",
        href: "/admin/menu",
        icon: CupSoda,
      },
      {
        title: "Inventory",
        href: "/admin/inventory",
        icon: Package,
      },
      {
        title: "Orders",
        href: "/admin/orders",
        icon: ShoppingBag,
      },
    ],
  },
  {
    title: "Staff",
    items: [
      {
        title: "Users",
        href: "/admin/users",
        icon: Users,
      },
      {
        title: "Invitations",
        href: "/admin/invitations",
        icon: MailPlus,
      },
    ],
  },
  {
    title: "Analytics",
    items: [
      {
        title: "Reports",
        href: "/admin/reports",
        icon: BarChart3,
      },
    ],
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-3 px-3 py-4">
          <div className="flex size-10 items-center justify-center rounded-xl bg-[#6f3e1d] text-[#fff8ef]">
            <Coffee className="size-5" />
          </div>

          <div>
            <h1 className="font-semibold text-[#3d2413]">Coffee House</h1>
            <p className="text-xs text-[#7b5f46]">Admin Panel</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2">
        {navigation.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel className="text-[#8d5a2b]">
              {group.title}
            </SidebarGroupLabel>

            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      render={<Link href={item.href} />}
                      isActive={
                        pathname === item.href ||
                        (item.href !== "/admin" &&
                          pathname.startsWith(item.href))
                      }
                    >
                      <item.icon />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  );
}
