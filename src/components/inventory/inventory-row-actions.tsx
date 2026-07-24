import {
  MoreHorizontal,
  Pencil,
  History,
  PackagePlus,
  Scale,
} from "lucide-react";

import type { Ingredient } from "@/server/shared/inventory/inventory.interface";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type InventoryRowActionsProps = {
  ingredient: Ingredient;

  onEdit: (ingredient: Ingredient) => void;
  onRestock: (ingredient: Ingredient) => void;
  onAdjustStock: (ingredient: Ingredient) => void;
  onViewHistory: (ingredient: Ingredient) => void;
};

export function InventoryRowActions({
  ingredient,
  onEdit,
  onRestock,
  onAdjustStock,
  onViewHistory,
}: InventoryRowActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="ghost" size="icon" />}>
        <MoreHorizontal className="size-4" />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onEdit(ingredient)}>
          <Pencil className="size-4" />
          Edit
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => onRestock(ingredient)}>
          <PackagePlus className="size-4" />
          Restock
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => onAdjustStock(ingredient)}>
          <Scale className="size-4" />
          Adjust Stock
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={() => onViewHistory(ingredient)}>
          <History className="size-4" />
          View History
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
