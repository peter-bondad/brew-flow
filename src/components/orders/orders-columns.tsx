import type { ColumnDef } from "@tanstack/react-table";
import type { OrderListItem } from "@/server/shared/order/order.interface";

import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { OrderRowActions } from "./orders-row-actions";
import { formatCurrency } from "@/lib/format";

export type OrderTableActions = {
  onViewDetail: (order: OrderListItem) => void;
  onUpdateStatus: (order: OrderListItem) => void;
  onRefund: (order: OrderListItem) => void;
  sorting?: import("@tanstack/react-table").SortingState;
  onSortingChange?: (
    sorting: import("@tanstack/react-table").SortingState,
  ) => void;
};

function OrderStatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    pending: "bg-[#fff3cd] text-[#6b5c10]",
    paid: "bg-[#e3f2fd] text-[#1e4d8c]",
    preparing: "bg-[#fce8e4] text-[#8a2be2]",
    ready: "bg-[#e8f5e2] text-[#2d6a32]",
    completed: "bg-[#2d6a32] text-white",
    cancelled: "bg-[#f3e7db] text-[#6b5c10]",
  };

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${styles[status] ?? "bg-muted text-muted-foreground"}`}
    >
      {status}
    </span>
  );
}

export function createOrderColumns(
  actions: OrderTableActions,
): ColumnDef<OrderListItem>[] {
  return [
    {
      accessorKey: "id",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Order" />
      ),
      cell: ({ row }) => `#${row.original.id.slice(0, 8)}`,
      enableSorting: true,
    },
    {
      accessorKey: "paymentMethod",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Payment" />
      ),
      cell: ({ row }) => row.original.paymentMethod,
      enableSorting: true,
    },
    {
      accessorKey: "itemCount",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Items" />
      ),
      cell: ({ row }) => row.original.itemCount,
      enableSorting: true,
    },
    {
      accessorKey: "total",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Total" />
      ),
      cell: ({ row }) => formatCurrency(row.original.total),
      enableSorting: true,
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Status" />
      ),
      cell: ({ row }) => (
        <OrderStatusBadge status={row.original.status} />
      ),
      enableSorting: true,
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Created" />
      ),
      cell: ({ row }) =>
        new Date(row.original.createdAt).toLocaleString("en-US", {
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
      enableSorting: true,
    },
    {
      id: "actions",
      header: () => <span className="font-bold">Action</span>,
      enableSorting: false,
      enableHiding: false,
      cell: ({ row }) => (
        <OrderRowActions
          order={row.original}
          onViewDetail={actions.onViewDetail}
          onUpdateStatus={actions.onUpdateStatus}
          onRefund={actions.onRefund}
        />
      ),
    },
  ];
}
