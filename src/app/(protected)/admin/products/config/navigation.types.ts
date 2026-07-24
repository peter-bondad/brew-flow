import { Permission } from "@/lib/permission/permissions";
import { LucideIcon } from "lucide-react";

export interface NavigationItem {
  title: string;

  href: string;

  icon: LucideIcon;

  permission?: Permission;
}

export interface NavigationGroup {
  title: string;

  items: NavigationItem[];
}
