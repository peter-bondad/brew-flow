"use client";

import { useState, useMemo } from "react";
import { ClipboardList, Clock, ChefHat, CheckCircle2 } from "lucide-react";

import { StatusCard } from "@/components/dashboard/status-card";
import { OrdersTable } from "@/components/orders/orders-table";
import { OrdersToolbar } from "@/components/orders/orders-toolbar";
import { OrderDetailDialog } from "@/components/orders/order-detail-dialog";
import { OrderStatusDialog } from "@/components/orders/order-status-dialog";
import type { OrderListItem } from "@/server/shared/order/order.interface";
import type { SortingState } from "@tanstack/react-table";

import { useAdminOrders } from "@/lib/api/order/order.query";

const LIMIT = 20;

function statusCounts(orders: OrderListItem[]) {
  const pending = orders.filter((o) => o.status === "pending").length;
  const preparing = orders.filter((o) => o.status === "preparing").length;
  const completed = orders.filter((o) => o.status === "completed").length;

  return { pending, preparing, completed };
}

export default function OrdersPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [sorting, setSorting] = useState<SortingState>([]);

  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [statusOrderId, setStatusOrderId] = useState<string | null>(null);

  const { data, isLoading, error } = useAdminOrders({
    status: status || undefined,
    limit: LIMIT,
    offset: page * LIMIT,
  });

  const orders = useMemo(() => data?.data ?? [], [data?.data]);
  const stats = data?.stats;
  const counts = useMemo(() => statusCounts(orders), [orders]);

  return (
    <div className="flex h-full flex-col">
      {/* Hero */}
      <div className="rounded-3xl bg-[linear-gradient(135deg,#4a2b1c_0%,#6e3d1f_45%,#c67e3f_100%)] p-6 text-[#fff9f2] shadow-lg">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold">Orders</h1>
          <p className="max-w-2xl text-sm text-[#f6e7d4]">
            Track in-progress orders, update fulfillment status, and manage
            refunds from this screen.
          </p>
        </div>
      </div>

      {/* Stats */}
      <section className="mt-6 grid grid-cols-2 gap-4 xl:grid-cols-4">
        <StatusCard
          title="Total Orders"
          value={String(stats?.total ?? orders.length)}
          description="All time"
          icon={ClipboardList}
        />

        <StatusCard
          title="Pending"
          value={String(counts.pending)}
          description="Awaiting action"
          icon={Clock}
        />

        <StatusCard
          title="Preparing"
          value={String(counts.preparing)}
          description="In progress"
          icon={ChefHat}
        />

        <StatusCard
          title="Completed"
          value={String(counts.completed)}
          description="Fulfilled orders"
          icon={CheckCircle2}
        />
      </section>

      {/* Toolbar + Table */}
      <div className="mt-6 flex flex-1 min-h-0 flex-col gap-4">
        <OrdersToolbar
          search={search}
          status={status}
          onSearchChange={(value) => {
            setSearch(value);
            setPage(0);
          }}
          onStatusChange={(next) => {
            setStatus(next);
            setPage(0);
          }}
        />

        <div className="flex-1 min-h-0">
          <OrdersTable
            data={orders}
            loading={isLoading}
            error={error ? { message: error.message } : undefined}
            page={page}
            onPageChange={setPage}
            limit={LIMIT}
            sorting={sorting}
            onSortingChange={setSorting}
            onViewDetail={(order) => setSelectedOrderId(order.id)}
            onUpdateStatus={(order) => setStatusOrderId(order.id)}
            onRefund={(order) => setStatusOrderId(order.id)}
          />
        </div>
      </div>

      <OrderDetailDialog
        open={!!selectedOrderId}
        onOpenChange={(open) => !open && setSelectedOrderId(null)}
        orderId={selectedOrderId ?? ""}
      />

      <OrderStatusDialog
        open={!!statusOrderId}
        onOpenChange={(open) => !open && setStatusOrderId(null)}
        orderId={statusOrderId ?? ""}
      />
    </div>
  );
}
