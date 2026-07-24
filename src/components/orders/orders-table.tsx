import { useMemo } from "react";

import { DataTable } from "@/components/data-table/data-table";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { OrderListItem } from "@/server/shared/order/order.interface";
import { createOrderColumns, type OrderTableActions } from "./orders-columns";

type OrdersTableProps = {
  data: OrderListItem[];
  loading?: boolean;
  error?: { message: string };
  page: number;
  onPageChange: (page: number) => void;
  limit: number;
  maxHeight?: string;
} & OrderTableActions;

export function OrdersTable({
  data,
  loading = false,
  error,
  page,
  onPageChange,
  limit,
  maxHeight = "100%",
  ...actions
}: OrdersTableProps) {
  const columns = useMemo(() => createOrderColumns(actions), [actions]);

  const colGroup = (
    <colgroup>
      <col style={{ width: "12%" }} />
      <col style={{ width: "14%" }} />
      <col style={{ width: "14%" }} />
      <col style={{ width: "14%" }} />
      <col style={{ width: "10%" }} />
      <col style={{ width: "12%" }} />
      <col style={{ width: "auto" }} />
    </colgroup>
  );

  const hasMore = data.length >= limit;
  const hasPrev = page > 0;

  return (
    <div className="flex h-full flex-col">
      <DataTable
        columns={columns}
        data={data}
        loading={loading}
        error={error}
        sorting={actions.sorting}
        onSortingChange={actions.onSortingChange}
        maxHeight={maxHeight}
        colGroup={colGroup}
      />

      <div className="flex items-center justify-between pt-4">
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
