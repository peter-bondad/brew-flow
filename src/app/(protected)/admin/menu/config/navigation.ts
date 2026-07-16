import type { NavigationGroup } from "./navigation.types";

import {
  BarChart3,
  CupSoda,
  LayoutDashboard,
  MailPlus,
  Package,
  ShoppingBag,
  Users,
} from "lucide-react";

export const navigation: NavigationGroup[] = [
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
        permission: {
          user: ["read"],
        },
      },
      {
        title: "Invitations",
        href: "/admin/invite",
        icon: MailPlus,
        permission: {
          invitation: ["read"],
        },
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
        permission: {
          report: ["read"],
        },
      },
    ],
  },
];
