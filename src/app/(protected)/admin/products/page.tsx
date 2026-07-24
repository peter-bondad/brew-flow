"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Coffee, CupSoda, Plus, Star } from "lucide-react";
import type { SortingState } from "@tanstack/react-table";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusCard } from "@/components/dashboard/status-card";
import { MenuTable } from "@/components/menu/menu-table";
import { useProducts } from "@/lib/api/product/product.query";
import type { ProductListItem } from "@/server/shared/product/product.interface";

type MenuItem = {
  name: string;
  category: string;
  price: string;
  status: string;
};

function formatPrice(cents: number): string {
  return `₱${(cents / 100).toFixed(2)}`;
}

function mapProductToMenuItem(product: ProductListItem): MenuItem {
  return {
    name: product.name,
    category: product.category,
    price: formatPrice(product.primaryVariant?.price ?? 0),
    status: product.isAvailable ? "Available" : "Unavailable",
  };
}

export default function MenuPage() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [search, setSearch] = useState("");

  const { data, isLoading, error } = useProducts({
    limit: 100,
    offset: 0,
    includeInactive: true,
    search: search || undefined,
  });

  const menuItems = useMemo(() => {
    if (!data?.data) return [];
    return data.data.map(mapProductToMenuItem);
  }, [data]);

  const total = data?.stats?.total ?? menuItems.length;
  const available = useMemo(
    () => menuItems.filter((item) => item.status === "Available").length,
    [menuItems],
  );

  return (
    <div className="space-y-8">
      {/* Hero */}

      <div className="rounded-3xl bg-[linear-gradient(135deg,#4a2b1c_0%,#6e3d1f_45%,#c67e3f_100%)] p-6 text-[#fff9f2] shadow-lg">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold">Product Management</h1>
          <p className="max-w-2xl text-sm text-[#f6e7d4]">
            Manage menu items, categories, pricing, and availability across
            your coffee shop.
          </p>
        </div>
      </div>

      {/* Stats */}

      <section className="grid grid-cols-2 gap-4 md:grid-cols-3">
        <StatusCard
          title="Total Items"
          value={String(total)}
          description="All menu entries"
          icon={CupSoda}
        />

        <StatusCard
          title="Best Seller"
          value={total > 0 ? menuItems[0].name : "—"}
          description="Top performing item"
          icon={Star}
        />

        <StatusCard
          title="Available Items"
          value={String(available)}
          description="Currently in stock"
          icon={Coffee}
        />
      </section>

      {/* Table */}

      <div className="flex flex-1 min-h-0 flex-col gap-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="flex items-center gap-2 text-lg font-semibold text-[#3d2413]">
              <Coffee className="h-5 w-5 text-[#8d5a2b]" />
              Products
            </h2>

            <p className="mt-1 text-sm text-[#7b5f46]">
              Browse and manage your coffee shop product catalog..
            </p>
          </div>

          <div className="relative w-full md:w-80">
            <Input
              placeholder="Search products..."
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="flex-1 min-h-0">
          <MenuTable
            data={menuItems}
            loading={isLoading}
            error={error ? { message: error.message } : undefined}
            sorting={sorting}
            onSortingChange={setSorting}
          />
        </div>
      </div>
    </div>
  );
}
