"use client";

import { useEffect, useMemo, useState } from "react";
import { Bell, Package, TriangleAlert, X } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

type NotificationItem = {
  id: string;
  type: "order" | "stock";
  title: string;
  description: string;
  href?: string;
  timestamp?: string;
};

const MAX_ITEMS = 8;

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pendingCount = useMemo(
    () => items.filter((item) => item.type === "order").length,
    [items],
  );
  const lowStockCount = useMemo(
    () => items.filter((item) => item.type === "stock").length,
    [items],
  );
  const hasUnread = pendingCount > 0 || lowStockCount > 0;

  useEffect(() => {
    if (!open) return;
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);

      try {
        const [ordersRes, inventoryRes] = await Promise.all([
          fetch("/api/admin/orders?status=pending&limit=5&offset=0", {
            cache: "no-store",
          }),
          fetch("/api/admin/inventory?lowStockOnly=true&limit=5&offset=0", {
            cache: "no-store",
          }),
        ]);

        if (!ordersRes.ok || !inventoryRes.ok) {
          throw new Error("Failed to load notifications.");
        }

        const ordersJson = await ordersRes.json();
        const inventoryJson = await inventoryRes.json();

        if (cancelled) return;

        const notifications: NotificationItem[] = [];

        for (const order of ordersJson.data ?? []) {
          notifications.push({
            id: `order-${order.id}`,
            type: "order",
            title: `Order ${order.id.slice(0, 8)}`,
            description: `${order.itemCount} item${order.itemCount === 1 ? "" : "s"} · ₱${(order.total / 100).toFixed(2)}`,
            href: `/admin/orders`,
            timestamp: order.createdAt,
          });
        }

        for (const ingredient of inventoryJson.data ?? []) {
          notifications.push({
            id: `stock-${ingredient.id}`,
            type: "stock",
            title: ingredient.name,
            description: `Stock: ${ingredient.currentStock} ${ingredient.unit}`,
            href: "/admin/inventory",
            timestamp: ingredient.updatedAt,
          });
        }

        notifications.sort((a, b) => {
          const aTime = a.timestamp ? new Date(a.timestamp).getTime() : 0;
          const bTime = b.timestamp ? new Date(b.timestamp).getTime() : 0;
          return bTime - aTime;
        });

        setItems(notifications.slice(0, MAX_ITEMS));
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className="relative cursor-pointer rounded-full hover:bg-[#f6eadf]"
            aria-label="Notifications"
          >
            <Bell className="size-5 text-[#6f3e1d]" />

            {hasUnread && (
              <span className="absolute inset-0 flex size-full items-center justify-center">
                <span className="relative flex size-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-destructive opacity-80" />
                  <span className="relative inline-flex size-2.5 rounded-full bg-destructive" />
                </span>
              </span>
            )}
          </Button>
        }
      />

      <PopoverContent
        align="end"
        className="w-80 rounded-2xl border border-[#ead7c4] p-0 shadow-xl"
      >
        <div className="flex items-center justify-between border-b border-[#f3e7db] px-4 py-3">
          <div>
            <p className="text-sm font-semibold text-[#3d2413]">Notifications</p>

            {hasUnread && (
              <p className="text-xs text-[#7b5f46]">
                {pendingCount > 0 && `${pendingCount} pending order${pendingCount === 1 ? "" : "s"}`}
                {pendingCount > 0 && lowStockCount > 0 && " · "}
                {lowStockCount > 0 && `${lowStockCount} low stock`}
              </p>
            )}
          </div>

          <Button
            variant="ghost"
            size="icon-sm"
            className="h-7 w-7 cursor-pointer rounded-full"
            onClick={() => setOpen(false)}
          >
            <X className="size-4" />
            <span className="sr-only">Close</span>
          </Button>
        </div>

        <div className="max-h-80 overflow-y-auto">
          {error ? (
            <div className="p-4 text-sm text-destructive">{error}</div>
          ) : loading ? (
            <div className="space-y-2 p-3">
              {Array.from({ length: 4 }).map((_, idx) => (
                <div key={idx} className="h-12 animate-pulse rounded-xl bg-muted" />
              ))}
            </div>
          ) : items.length === 0 ? (
            <div className="p-6 text-center text-sm text-muted-foreground">
              All caught up.
            </div>
          ) : (
            <div className="p-2">
              {items.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className="flex w-full cursor-pointer items-start gap-3 rounded-xl px-2 py-2 text-left transition-colors hover:bg-[#fdf6ef]"
                  onClick={() => {
                    setOpen(false);
                    if (item.href) {
                      window.location.href = item.href;
                    }
                  }}
                >
                  <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-[#f6eadf] text-[#6f3e1d]">
                    {item.type === "order" ? (
                      <Package className="size-4" />
                    ) : (
                      <TriangleAlert className="size-4" />
                    )}
                  </span>

                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium text-[#3d2413]">
                      {item.title}
                    </span>
                    <span className="block truncate text-xs text-[#7b5f46]">
                      {item.description}
                    </span>
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <>
            <Separator className="bg-[#f3e7db]" />

            <div className="p-2">
              <Button
                variant="ghost"
                className="w-full cursor-pointer justify-center text-xs"
                onClick={() => {
                  setOpen(false);
                  window.location.href = "/admin/orders";
                }}
              >
                View all orders
              </Button>
            </div>
          </>
        )}
      </PopoverContent>
    </Popover>
  );
}
