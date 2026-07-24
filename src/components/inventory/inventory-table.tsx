import { useMemo } from "react";

import { DataTable } from "@/components/data-table/data-table";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

import type { Ingredient } from "@/server/shared/inventory/inventory.interface";
import {
  createInventoryColumns,
  InventoryTableActions,
} from "./inventory-columns";

type InventoryTableProps = {
  data: Ingredient[];
  loading?: boolean;
  error?: { message: string };
  page: number;
  onPageChange: (page: number) => void;
  limit: number;
} & InventoryTableActions;

export function InventoryTable({
  data,
  loading = false,
  error,
  page,
  onPageChange,
  limit,
  ...actions
}: InventoryTableProps) {
  const columns = useMemo(() => createInventoryColumns(actions), [actions]);

  const hasMore = data.length >= limit;
  const hasPrev = page > 0;

  return (
    <div className="space-y-4">
      <DataTable
        columns={columns}
        data={data}
        loading={loading}
        error={error}
        sorting={actions.sorting}
        onSortingChange={actions.onSortingChange}
      />

      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(page - 1)}
          disabled={!hasPrev || loading}
          className="cursor-pointer gap-1"
        >
          <ChevronLeft className="size-4" />
          Previous
        </Button>

        <span className="text-sm text-muted-foreground">
          Page {page + 1}
        </span>

        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(page + 1)}
          disabled={!hasMore || loading}
          className="cursor-pointer gap-1"
        >
          Next
          <ChevronRight className="size-4" />
        </Button>
      </div>
    </div>
  );
}
