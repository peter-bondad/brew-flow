import type { ColumnDef } from "@tanstack/react-table";

import type { Ingredient } from "@/server/shared/inventory/inventory.interface";

import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { StockBadge } from "./stock-badge";
import { InventoryRowActions } from "./inventory-row-actions";
import { formatCurrency } from "@/lib/format";

export type InventoryTableActions = {
  onEdit: (ingredient: Ingredient) => void;
  onRestock: (ingredient: Ingredient) => void;
  onAdjustStock: (ingredient: Ingredient) => void;
  onViewHistory: (ingredient: Ingredient) => void;
  sorting?: import("@tanstack/react-table").SortingState;
  onSortingChange?: (
    sorting: import("@tanstack/react-table").SortingState,
  ) => void;
};

export function createInventoryColumns(
  actions: InventoryTableActions,
): ColumnDef<Ingredient>[] {
  return [
    {
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Ingredient" />
      ),
      enableSorting: true,
      meta: { sortBy: "name" },
    },

    {
      accessorKey: "sku",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="SKU" />
      ),
      cell: ({ row }) => row.original.sku ?? "—",
      enableSorting: true,
      meta: { sortBy: "sku" },
    },

    {
      accessorKey: "currentStock",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Stock" />
      ),
      cell: ({ row }) => `${row.original.currentStock} ${row.original.unit}`,
      enableSorting: true,
      meta: { sortBy: "currentStock" },
    },

    {
      accessorKey: "minimumStockLevel",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Min. Stock" />
      ),
      enableSorting: true,
      meta: { sortBy: "minimumStockLevel" },
    },

    {
      id: "status",
      header: "Status",
      enableSorting: false,
      cell: ({ row }) => (
        <StockBadge
          currentStock={row.original.currentStock}
          minimumStockLevel={row.original.minimumStockLevel}
        />
      ),
    },

    {
      accessorKey: "averageUnitCost",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Unit Cost" />
      ),
      cell: ({ row }) => formatCurrency(row.original.averageUnitCost),
      enableSorting: true,
      meta: { sortBy: "averageUnitCost" },
    },

    {
      id: "actions",
      header: () => <span className="font-bold">Action</span>,
      enableSorting: false,
      enableHiding: false,
      cell: ({ row }) => (
        <InventoryRowActions
          ingredient={row.original}
          onEdit={actions.onEdit}
          onRestock={actions.onRestock}
          onAdjustStock={actions.onAdjustStock}
          onViewHistory={actions.onViewHistory}
        />
      ),
    },
  ];
}
