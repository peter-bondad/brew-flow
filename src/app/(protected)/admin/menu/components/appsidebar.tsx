"use client";

import Link from "next/link";
import { useMemo } from "react";
import { usePathname } from "next/navigation";

import { Coffee } from "lucide-react";

import { useSession } from "@/components/providers/session-provider";
import { navigation } from "../config/navigation";

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

export function AppSidebar() {
  const pathname = usePathname();

  const { hasPermission } = useSession();

  const visibleNavigation = useMemo(() => {
    return navigation
      .map((group) => ({
        ...group,
        items: group.items.filter((item) => {
          if (!item.permission) {
            return true;
          }

          return hasPermission(item.permission);
        }),
      }))
      .filter((group) => group.items.length > 0);
  }, [hasPermission]);

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-3 px-3 py-4">
          <div className="flex size-10 items-center justify-center rounded-xl bg-[#6f3e1d] text-[#fff8ef]">
            <Coffee className="size-5" />
          </div>

          <div>
            <h1 className="font-semibold text-[#3d2413]">BrewFlow</h1>

            <p className="text-xs text-[#7b5f46]">Admin Panel</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2">
        {visibleNavigation.map((group) => (
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
