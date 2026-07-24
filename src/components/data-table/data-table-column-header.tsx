import type { Column } from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";

type DataTableColumnHeaderProps<TData, TValue> = {
  column: Column<TData, TValue>;
  title: string;
};

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
}: DataTableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort()) {
    return <span className="font-medium">{title}</span>;
  }

  return (
    <Button
      variant="ghost"
      type="button"
      className="cursor-pointer h-auto justify-start p-0 font-semibold hover:bg-transparent"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    >
      <span>{title}</span>

      {column.getIsSorted() === "asc" ? (
        <ArrowUp className="ml-2 size-4" />
      ) : column.getIsSorted() === "desc" ? (
        <ArrowDown className="ml-2 size-4" />
      ) : (
        <ArrowUpDown className="text-muted-foreground ml-2 size-4" />
      )}
    </Button>
  );
}
