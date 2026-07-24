import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Plus, Search } from "lucide-react";

type InventoryToolbarProps = {
  search: string;
  lowStockOnly?: boolean;
  onSearchChange: (value: string) => void;
  onLowStockOnlyChange?: (value: boolean) => void;
  onAddIngredient: () => void;
};

export function InventoryToolbar({
  search,
  lowStockOnly = false,
  onSearchChange,
  onLowStockOnlyChange,
  onAddIngredient,
}: InventoryToolbarProps) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="flex flex-1 items-center gap-4">
        <div className="relative w-full max-w-sm">
          <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />

          <Input
            value={search}
            placeholder="Search ingredients..."
            className="pl-9"
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        {onLowStockOnlyChange && (
          <div className="cursor-pointer flex items-center gap-2">
            <Switch
              id="low-stock"
              checked={lowStockOnly}
              onCheckedChange={onLowStockOnlyChange}
            />
            <Label htmlFor="low-stock" className="text-sm">
              Low stock only
            </Label>
          </div>
        )}
      </div>

      <Button onClick={onAddIngredient} className="cursor-pointer">
        <Plus className="mr-2 size-4" />
        Add Ingredient
      </Button>
    </div>
  );
}
